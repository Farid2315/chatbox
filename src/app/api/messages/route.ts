import { NextRequest, NextResponse } from 'next/server';
import { createMessage, getMessagesByConversation } from '@/lib/message-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, senderType, senderId, content } = body;
    
    const message = await createMessage({
      conversationId,
      senderType,
      senderId,
      content,
    });
    
    return NextResponse.json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');
    
    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }
    
    const messages = await getMessagesByConversation(conversationId);
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
