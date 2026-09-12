import fs from "fs";
import path from "path";

// Used only when Supabase is not configured. Reads and writes the JSON
// files in src/data directly on disk, so registrations, venture posts,
// membership applications and contact messages behave like a real backend
// during local development, without needing a database yet.
//
// This only works on a normal Node.js server with a writable filesystem,
// which covers `npm run dev`, `npm run start`, and most traditional
// hosting. It will not work on hosts with a read-only filesystem at
// runtime. That is expected: this whole mechanism is a placeholder for
// local development and demos, and is bypassed automatically the moment
// Supabase is configured.

const DATA_DIR = path.join(process.cwd(), "src", "data");

export function readLocalJson<T>(filename: string): T[] {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

export function writeLocalJson<T>(filename: string, data: T[]): void {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}
