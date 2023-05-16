import { Router } from 'express';
import OnboardingController from 'controllers/OnboardingController';
import { authOnboarding } from 'middlewares/auth';

const routes = Router();
const onboardingController = new OnboardingController();

routes.post('/', authOnboarding, onboardingController.create);

export default routes;