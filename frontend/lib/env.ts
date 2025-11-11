// import { createEnv } from "@t3-oss/env-nextjs";
// import { z } from "zod";

// export const env = createEnv({
//   server: {
//     DATABASE_URL: z.string().url(),
//     BETTER_AUTH_SECRET: z.string().min(1),
//     BETTER_AUTH_URL: z.string().url(),
//     AUTH_GITHUB_CLIENT_ID: z.string().min(1),
//     AUTH_GITHUB_CLIENT_SECRET: z.string().min(1),
//     RESEND_API_KEY: z.string().min(1),
//     ARCJET_KEY: z.string().min(1),

//     AWS_ACCESS_KEY_ID: z.string().min(1),
//     AWS_SECRET_ACCESS_KEY: z.string().min(1),
//     AWS_ENDPOINT_URL_S3: z.string().min(1),
//     AWS_ENDPOINT_URL_IAM: z.string().min(1),
//     AWS_REGION: z.string().min(1),
//     STRIPE_SECRET_KEY: z.string().min(1),
//     STRIPE_WEBHOOK_SECRET: z.string().min(1),
//   },
//   client: {
//     NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES: z.string().min(1),
//     NEXT_PUBLIC_S3_PUBLIC_BASE_URL: z.string().url().optional(),
//   },
//   // For Next.js >= 13.4.4, you only need to destructure client variables:
//   experimental__runtimeEnv: {
//     NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES:
//       process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
//     NEXT_PUBLIC_S3_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_S3_PUBLIC_BASE_URL,
//   },
// });

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const isEdge = typeof (globalThis as any).EdgeRuntime !== "undefined";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().url(),
    AUTH_GITHUB_CLIENT_ID: z.string().min(1),
    AUTH_GITHUB_CLIENT_SECRET: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    ARCJET_KEY: z.string().min(1),
    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    AWS_ENDPOINT_URL_S3: z.string().min(1),
    AWS_ENDPOINT_URL_IAM: z.string().min(1),
    AWS_REGION: z.string().min(1),
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES: z.string().min(1),
    NEXT_PUBLIC_S3_PUBLIC_BASE_URL: z.string().url().optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES:
      process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
    NEXT_PUBLIC_S3_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_S3_PUBLIC_BASE_URL,
  },
  // ⬇️ désactive la validation quand on est en Edge (middleware)
  skipValidation: isEdge || process.env.SKIP_ENV_VALIDATION === "true",
});
