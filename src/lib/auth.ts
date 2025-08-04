import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  appName: "chatbox",
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),

  // Email/Password config
  emailAndPassword: {
    enabled: true,
  },

  // Google OAuth config
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  // Session config
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },

  trustedOrigins: [
    "http://localhost:3000",
    "https://your-production-domain.com",
  ],

  // Custom hooks to handle user creation
  hooks: {
    async onUserCreate(user) {
      try {
        // Create a corresponding AppUser record with default role
        await prisma.appUser.create({
          data: {
            email: user.email!,
            name: user.name || "Unknown User",
            role: "AGENT", // Default role for new users
            authUserId: user.id,
          },
        });
      } catch (error) {
        console.error("Error creating AppUser record:", error);
        // Don't throw error to prevent auth failure
      }
      return user;
    },
  },
});
