const paymentService = require("../services/paymentService");

const handleControllerError = (res, error, context) => {
    console.error(`Error in ${context}:`, error);
    const message = error?.message || "An error occurred";

    if (message.includes("required") || message.includes("already enrolled") || message.includes("Payment not completed")) {
        return res.status(400).json({ message });
    }

    if (message.includes("not found")) {
        return res.status(404).json({ message });
    }

    return res.status(500).json({ message: "Internal server error" });
};

exports.createCheckoutSession = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId, frontendUrl: clientFrontendUrl } = req.body;

        let origin = clientFrontendUrl || req.get('origin');
        if (!origin && req.get('referer')) {
            try {
                origin = new URL(req.get('referer')).origin;
            } catch {
                origin = null;
            }
        }

        const result = await paymentService.createCheckoutSession({ 
            userId, 
            courseId,
            frontendUrl: origin
        });
        return res.status(201).json(result);
    } catch (error) {
        return handleControllerError(res, error, "createCheckoutSession controller");
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { sessionId, paymentId } = req.body;
        const result = await paymentService.verifyPayment({ sessionId, paymentId });
        return res.status(200).json(result);
    } catch (error) {
        return handleControllerError(res, error, "verifyPayment controller");
    }
};

exports.getUserPayments = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await paymentService.getUserPayments({ userId });
        return res.status(200).json(result);
    } catch (error) {
        return handleControllerError(res, error, "getUserPayments controller");
    }
};
