import { chromium } from "playwright";
import fs from "fs";
import { firstNames, lastNames, emails, options, URLs } from "./example.js";
import { loadStats } from "./stats.js";

const RESUME_PATH = "./resume.pdf";
const MAX_RUNS = 10;

const stats = loadStats();

const ROLE_MAP = {
  [URLs[0]]: "sde",
  [URLs[1]]: "frontend",
  [URLs[2]]: "uiux"
};

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"]
});

for (let run = 1; run <= MAX_RUNS; run++) {
  const page = await browser.newPage();
  const URL = URLs[Math.floor(Math.random() * URLs.length)];
  const role = ROLE_MAP[URL];

  try {
    await page.goto(URL, { waitUntil: "networkidle" });

    const phone = `9${Math.floor(100000000 + Math.random() * 900000000)}`;
    const email = Date.now() + emails[Math.floor(Math.random() * emails.length)];

    await page.fill('input[placeholder="e.g., Priya"]',
      firstNames[Math.floor(Math.random() * firstNames.length)]
    );
    await page.fill('input[placeholder="e.g., Sharma"]',
      lastNames[Math.floor(Math.random() * lastNames.length)]
    );
    await page.fill('input[placeholder="e.g., priya@example.com"]', email);
    await page.fill('input[placeholder="e.g., 9999999999"]', phone);

    const countryButton = page
      .locator('label:has-text("Country")')
      .locator('xpath=following-sibling::button');

    const selectedCountry = (await countryButton.innerText()).trim();
    if (selectedCountry !== "India") {
      await countryButton.click();
      await page.getByRole("option", { name: "India", exact: true }).click();
    }

    await page.setInputFiles('input[type="file"]', RESUME_PATH);

    await page.click("text=Next");
    await page.click("text=Next");
    await page.click("text=Next");
    await page.click("text=" + options[Math.floor(Math.random() * options.length)]);
    await page.click("text=Next");
    await page.click("text=Submit Application");

    stats[role].success++;

  } catch {
    stats[role].failed++;
  } finally {
    await page.close();
  }
}

// write stats ONCE
fs.writeFileSync("stats.json", JSON.stringify(stats, null, 2));

await browser.close();
