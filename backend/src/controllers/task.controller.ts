import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
import { NotFoundError, ForbiddenError } from '../lib/errors';
import { AuthRequest } from '../middleware/auth.middleware';

export async function getTasks(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const {
      page = '1',
      limit = '10',
      status,
      search,
      priority,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = { userId };

    if (status && ['PENDING', 'IN_PROGRESS', 'COMPLETED'].includes(status)) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (priority && ['LOW', 'MEDIUM', 'HIGH'].includes(priority)) {
      where.priority = priority;
    }

    const validSortFields = ['createdAt', 'updatedAt', 'title', 'dueDate', 'priority'];
    const orderByField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const orderDir = sortOrder === 'asc' ? 'asc' : 'desc';

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { [orderByField]: orderDir },
      }),
      prisma.task.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
          hasNext: pageNum * limitNum < total,
          hasPrev: pageNum > 1,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) throw new NotFoundError('Task not found');
    if (task.userId !== userId) throw new ForbiddenError('Access denied');

    res.json({ success: true, data: { task } });
  } catch (err) {
    next(err);
  }
}

export async function createTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { title, description, status, priority, dueDate } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'PENDING',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        userId,
      },
    });

    res.status(201).json({ success: true, data: { task } });
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Task not found');
    if (existing.userId !== userId) throw new ForbiddenError('Access denied');

    const { title, description, status, priority, dueDate } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      },
    });

    res.json({ success: true, data: { task } });
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Task not found');
    if (existing.userId !== userId) throw new ForbiddenError('Access denied');

    await prisma.task.delete({ where: { id } });

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
}

export async function toggleTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Task not found');
    if (existing.userId !== userId) throw new ForbiddenError('Access denied');

    const nextStatus: Record<string, string> = {
      PENDING: 'IN_PROGRESS',
      IN_PROGRESS: 'COMPLETED',
      COMPLETED: 'PENDING',
    };

    const task = await prisma.task.update({
      where: { id },
      data: { status: nextStatus[existing.status] },
    });

    res.json({ success: true, data: { task } });
  } catch (err) {
    next(err);
  }
}
