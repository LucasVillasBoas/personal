import { Router } from 'express';
import OnboardingController from 'controllers/OnboadingController';
import { authentication } from 'middlewares/auth';

const routes = Router();
const onboardingController = new OnboardingController();

routes.post('/', authentication, onboardingController.create);

export default routes;