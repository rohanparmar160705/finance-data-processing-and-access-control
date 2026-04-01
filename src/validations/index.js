const authSchema = require('./auth.schema');
const validate = require('./validate');

module.exports = {
  ...authSchema,
  validate,
};