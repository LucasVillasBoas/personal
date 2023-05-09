import { Router } from 'express';
import AddressController from 'controllers/AddressController';

const routes = Router();
const addressController = new AddressController();

routes.post('/', addressController.create);
routes.get('/', addressController.getAll);
routes.get('/:idUser', addressController.getUserAddress);
routes.put('/:id', addressController.update);
routes.put('/activate/:id', addressController.activate);
routes.delete('/:id', addressController.delete);

export default routes;