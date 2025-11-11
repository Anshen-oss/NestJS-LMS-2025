import { env } from "@/lib/env";

export function useConstructUrl(key: string): string {
  return `${env.NEXT_PUBLIC_S3_PUBLIC_BASE_URL}/${key.replace(/^\/+/, "")}`;
}

// import { env } from "@/lib/env";
// import placeholder from "@/public/course-placeholder.svg";
// import type { StaticImageData } from "next/image";

// export function useConstructUrl(
//   key?: string,
//   fallback: string | StaticImageData = placeholder
// ): string | StaticImageData {
//   if (!key || !key.trim()) return fallback;
//   const base = env.NEXT_PUBLIC_S3_PUBLIC_BASE_URL?.replace(/\/+$/, "");
//   return base ? `${base}/${key.replace(/^\/+/, "")}` : fallback;
// }
