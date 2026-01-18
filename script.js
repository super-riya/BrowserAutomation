import { chromium } from "playwright";
import fs from "fs";
import { firstNames, lastNames, emails, options } from "./example.js";

// -------- CONFIG --------
const URL = "https://career.zorvyn.io/careers/T0RT7Q/apply";
const RESUME_PATH = "./resume.pdf"; // Linux / GitHub Actions path
const MAX_RUNS = 3;
const STATS_FILE = "stats.txt";
// ------------------------

// counters
let totalTried = 0;
let success = 0;
let failed = 0;

// utility: random delay
const sleep = (min = 500, max = 1500) =>
  new Promise(res => setTimeout(res, min + Math.random() * (max - min)));

// utility: human typing
async function humanFill(page, selector, text) {
  await page.click(selector);
  for (const char of text) {
    await page.keyboard.type(char);
    await sleep(40, 120);
  }
}

// launch browser (ONCE)
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"]
});

for (let run = 1; run <= MAX_RUNS; run++) {
  totalTried++;

  const page = await browser.newPage();

  try {
    await page.goto(URL, { waitUntil: "networkidle" });

    const phone = `9${Math.floor(100000000 + Math.random() * 900000000)}`;
    
    const timestampt = Date.now();
    const email = timestampt + emails[Math.floor(Math.random() * emails.length)];

    await humanFill(
      page,
      'input[placeholder="e.g., Priya"]',
      firstNames[Math.floor(Math.random() * firstNames.length)]
    );

    await humanFill(
      page,
      'input[placeholder="e.g., Sharma"]',
      lastNames[Math.floor(Math.random() * lastNames.length)]
    );

    await humanFill(
      page,
      'input[placeholder="e.g., priya@example.com"]',
      email
    );

    await humanFill(
      page,
      'input[placeholder="e.g., 9999999999"]',
      phone
    );

    await page.setInputFiles('input[type="file"]', RESUME_PATH);
    await sleep();

    await page.click("text=Next");
    await sleep();

    await page.click("text=Next");
    await sleep();

    await page.click("text=Next");
    await sleep();

    await page.click(
      "text=" + options[Math.floor(Math.random() * options.length)]
    );
    await sleep();

    await page.click("text=Next");
    await sleep(1500, 2500);

    await page.click("text=Submit Application");
    await sleep(3000, 5000);

    success++;
  } catch {
    failed++;
  } finally {
    await page.close();
    await sleep(4000, 7000);
  }
}

// save minimal stats
const stats = `
TOTAL_TRIED=${totalTried}
SUCCESS=${success}
FAILED=${failed}
`.trim();

fs.writeFileSync(STATS_FILE, stats);

console.log(stats); // visible in GitHub Actions summary

await browser.close();
