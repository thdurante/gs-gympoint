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

  async update(req, res) {
    const studentsValidator = new StudentsValidator(req, res);
    await studentsValidator.validateUpdateSchema();

    const { id } = req.params;
    let student = await Student.findByPk(id);
    studentsValidator.validateExistingStudent(student);

    const { email } = req.body;

    if (email && email !== student.email)
      await studentsValidator.validateStudentAlreadyExists();

    student = await student.update(req.body);
    return res.json(student);
  }
}

export default new StudentsController();
