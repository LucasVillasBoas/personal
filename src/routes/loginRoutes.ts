import { Router } from 'express';
import UserController from 'controllers/UserController';
import { authLogin } from 'middlewares/auth';

const routes = Router();
const userController = new UserController();

routes.post('/', authLogin, userController.login);


export default routes;