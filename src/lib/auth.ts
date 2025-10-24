import { PrismaClient } from "@/generated/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma"; 
import { checkout, polar, portal } from "@polar-sh/better-auth";
import { polarClient } from "./polar";

const prisma = new PrismaClient();

/**
 * Initializes and configures the authentication module using `better-auth`.
 *
 * This setup integrates:
 *  - Prisma for persistent storage of user and session data.
 *  - Email/password authentication with auto sign-in.
 *  - Polar plugin for customer and subscription management, including
 *    checkout and portal functionality.
 *
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),

  emailAndPassword: {
    enabled: true,
    /** Automatically signs the user in immediately after registration. */
    autoSignIn: true
  },

  plugins: [
    polar({
      client: polarClient,
      /** Creates a Polar customer on new user sign-up. */
      createCustomerOnSignUp: true,
      use: [
        checkout({
          /** Product configuration for Polar checkout. */
          products: [
            { 
              productId: "dc317ca4-c483-41f3-b2b9-9a2733ea0a42",
              slug: "pro"
            }
          ],
          /** Redirect URL on successful checkout completion. */
          successUrl: process.env.POLAR_SUCCESS_URL,
          /** Restricts checkout to authenticated users only. */
          authenticatedUsersOnly: true
        }),
        /** Adds support for Polar’s customer billing portal. */
        portal()
      ]
    })
  ]
});
