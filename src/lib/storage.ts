import { Client } from "minio";
import { randomUUID } from "node:crypto";

/**
 * MinIO / S3 object storage for reserved-area photos.
 *
 * Composit photos are stored here (not inline base64 in Mongo) so the records
 * stay small and the originals can be re-used. Objects are private; the app
 * streams them back to the browser through an auth-gated route
 * (`/riservato/composit/media/…`), so nothing needs a public bucket policy or
 * CORS config.
 *
 * Config comes from the environment:
 *   S3_ENDPOINT      full URL, e.g. http://localhost:9000 or http://minio:9000
 *   S3_BUCKET        bucket name (default "liine")
 *   S3_ACCESS_KEY    access key
 *   S3_SECRET_KEY    secret key
 *   S3_REGION        optional (default "us-east-1")
 */

const BUCKET = process.env.S3_BUCKET || "liine";

// Fail fast when the object store accepts the socket but never answers (a
// stalled or half-open MinIO/S3 endpoint). Without this the minio client has
// no timeout and a save would hang forever ("Salva" stuck), unlike the Mongo
// client which already fails fast. Mirrors that behaviour for storage.
const OP_TIMEOUT_MS = 8000;

function withTimeout<T>(op: Promise<T>, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const guard = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`Object storage non raggiungibile (timeout ${label}).`)),
      OP_TIMEOUT_MS,
    );
  });
  return Promise.race([op, guard]).finally(() => clearTimeout(timer));
}

type GlobalCache = { client?: Client; ensured?: Promise<void> };
const globalCache = globalThis as unknown as { __liineStorage?: GlobalCache };
const cache: GlobalCache = (globalCache.__liineStorage ??= {});

function getClient(): Client {
  if (cache.client) return cache.client;

  const endpoint = process.env.S3_ENDPOINT;
  const accessKey = process.env.S3_ACCESS_KEY;
  const secretKey = process.env.S3_SECRET_KEY;
  if (!endpoint || !accessKey || !secretKey) {
    throw new Error(
      "Object storage non configurato (S3_ENDPOINT / S3_ACCESS_KEY / S3_SECRET_KEY).",
    );
  }

  const url = new URL(endpoint);
  const useSSL = url.protocol === "https:";
  cache.client = new Client({
    endPoint: url.hostname,
    port: url.port ? Number(url.port) : useSSL ? 443 : 80,
    useSSL,
    accessKey,
    secretKey,
    region: process.env.S3_REGION || "us-east-1",
  });
  return cache.client;
}

/** Creates the bucket on first use; cached so it only runs once per process. */
function ensureBucket(client: Client): Promise<void> {
  cache.ensured ??= (async () => {
    const exists = await withTimeout(
      client.bucketExists(BUCKET),
      "bucketExists",
    ).catch(() => false);
    if (!exists) {
      await withTimeout(
        client.makeBucket(BUCKET, process.env.S3_REGION || "us-east-1"),
        "makeBucket",
      );
    }
    // Don't leave a stalled attempt cached: a later save should retry cleanly.
  })().catch((err) => {
    cache.ensured = undefined;
    throw err;
  });
  return cache.ensured;
}

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

/**
 * Stores an image buffer and returns its object key (stable id used to fetch
 * or delete it later). `prefix` groups objects, e.g. "composit".
 */
export async function putImage(
  buffer: Buffer,
  contentType: string,
  prefix = "composit",
): Promise<string> {
  const client = getClient();
  await ensureBucket(client);
  const ext = EXT[contentType] ?? "bin";
  const key = `${prefix}/${randomUUID()}.${ext}`;
  await withTimeout(
    client.putObject(BUCKET, key, buffer, buffer.length, {
      "Content-Type": contentType,
    }),
    "putObject",
  );
  return key;
}

export interface StoredObject {
  stream: NodeJS.ReadableStream;
  contentType: string;
  size: number;
}

/** Fetches an object for streaming back to the browser. */
export async function getObject(key: string): Promise<StoredObject> {
  const client = getClient();
  const stat = await withTimeout(client.statObject(BUCKET, key), "statObject");
  const stream = await withTimeout(client.getObject(BUCKET, key), "getObject");
  return {
    stream,
    contentType: stat.metaData?.["content-type"] || "application/octet-stream",
    size: stat.size,
  };
}

/** Removes an object. Never throws — a missing object is fine to "delete". */
export async function removeObject(key?: string | null): Promise<void> {
  if (!key) return;
  try {
    await getClient().removeObject(BUCKET, key);
  } catch {
    // best-effort cleanup
  }
}
