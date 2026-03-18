import { Router } from 'express';
import { body, query } from 'express-validator';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
} from '../controllers/task.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive integer'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be 1-50'),
    query('status').optional().isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED']).withMessage('Invalid status'),
    query('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Invalid priority'),
  ],
  validate,
  getTasks
);

router.get('/:id', getTask);

router.post(
  '/',
  [
    body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title required, max 200 chars'),
    body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description max 2000 chars'),
    body('status').optional().isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED']).withMessage('Invalid status'),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Invalid priority'),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
  ],
  validate,
  createTask
);

router.patch(
  '/:id',
  [
    body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title max 200 chars'),
    body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description max 2000 chars'),
    body('status').optional().isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED']).withMessage('Invalid status'),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Invalid priority'),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
  ],
  validate,
  updateTask
);

router.delete('/:id', deleteTask);

router.patch('/:id/toggle', toggleTask);

export default router;
