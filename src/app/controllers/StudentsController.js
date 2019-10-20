import Student from '../models/Student';
import StudentsValidator from '../validators/StudentsValidator';

class StudentsController {
  async store(req, res) {
    const studentsValidator = new StudentsValidator(req, res);

    await studentsValidator.validateStoreSchema();
    await studentsValidator.validateStudentAlreadyExists();

    const student = await Student.create(req.body);
    return res.json(student);
  }

  async update(req, res) {}
}

export default new StudentsController();
