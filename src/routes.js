import { Router } from 'express';
import SessionsController from './app/controllers/SessionsController';

const routes = new Router();

routes.post('/sessions', SessionsController.store);

export default routes;
