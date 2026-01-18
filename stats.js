import fs from "fs";

export function loadStats() {
  if (fs.existsSync("stats.json")) {
    return JSON.parse(fs.readFileSync("stats.json", "utf-8"));
  }

  // default if file does not exist
  return {
    frontend: { success: 0, failed: 0 },
    sde: { success: 0, failed: 0 },
    uiux: { success: 0, failed: 0 }
  };
}
