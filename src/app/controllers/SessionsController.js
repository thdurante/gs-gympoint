import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionValidator {
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
        .json({ error: SessionValidator.SCHEMA_VALIDATION_ERROR });
  }

  validateExistingUser(user) {
    if (!user)
      return this.res
        .status(401)
        .json({ error: SessionValidator.USER_NOT_FOUND_ERROR });
  }

  async validateMatchingPassword(user, password) {
    if (!(await user.checkPassword(password)))
      return this.res.status(401).json({ error: 'Password does not match' });
  }
}

class SessionsController {
  async store(req, res) {
    const { email, password } = req.body;
    const sessionValidator = new SessionValidator(req, res);

    await sessionValidator.validateStoreSchema();

    const user = await User.findOne({ where: { email } });
    const { id, name } = user || {};

    sessionValidator.validateExistingUser(user);
    await sessionValidator.validateMatchingPassword(user, password);

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionsController();
