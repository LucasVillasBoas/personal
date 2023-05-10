import { Router } from 'express';
import UserController from 'controllers/UserController';
import { authentication } from "middlewares/auth";


const routes = Router();
const userController = new UserController();

routes.post('/', userController.create);
routes.get('/', userController.getAll);
routes.get('/:id', userController.get);
routes.put('/:id', userController.update);
routes.put('/activate/:id', userController.activate);
routes.delete('/:id', userController.delete);


export default routes;