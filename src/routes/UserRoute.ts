import { Router } from 'express';
import UserController from 'controllers/UserController';
import { authLogin, verifyJwtToken } from "middlewares/auth";


const routes = Router();
const userController = new UserController();

routes.post('/', userController.create);
routes.get('/', verifyJwtToken, userController.getAll);
routes.get('/:id', userController.get);
routes.put('/:id', userController.update);
routes.put('/activate/:id', userController.activate);
routes.delete('/:id', userController.delete);

routes.get('/balance/:id', userController.getBalance);



export default routes;