function success(res, data = null, status = 200) {
    return res.status(status).json({
        success: true,
        data
    });
}

function fail(res, message = 'Bad Request', status = 400, details = null) {
    return res.status(status).json({
        success: false,
        error: {
            message,
            details
        }
    });
}

module.exports = { success, fail };
