import { auth } from "@/lib/auth";
import { polarClient } from "@/lib/polar";

import {initTRPC, TRPCError} from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";


/**
 * Creates a tRPC context object.
 *
 * This function runs once per request and provides a base context
 * containing lightweight information such as the current user's ID.
 */
export const createTRPCContext = cache(async()=>{

  /**
   * @see: https://trpc.io/docs/server/context
   */
    return { userId: 'user_123' };
})


/**
 * Initializes the core tRPC instance.
 *
 * This provides a base `t` object for defining routers and procedures.
 * Avoid exporting `t` directly—use helper exports like `createTRPCRouter` instead.
 */
const t = initTRPC.create({
   /**
    * @see https://trpc.io/docs/server/data-transformers
    */
  // transformer: superjson,
});


//Helper for creating new tRPC routers.
export const createTRPCRouter = t.router;

//Helper for creating a caller factory from a router.
export const createCallerFactory = t.createCallerFactory;
/**
 * Base tRPC procedure helper.
 *
 * This is the foundation for creating both public and protected procedures.
 */
export const baseProcedure = t.procedure;

/**
 * Middleware-protected procedure that enforces authentication.
 *
 * This procedure verifies that a valid session exists using `better-auth`.
 * If no session is found, it throws a `TRPCError` with the `"UNAUTHORIZED"` code.
 *
 * When valid, it extends the tRPC context to include the authenticated session object.
 */
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if(!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED", 
      message: "Unauthorized"
    })
  }
  
  // Extend the context with session data
  return next({ctx: { ...ctx,  auth: session}})
})



/**
 * Premium-only tRPC procedure that enforces an active Polar subscription.
 *
 * This middleware **extends** `protectedProcedure`, meaning it automatically inherits
 * the authentication checks from it before performing additional logic.
 *
 * The reason for extending `protectedProcedure` rather than `baseProcedure` directly is:
 * - It ensures that only authenticated users reach this step.
 * - Polar subscription validation depends on the authenticated user's `externalId`.
 * - Without authentication, the system would have no reliable user context to check
 *   for active subscriptions.
 *
 * After confirming the user is authenticated, this middleware queries Polar for
 * the user's subscription state (`customers.getStateExternal`). If no active
 * subscriptions are found, it throws a `"FORBIDDEN"` error.
 *
 * On success, it extends the tRPC context with the Polar customer object,
 * allowing downstream resolvers to access customer/subscription details.
 */
export const premiumProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const customer  = await polarClient.customers.getStateExternal({
      externalId: ctx.auth.user.id
    }); 

    if( !customer.activeSubscriptions || customer.activeSubscriptions.length === 0) {
      throw new TRPCError({
        code: "FORBIDDEN", 
        message: "Active subscription required"
      });
    }

    // Extend context with customer info for downstream resolvers
    return next({ ctx: {...ctx, customer} })
  },
)
