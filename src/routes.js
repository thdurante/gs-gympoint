import { Router } from 'express';
import authMiddleware from './app/middlewares/auth';
import SessionsController from './app/controllers/SessionsController';
import StudentsController from './app/controllers/StudentsController';

const routes = new Router();

routes.post('/sessions', SessionsController.store);

// From this point down, every route goes trough the authMiddleware
routes.use(authMiddleware);

routes.post('/students', StudentsController.store);
routes.put('/students/:id', StudentsController.update);

export default routes;
