import { Router } from 'express';
import AccountController from 'controllers/AccountController';
import { verifyJwtToken, verifyJwtTokenMaster } from 'middlewares/auth';
import TransferController from 'controllers/TransferController';
import UserController from 'controllers/UserController';

const routes = Router()

const accountController = new AccountController();
const transferController = new TransferController();
const userController = new UserController();

routes.post('/', accountController.create);
routes.get('/', accountController.getAll);
routes.get('/:id', accountController.get);
routes.get('/user/:idUser', accountController.getUserAccounts);
routes.put('/activate/:id', accountController.activate);
routes.delete('/:id', accountController.delete);

//using
routes.put('/:id', /*verifyJwtTokenMaster,*/ accountController.update);


///////////////////////////////
//      TRANSFER ROUTE       //
///////////////////////////////

routes.post('/transfer/:id', verifyJwtToken, transferController.transfer);
routes.get('/balance/:id', verifyJwtToken, userController.getBalance);



export default routes;