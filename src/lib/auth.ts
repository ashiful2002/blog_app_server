import { betterAuth, email, string } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

// If your Prisma file is located elsewhere, you can change the path

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: " ",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      // console.log({ user, url, token });
      try {
        const verificationUrl = `${process.env.APP_USER}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"hacker " <prisma_hacker@hacker.com>',
          to: user?.email,
          subject: "email verification",
          // text: "Hello world?",
          html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Verify Your Email</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: Arial, Helvetica, sans-serif;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }
      .header {
        background: #2563eb;
        color: #ffffff;
        padding: 20px;
        text-align: center;
      }
      .content {
        padding: 30px;
        color: #333333;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        margin: 24px 0;
        padding: 12px 24px;
        background: #2563eb;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      }
      .footer {
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #777777;
        background: #f9fafb;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="header">
        <h2>Email Verification</h2>
      </div>

      <div class="content">
        <p>Hello, <strong>"${user?.name}"</strong>,</p>

        <p>
          Thanks for signing up! Please verify your email address to activate
          your account.
        </p>

        <p style="text-align: center;">
          <a href="${verificationUrl}" class="button">
            Verify Email
          </a>
        </p>

        <p>
          If the button doesn’t work, copy and paste this link into your browser:
        </p>

        <p style="word-break: break-all;">
          "${verificationUrl}"
        </p>

        <p>
          If you didn’t create this account, you can safely ignore this email.
        </p>

        <p>— The Prisma Hacker Team</p>
      </div>

      <div class="footer">
        <p>© 2026 Prisma Hacker. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`,
        });

        console.log("Message sent:", info.messageId);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
