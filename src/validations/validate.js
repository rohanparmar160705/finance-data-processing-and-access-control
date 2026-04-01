const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    return res.status(422).json({
      message: 'Validation failed',
      errors: err.errors,
    });
  }
};

module.exports = validate;