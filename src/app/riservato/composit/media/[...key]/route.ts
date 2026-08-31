import { Readable } from "node:stream";
import { isAuthenticated } from "@/lib/auth";
import { getObject } from "@/lib/storage";

/**
 * Streams a stored composit photo back to the browser, same-origin and behind
 * the reserved-area session. Keeping it same-origin means the client PDF
 * generator (canvas, crossOrigin="anonymous") can read the pixels without any
 * bucket CORS/public-policy config.
 */
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  if (!(await isAuthenticated())) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { key } = await params;
  const objectKey = key.join("/");
  try {
    const obj = await getObject(objectKey);
    const body = Readable.toWeb(obj.stream as Readable) as ReadableStream;
    return new Response(body, {
      headers: {
        "Content-Type": obj.contentType,
        "Content-Length": String(obj.size),
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
