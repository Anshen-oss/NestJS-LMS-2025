import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const envEdge = createEnv({
  client: {
    NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES: z.string().min(1),
    NEXT_PUBLIC_S3_PUBLIC_BASE_URL: z.string().url().optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES:
      process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
    NEXT_PUBLIC_S3_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_S3_PUBLIC_BASE_URL,
  },
});
