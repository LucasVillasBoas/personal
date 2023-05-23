import { Router } from 'express';
import AccountController from 'controllers/AccountController';
import { verifyJwtToken, verifyJwtTokenMaster } from 'middlewares/auth';
import TransferController from 'controllers/TransferController';
import UserController from 'controllers/UserController';
import { authStatement } from 'middlewares/authStatement';

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

/* route to adm updated users balance */
routes.put('/:id', verifyJwtTokenMaster, accountController.update);


///////////////////////////////
//      TRANSFER ROUTE       //
///////////////////////////////

routes.post('/transfer/:id', verifyJwtToken, transferController.transfer);
routes.get('/profile/:id', verifyJwtToken, accountController.getProfileInfo);
routes.get('/balance/:id', verifyJwtToken, userController.getBalance);
routes.get('/statement/default/:id', authStatement, verifyJwtToken, accountController.getDefaultStatement);
routes.get('/statement/detail/:id', authStatement, verifyJwtToken, accountController.getDetailStatement);



export default routes;