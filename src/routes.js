import { Router } from 'express';

import SessionController from './app/controllers/SessionController';

import authMiddleway from './app/middlewares/auth';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ message: 'ok' });
});

routes.post('/sessions', SessionController.store);

routes.use(authMiddleway);

export default routes;
