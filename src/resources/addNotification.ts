import prisma from './db';

export default async function addNotification(
  userName: string,
  title: string,
  message = ''
): Promise<void> {
  try {
    await prisma.notification.create({
      data: { userName, title, message },
    });
  } catch (error) {
    console.log(error);
    const addError = new Error('fail to add notification');
    addError.name = 'FailToAddNotification';
    throw addError;
  }
}
