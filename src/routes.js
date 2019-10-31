import { Router } from 'express';

import EnrolledController from './app/controllers/EnrolledController';
import PlanController from './app/controllers/PlanController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';

import authMiddleway from './app/middlewares/auth';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ message: 'ok' });
});

routes.post('/sessions', SessionController.store);

routes.use(authMiddleway);

routes.get('/students', StudentController.index);
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);
routes.delete('/students/:id', StudentController.delete);

routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.get('/enrolleds', EnrolledController.index);
routes.post('/enrolleds', EnrolledController.store);
routes.put('/enrolleds/:id', EnrolledController.update);
routes.delete('/enrolleds/:id', EnrolledController.delete);

export default routes;
