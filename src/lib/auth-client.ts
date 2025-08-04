import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000", // optional if same origin
  redirectTo: "/dashboard", // Redirect to dashboard after successful auth
});
