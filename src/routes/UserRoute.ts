import { Router } from 'express';
import UserController from 'controllers/UserController';
import { authLogin, verifyJwtToken, verifyJwtTokenMaster } from "middlewares/auth";


const routes = Router();
const userController = new UserController();

// routes.post('/', userController.create);
routes.get('/', verifyJwtTokenMaster, userController.getAll);
routes.get('/:id', verifyJwtToken, userController.get);
routes.put('/:id', userController.update);
routes.put('/activate/:id', userController.activate);
routes.delete('/:id', userController.delete);




export default routes;