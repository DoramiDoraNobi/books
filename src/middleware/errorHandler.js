const { fail } = require('../utils/response');

module.exports = (err, req, res, next) => {
    console.error(err.stack);
    // send a structured error response
    return fail(res, 'Internal Server Error', 500, [{ message: err.message }]);
};