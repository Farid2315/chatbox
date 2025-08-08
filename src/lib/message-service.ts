import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface MessageData {
  conversationId: string;
  senderType: 'USER' | 'CUSTOMER' | 'SYSTEM';
  senderId?: string;
  content: string;
}

export async function createMessage(data: MessageData) {
  try {
    const message = await prisma.message.create({
      data: {
        conversationId: data.conversationId,
        senderType: data.senderType,
        senderId: data.senderId,
        content: data.content,
      },
    });
    return message;
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
}

export async function getMessagesByConversation(conversationId: string) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
}

export async function markMessageAsSeen(messageId: string) {
  try {
    const message = await prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        seenAt: new Date(),
      },
    });
    return message;
  } catch (error) {
    console.error('Error marking message as seen:', error);
    throw error;
  }
}
