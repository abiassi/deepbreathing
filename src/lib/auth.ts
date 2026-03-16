import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  basePath: "/api/auth",
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      prompt: "select_account",
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // refresh once per day
    cookieCache: {
      enabled: true,
      maxAge: 300, // 5 min client-side cache
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await resend.emails.send({
          from: "Deep Breathing Exercises <noreply@deepbreathingexercises.com>",
          to: email,
          subject: "Your sign-in link",
          html: `<div style="font-family: system-ui, -apple-system, sans-serif; max-width: 400px; margin: 0 auto; padding: 40px 20px;">
  <h2 style="font-weight: 600; font-size: 20px; color: #1a1a1a;">Sign in to Deep Breathing Exercises</h2>
  <p style="color: #666; line-height: 1.6;">Click below to sign in and save your breathing progress.</p>
  <a href="${url}" style="display: inline-block; background: hsl(18, 90%, 60%); color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; margin: 16px 0;">Sign in</a>
  <p style="color: #999; font-size: 13px;">This link expires in 5 minutes. If you didn't request this, ignore this email.</p>
</div>`,
        });
      },
      expiresIn: 300,
    }),
    nextCookies(),
  ],
});
