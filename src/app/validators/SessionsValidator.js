import * as Yup from 'yup';

class SessionsValidator {
  static get SCHEMA_VALIDATION_ERROR() {
    return 'Schema validation fails';
  }

  static get USER_NOT_FOUND_ERROR() {
    return 'User not found';
  }

  static get NOT_MATCHING_PASSWORD() {
    return 'Password does not match';
  }

  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  async validateStoreSchema() {
    const storeSchema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await storeSchema.isValid(this.req.body)))
      return this.res
        .status(400)
        .json({ error: SessionsValidator.SCHEMA_VALIDATION_ERROR });
  }

  validateExistingUser(user) {
    if (!user)
      return this.res
        .status(401)
        .json({ error: SessionsValidator.USER_NOT_FOUND_ERROR });
  }

  async validateMatchingPassword(user, password) {
    if (!(await user.checkPassword(password)))
      return this.res.status(401).json({ error: 'Password does not match' });
  }
}

export default SessionsValidator;
