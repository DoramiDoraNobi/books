const { fail } = require('../utils/response');

function isIntegerLike(v) {
    if (v === null || v === undefined) return false;
    const n = Number(v);
    return Number.isFinite(n) && Number.isInteger(n);
}

function validateCreate(req, res, next) {
    const body = req.body || {};
    const errors = [];

    if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
        errors.push({ field: 'title', message: 'title is required and must be a non-empty string' });
    }
    if (!body.author || typeof body.author !== 'string' || body.author.trim() === '') {
        errors.push({ field: 'author', message: 'author is required and must be a non-empty string' });
    }

    if (Object.prototype.hasOwnProperty.call(body, 'published_year') && !isIntegerLike(body.published_year)) {
        errors.push({ field: 'published_year', message: 'published_year must be an integer year' });
    }
    if (Object.prototype.hasOwnProperty.call(body, 'publishedYear') && !isIntegerLike(body.publishedYear)) {
        errors.push({ field: 'publishedYear', message: 'publishedYear must be an integer year' });
    }
    if (Object.prototype.hasOwnProperty.call(body, 'publishedDate') && isNaN(new Date(body.publishedDate))) {
        errors.push({ field: 'publishedDate', message: 'publishedDate must be a valid date string' });
    }
    if (Object.prototype.hasOwnProperty.call(body, 'published_date') && isNaN(new Date(body.published_date))) {
        errors.push({ field: 'published_date', message: 'published_date must be a valid date string' });
    }

    if (errors.length) return fail(res, 'Invalid request body', 400, errors);
    return next();
}

function validateUpdate(req, res, next) {
    const body = req.body || {};
    const errors = [];

    if (Object.keys(body).length === 0) {
        return fail(res, 'Request body is empty; nothing to update', 400, null);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'published_year') && !isIntegerLike(body.published_year)) {
        errors.push({ field: 'published_year', message: 'published_year must be an integer year' });
    }
    if (Object.prototype.hasOwnProperty.call(body, 'publishedYear') && !isIntegerLike(body.publishedYear)) {
        errors.push({ field: 'publishedYear', message: 'publishedYear must be an integer year' });
    }
    if (Object.prototype.hasOwnProperty.call(body, 'publishedDate') && isNaN(new Date(body.publishedDate))) {
        errors.push({ field: 'publishedDate', message: 'publishedDate must be a valid date string' });
    }
    if (Object.prototype.hasOwnProperty.call(body, 'published_date') && isNaN(new Date(body.published_date))) {
        errors.push({ field: 'published_date', message: 'published_date must be a valid date string' });
    }

    if (errors.length) return fail(res, 'Invalid request body', 400, errors);
    return next();
}

module.exports = { validateCreate, validateUpdate };
