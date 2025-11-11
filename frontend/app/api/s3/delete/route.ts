// import { env } from "@/lib/env";
// import { S3 } from "@/lib/S3Client";
// import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
// import { DeleteObjectCommand } from "@aws-sdk/client-s3";
// import { NextResponse } from "next/server";
// import { requireAdmin } from "@/app/data/admin/require-admin";

// const aj = arcjet
//   .withRule(
//     detectBot({
//       mode: "LIVE",
//       allow: [],
//     })
//   )
//   .withRule(
//     fixedWindow({
//       mode: "LIVE",
//       window: "1m",
//       max: 5,
//     })
//   );
// export async function DELETE(request: Request) {
//   const session = await requireAdmin();
//   try {
//     const decision = await aj.protect(request, {
//       fingerprint: session?.user.id as string,
//     });

//     if (decision.isDenied()) {
//       return NextResponse.json({ error: "Dudde not good" }, { status: 429 });
//     }

//     const body = await request.json();
//     const key = body.key;

//     if (!key) {
//       return NextResponse.json(
//         { error: "Missing or invalid object key" },
//         { status: 400 }
//       );
//     }

//     const command = new DeleteObjectCommand({
//       Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
//       Key: key,
//     });

//     await S3.send(command);
//     return NextResponse.json(
//       { message: "File deleted successfully" },
//       { status: 200 }
//     );
//   } catch {
//     return NextResponse.json(
//       { error: "Missing or invalid object key" },
//       { status: 500 }
//     );
//   }
// }

import { env } from "@/lib/env";
import { S3 } from "@/lib/S3Client";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/data/admin/require-admin";

export const runtime = "nodejs"; // 👈 AWS SDK v3 : Node only
export const dynamic = "force-dynamic"; // 👈 pas de cache

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: process.env.NODE_ENV === "production" ? 10 : 100, // 👈 relax en dev
  })
);

// Fonction commune
async function handle(request: Request) {
  // 0) Auth explicite
  try {
    const session = await requireAdmin();
    // 1) Rate limit (prod seulement si tu veux)
    const decision = await aj.protect(request, {
      fingerprint: session?.user.id as string,
    });
    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }
  } catch (e: any) {
    // Renvoie 401 clair si non admin / pas de session
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2) Récupérer la clé: body JSON ou query `?key=...`
  let key: string | null = null;
  try {
    const body = await request.json();
    key = body?.key ?? null;
  } catch {
    // certains navigateurs/proxys dropent le body des DELETE → fallback query
  }
  if (!key) {
    const { searchParams } = new URL(request.url);
    key = searchParams.get("key");
  }
  if (!key) {
    return NextResponse.json({ error: "Missing 'key'." }, { status: 400 });
  }

  // 3) Delete S3
  try {
    await S3.send(
      new DeleteObjectCommand({
        Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
        Key: key,
      })
    );
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    console.error("S3 delete error:", err);
    return NextResponse.json(
      { error: "S3 delete failed", detail: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  return handle(request);
}

// Fallback si DELETE perd le body : on autorise POST
export async function POST(request: Request) {
  return handle(request);
}
