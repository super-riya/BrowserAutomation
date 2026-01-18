import { chromium } from "playwright";
import fs from "fs";
import { firstNames, lastNames, emails, options, URLs } from "./example.js";
import { loadStats } from "./stats.js";

// -------- CONFIG --------
// const URL = "https://career.zorvyn.io/careers/T0RT7Q/apply";
const RESUME_PATH = "./resume.pdf"; // Linux / GitHub Actions path
const MAX_RUNS = 10;
const stats = loadStats();
// ------------------------

// counters
// let totalTried = 0;
// let success = 0;
// let failed = 0;

// utility: random delay
const sleep = (min = 500, max = 1500) =>
  new Promise(res => setTimeout(res, min + Math.random() * (max - min)));

// utility: human typing
// async function humanFill(page, selector, text) {
//   await page.click(selector);
//   for (const char of text) {
//     await page.keyboard.type(char);
//     await sleep(40, 120);
//   }
// }

// launch browser (ONCE)
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"]
});

for (let run = 1; run <= MAX_RUNS; run++) {
  totalTried++;

  const page = await browser.newPage();
  const URL = URLs[Math.floor(Math.random() * URLs.length)];

  try {
    await page.goto(URL, { waitUntil: "networkidle" });

    const phone = `9${Math.floor(100000000 + Math.random() * 900000000)}`;
    
    const timestampt = Date.now();
    const email = timestampt + emails[Math.floor(Math.random() * emails.length)];

    // await humanFill(
    //   page,
    //   'input[placeholder="e.g., Priya"]',
    //   firstNames[Math.floor(Math.random() * firstNames.length)]
    // );

    // await humanFill(
    //   page,
    //   'input[placeholder="e.g., Sharma"]',
    //   lastNames[Math.floor(Math.random() * lastNames.length)]
    // );

    // await humanFill(
    //   page,
    //   'input[placeholder="e.g., priya@example.com"]',
    //   email
    // );

    // await humanFill(
    //   page,
    //   'input[placeholder="e.g., 9999999999"]',
    //   phone
    // );
    await page.fill(
      'input[placeholder="e.g., Priya"]',
      firstNames[Math.floor(Math.random() * firstNames.length)],
    );
    await page.fill(
      'input[placeholder="e.g., Sharma"]',
      lastNames[Math.floor(Math.random() * lastNames.length)],
    );
    await page.fill('input[placeholder="e.g., priya@example.com"]', email);
    await page.fill('input[placeholder="e.g., 9999999999"]', phone);

    const countryButton = page
      .locator('label:has-text("Country")')
      .locator('..')
      .locator('button[aria-haspopup="listbox"]');

    // Read current selected value
    const selectedCountry = (await countryButton.innerText()).trim();

    if (selectedCountry !== "India") {
        await countryButton.click();
        await page.waitForSelector('[role="option"]');
        await page.getByRole("option", { name: "India", exact: true }).click();
    }

    await page.setInputFiles('input[type="file"]', RESUME_PATH);
    // await sleep();

    await page.click("text=Next");
    // await sleep();

    await page.click("text=Next");
    // await sleep();

    await page.click("text=Next");
    // await sleep();

    await page.click(
      "text=" + options[Math.floor(Math.random() * options.length)]
    );
    // await sleep();

    await page.click("text=Next");
    // await sleep(1500, 2500);

    await page.click("text=Submit Application");
    // await sleep(3000, 5000);

    if (URL === URLs[0]) {
      stats.sde.success++;
    } else if (URL === URLs[1]) {
      stats.frontend.success++;
    } else {
        stats.uiux.success++;
    }
  } catch {
    // console.error(`❌ Run ${run} failed:`, err.message);
    if (URL === URLs[0]) {
      stats.sde.failed++;
    } else if (URL === URLs[1]) {
      stats.frontend.failed++;
    } else {
        stats.uiux.failed++;
    }
  } finally {
    await page.close();
    // console.log(`🧹 Page closed for run ${run}`);
    fs.writeFileSync("stats.json", JSON.stringify(stats, null, 2));
  }
}

// save minimal stats
// const stats = `
// TOTAL_TRIED=${totalTried}
// SUCCESS=${success}
// FAILED=${failed}
// `.trim();

// fs.writeFileSync(STATS_FILE, stats);

// console.log(stats); // visible in GitHub Actions summary

await browser.close();
