import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth";
import { PrismaClient } from "@prisma/client";
import { openAPI } from "better-auth/plugins"

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
  plugins: [ 
    openAPI(), 
] 


});
