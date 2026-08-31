import { MongoClient, type Db } from "mongodb";

/**
 * Cached MongoDB connection for the reserved area.
 *
 * The public site reads from Mongo too (uploaded models / works), so it must
 * degrade gracefully when the database is unavailable — e.g. running
 * `npm run dev` without the Mongo container. To keep pages snappy in that case
 * we fail fast (short server-selection timeout) and open a short circuit
 * breaker so we don't retry the dead socket on every request.
 */

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "liine";

const SELECTION_TIMEOUT_MS = 1500;
const CIRCUIT_OPEN_MS = 15_000;

type GlobalCache = {
  clientPromise?: Promise<MongoClient>;
  circuitOpenUntil?: number;
};

// Reuse across HMR reloads in dev and across module instances.
const globalCache = globalThis as unknown as { __liineMongo?: GlobalCache };
const cache: GlobalCache = (globalCache.__liineMongo ??= {});

function connect(): Promise<MongoClient> {
  if (!uri) {
    return Promise.reject(new Error("MONGODB_URI is not set"));
  }
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: SELECTION_TIMEOUT_MS,
    connectTimeoutMS: SELECTION_TIMEOUT_MS,
  });
  return client.connect();
}

/**
 * Returns a connected Db, or throws quickly if Mongo can't be reached.
 * Callers that render the public site should catch and fall back to static
 * data; reserved-area mutations should surface the error to the operator.
 */
export async function getDb(): Promise<Db> {
  const now = Date.now();
  if (cache.circuitOpenUntil && now < cache.circuitOpenUntil) {
    throw new Error("MongoDB unavailable (circuit open)");
  }

  if (!cache.clientPromise) {
    cache.clientPromise = connect();
  }

  try {
    const client = await cache.clientPromise;
    return client.db(dbName);
  } catch (err) {
    // Drop the failed promise and open the breaker so the next requests fail
    // fast instead of waiting on the selection timeout each time.
    cache.clientPromise = undefined;
    cache.circuitOpenUntil = Date.now() + CIRCUIT_OPEN_MS;
    throw err;
  }
}

export const COLLECTIONS = {
  models: "models",
  works: "works",
  /** Saved composit (comp card) drafts, editable from the reserved area. */
  composits: "composits",
  /** Open-casting applications (candidatura). */
  applications: "applications",
  /** Client / booking requests (richiesta). */
  requests: "requests",
} as const;
