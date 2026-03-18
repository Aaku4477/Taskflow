import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const passwordHash = await bcrypt.hash('Demo1234', 12);

  const user = await prisma.user.upsert({
    where: { email: 'demo@taskflow.dev' },
    update: {},
    create: {
      email: 'demo@taskflow.dev',
      name: 'Demo User',
      passwordHash,
    },
  });

  console.log(`✅ Created user: ${user.email}`);

  const tasks = [
    { title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing and deployment.', status: 'COMPLETED' as const, priority: 'HIGH' as const },
    { title: 'Write unit tests for auth module', description: 'Cover registration, login, and token refresh flows.', status: 'IN_PROGRESS' as const, priority: 'HIGH' as const },
    { title: 'Design database schema', description: 'Review and finalize the task and user models.', status: 'COMPLETED' as const, priority: 'MEDIUM' as const },
    { title: 'Implement pagination', description: 'Add cursor-based or offset pagination to the task list endpoint.', status: 'PENDING' as const, priority: 'MEDIUM' as const },
    { title: 'Add email notifications', description: 'Send reminder emails for tasks nearing their due date.', status: 'PENDING' as const, priority: 'LOW' as const },
    { title: 'Code review: frontend PR', description: 'Review the dashboard component and provide feedback.', status: 'PENDING' as const, priority: 'HIGH' as const, dueDate: new Date(Date.now() + 86400000) },
    { title: 'Update API documentation', status: 'PENDING' as const, priority: 'LOW' as const },
    { title: 'Fix CORS configuration', status: 'COMPLETED' as const, priority: 'HIGH' as const },
    { title: 'Performance audit', description: 'Profile slow queries and add database indexes where needed.', status: 'PENDING' as const, priority: 'MEDIUM' as const, dueDate: new Date(Date.now() + 7 * 86400000) },
  ];

  for (const task of tasks) {
    await prisma.task.create({ data: { ...task, userId: user.id } });
  }

  console.log(`✅ Created ${tasks.length} demo tasks`);
  console.log('\n🔑 Demo credentials:');
  console.log('   Email:    demo@taskflow.dev');
  console.log('   Password: Demo1234\n');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
