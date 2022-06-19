import prisma from './db';
export default async (userName: string, questionId: string) =>
  !!(await prisma.like.findFirst({
    where: { userName, questionId },
  }));
