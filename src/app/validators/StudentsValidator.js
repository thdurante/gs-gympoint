import * as Yup from 'yup';
import BaseValidator from './BaseValidator';
import Student from '../models/Student';

class StudentsValidator extends BaseValidator {
  static get STUDENT_ALREADY_EXISTS_ERROR() {
    return 'User not found';
  }

  async validateStoreSchema() {
    const storeSchema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await storeSchema.isValid(this.req.body)))
      return this.res
        .status(400)
        .json({ error: StudentsValidator.SCHEMA_VALIDATION_ERROR });
  }

  async validateStudentAlreadyExists() {
    const { email } = this.req.body;
    const student = await Student.findOne({ where: { email } });

    if (student)
      return this.res.status(400).json({
        error: StudentsValidator.STUDENT_ALREADY_EXISTS_ERROR,
      });
  }
}

export default StudentsValidator;
