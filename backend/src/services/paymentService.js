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

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
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
            cancel_url: `${frontendUrl}/payment-cancel`,
            metadata: {
                paymentId: payment.id.toString(),
                userId: userId.toString(),
                courseId: courseId.toString()
            }
        });

        return {
            message: "Checkout session created successfully",
            url: session.url,
            sessionId: session.id,
            paymentId: payment.id
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.verifyPayment = async (data) => {
    const { sessionId, paymentId } = data;

    if (!sessionId || !paymentId) {
        throw new Error("Session ID and Payment ID are required");
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (!session) {
            throw new Error("Invalid payment session");
        }

        if (session.payment_status !== 'paid') {
            throw new Error("Payment not completed");
        }

        const payment = await prisma.payment.findUnique({
            where: { id: Number(paymentId) }
        });

        if (!payment) {
            throw new Error("Payment record not found");
        }

        await prisma.payment.update({
            where: { id: Number(paymentId) },
            data: {
                status: 'PAID',
                transactionId: session.payment_intent || session.id
            }
        });

        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: payment.userId,
                    courseId: payment.courseId
                }
            }
        });

        let enrollment = existingEnrollment;
        if (!existingEnrollment) {
            enrollment = await prisma.enrollment.create({
                data: {
                    userId: payment.userId,
                    courseId: payment.courseId
                }
            });
        }

        return {
            message: "Payment verified successfully and user enrolled",
            enrollment
        };
    } catch (error) {
        throw new Error(error.message);
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
