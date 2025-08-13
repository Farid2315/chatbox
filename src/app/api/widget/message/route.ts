import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, roomId, customerEmail, customerName } = body;

    // Step 1: Check if user is authenticated
    const session = await auth.api.getSession({ headers: req.headers });
    
    let organizationId: string;
    let customerId: string;
    let conversationId: string;

    if (session?.user) {
      // User is registered - get their organization
      const appUser = await prisma.appUser.findFirst({
        where: { email: session.user.email },
        include: { organization: true }
      });

      if (!appUser) {
        return NextResponse.json({ error: "AppUser not found" }, { status: 404 });
      }

      organizationId = appUser.organizationId!;

      // Step 2: Find or create customer
      let customer = await prisma.customer.findFirst({
        where: { 
          email: customerEmail,
          organizationId: organizationId
        }
      });

      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            name: customerName || 'Anonymous Customer',
            email: customerEmail,
            organizationId: organizationId
          }
        });
      }

      customerId = customer.id;

      // Step 3: Find or create conversation
      let conversation = await prisma.conversation.findFirst({
        where: {
          customerId: customerId,
          organizationId: organizationId
        }
      });

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            customerId: customerId,
            organizationId: organizationId,
            status: 'OPEN'
          }
        });
      }

      conversationId = conversation.id;

    } else {
      // User is not registered - create anonymous session
      // For now, we'll use a default organization or create one
      let defaultOrg = await prisma.organization.findFirst({
        where: { name: "Default Organization" }
      });

      if (!defaultOrg) {
        defaultOrg = await prisma.organization.create({
          data: { name: "Default Organization" }
        });
      }

      organizationId = defaultOrg.id;

      // Create anonymous customer
      const customer = await prisma.customer.create({
        data: {
          name: customerName || 'Anonymous Customer',
          email: customerEmail,
          organizationId: organizationId
        }
      });

      customerId = customer.id;

      // Create conversation
      const conversation = await prisma.conversation.create({
        data: {
          customerId: customerId,
          organizationId: organizationId,
          status: 'OPEN'
        }
      });

      conversationId = conversation.id;
    }

    // Step 4: Create message
    const savedMessage = await prisma.message.create({
      data: {
        content: message,
        senderType: 'CUSTOMER',
        senderId: customerId,
        conversationId: conversationId
      }
    });

    return NextResponse.json({
      success: true,
      message: savedMessage,
      conversationId: conversationId,
      customerId: customerId,
      organizationId: organizationId,
      isAuthenticated: !!session?.user
    });

  } catch (error) {
    console.error('Error handling widget message:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
