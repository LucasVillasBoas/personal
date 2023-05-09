import { Router } from 'express';
import AccountController from 'controllers/AccountController';

const routes = Router();
const accountController = new AccountController();

routes.post('/', accountController.create);
routes.get('/', accountController.getAll);
routes.get('/:id', accountController.get);
routes.get('/user/:idUser', accountController.getUserAccounts);
routes.put('/:id', accountController.update);
routes.put('/activate/:id', accountController.activate);
routes.delete('/:id', accountController.delete);

export default routes;