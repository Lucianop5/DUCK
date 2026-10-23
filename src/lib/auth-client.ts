import { createAuthClient } from "better-auth/react";

/**
 * Sin `baseURL` el cliente usa el origen actual, así funciona igual en
 * localhost, en un puerto alternativo y en producción.
 */
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
