"use client";

import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";

// Use origin URL to bypass Cloudflare/MassTranslate Worker which mangles auth responses
const baseURL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? undefined // use relative URLs in dev
    : "https://origin.deepbreathingexercises.com";

export const authClient = createAuthClient({
  baseURL,
  plugins: [magicLinkClient()],
});

export const { signIn, signOut, useSession } = authClient;
