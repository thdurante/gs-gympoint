import jwt from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../../config/auth';
import SessionsValidator from '../validators/SessionsValidator';

class SessionsController {
  async store(req, res) {
    const { email, password } = req.body;
    const sessionValidator = new SessionsValidator(req, res);

    await sessionValidator.validateStoreSchema();

    const user = await User.findOne({ where: { email } });
    const { id, name } = user || {};

    sessionValidator.validateExistingUser(user);
    await sessionValidator.validateMatchingPassword(user, password);

    return res.json({
      user: { id, name, email },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionsController();
