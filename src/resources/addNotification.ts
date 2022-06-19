import prisma from './db';

export default async function addNotification(
  userName: string,
  title: string,
  message?: string
): Promise<void> {
  try {
    await prisma.notification.create({
      data: { userName, title, message },
    });
  } catch (error) {
    const addError = new Error('fail to add notification');
    addError.name = 'FailToAddNotification';
    throw addError;
  }
}
