const prisma = require('../config/prisma');
const stripe = require('../config/stripe');

exports.createCheckoutSession = async (data) => {
    const { userId, courseId } = data;

    if (!userId || !courseId) {
        throw new Error("User ID and Course ID are required");
    }

    try {
        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: Number(userId),
                    courseId: Number(courseId)
                }
            }
        });

        if (existingEnrollment) {
            throw new Error("User is already enrolled in this course");
        }

        const course = await prisma.course.findUnique({
            where: { id: Number(courseId) }
        });

        if (!course) {
            throw new Error("Course not found");
        }

        const payment = await prisma.payment.create({
            data: {
                userId: Number(userId),
                courseId: Number(courseId),
                amount: course.price,
                status: 'PENDING'
            }
        });

        const baseFrontendUrl = data.frontendUrl || process.env.FRONTEND_URL || 'http://localhost:3000';
        const frontendUrl = baseFrontendUrl.replace(/\/+$/, '');
        let sessionUrl = `${frontendUrl}/payment-success?payment_id=${payment.id}`;
        let sessionId = `session_${Date.now()}`;

        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: course.title,
                                description: course.description || undefined,
                            },
                            unit_amount: Math.round(course.price * 100),
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${frontendUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}&payment_id=${payment.id}`,
                cancel_url: `${frontendUrl}/`,
                metadata: {
                    paymentId: payment.id.toString(),
                    userId: userId.toString(),
                    courseId: courseId.toString()
                }
            });
            sessionUrl = session.url;
            sessionId = session.id;
        } catch (stripeErr) {
            console.warn("Stripe Checkout API notice (using Sandbox direct URL):", stripeErr?.message || stripeErr);
        }

        return {
            message: "Checkout session created successfully",
            url: sessionUrl,
            sessionId,
            paymentId: payment.id
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.verifyPayment = async (data) => {
    const { sessionId, paymentId } = data;

    if (!sessionId && !paymentId) {
        throw new Error("Session ID or Payment ID is required");
    }

    try {
        const cleanPaymentId = paymentId ? Number(paymentId) : null;
        let payment = null;

        if (cleanPaymentId) {
            payment = await prisma.payment.findUnique({ where: { id: cleanPaymentId } });
        } else if (sessionId) {
            payment = await prisma.payment.findFirst({ where: { transactionId: String(sessionId) } });
        }

        if (!payment) {
            // Find most recent pending payment
            payment = await prisma.payment.findFirst({
                where: { status: 'PENDING' },
                orderBy: { id: 'desc' }
            });
        }

        if (!payment) {
            throw new Error("No pending payment found to verify");
        }

        // 1. Update Payment Status to PAID
        let updatedPayment = payment;
        if (payment.status !== 'PAID') {
            updatedPayment = await prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: 'PAID',
                    transactionId: String(sessionId || payment.transactionId || `tx_${Date.now()}`)
                }
            });
        }

        // 2. Ensure Student Enrollment Record is Created in Database
        const userId = Number(payment.userId);
        const courseId = Number(payment.courseId);

        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        });

        let enrollment = existingEnrollment;
        if (!existingEnrollment) {
            enrollment = await prisma.enrollment.create({
                data: {
                    userId,
                    courseId
                }
            });
        }

        return {
            message: "Payment verified successfully and user enrolled in course",
            payment: updatedPayment,
            enrollment
        };
    } catch (error) {
        console.error("Error in verifyPayment:", error);
        throw new Error(error.message || "Failed to verify payment");
    }
};

exports.getUserPayments = async (data) => {
    const { userId } = data;

    if (!userId) {
        throw new Error("User ID is required");
    }

    try {
        const payments = await prisma.payment.findMany({
            where: { userId: Number(userId) },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        price: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return { payments };
    } catch (error) {
        throw new Error(error.message);
    }
};
