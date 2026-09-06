import { prisma } from '../lib/prisma';

export class MessageService {
  static async getOrCreateConversation(bookingId: string) {
    let conv = await prisma.conversation.findUnique({
      where: { bookingId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { sender: { include: { profile: true } } },
        },
      },
    });

    if (!conv) {
      conv = await prisma.conversation.create({
        data: { bookingId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            include: { sender: { include: { profile: true } } },
          },
        },
      });
    }

    return conv;
  }

  static async sendMessage(senderId: string, data: { bookingId: string; text: string; senderRole: string }) {
    const conv = await this.getOrCreateConversation(data.bookingId);

    const message = await prisma.message.create({
      data: {
        conversationId: conv.id,
        senderId,
        senderRole: data.senderRole || 'TRAVELLER',
        text: data.text,
      },
      include: {
        sender: { include: { profile: true } },
      },
    });

    return message;
  }
}
