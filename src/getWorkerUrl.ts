import path from "path";

export default function(workerName: string): string {
  return path.join(
    process.env.PUBLIC_URL,
    "workers",
    workerName + ".worker.js"
  );
}
