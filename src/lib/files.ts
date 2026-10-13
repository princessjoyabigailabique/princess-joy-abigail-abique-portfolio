import fs from "node:fs";
import path from "node:path";

/** True if a file under /public exists. Server-side only (runs at build/request time). */
export function publicFileExists(webPath: string): boolean {
  try {
    const p = path.join(process.cwd(), "public", webPath.replace(/^\/+/, ""));
    return fs.statSync(p).isFile();
  } catch {
    return false;
  }
}
