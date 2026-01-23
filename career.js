import { chromium } from "playwright";
import { firstNames, lastNames, emails, options, URLs } from "./example.js";

const RESUME_PATH = "./resume.pdf";
const MAX_RUNS = 143;

const browser = await chromium.launch({
  headless: true,
});

for (let run = 0; run <= MAX_RUNS; run++) {
  const page = await browser.newPage();
  const URL = URLs[run % URLs.length];

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
    
    if (URL === "https://career.zorvyn.io/careers/1VPLOM/apply") {
      const lngs = [
        "Java",
        "C or C++",
        "Python",
        "JavaScript",
        "Other"
      ]
      const git = ["Yes", "No"]
      const attentionToDetail = ["Yes", "No"]

      await page.click(
        "text=" + lngs[Math.floor(Math.random() * lngs.length)],
      );
      await page.click(
        "text=" + attentionToDetail[Math.floor(Math.random() * attentionToDetail.length)],
      );
      await page.click(
        "text=" + git[Math.floor(Math.random() * git.length)],
      );
    }
    
    await page.click("text=" + options[Math.floor(Math.random() * options.length)]);
    await page.click("text=Next");
    await page.click("text=Submit Application");
    console.log(`✅ Run ${run+1} submitted successfully`);
  } catch {
    console.log("Error occured");
    console.error(`❌ Run ${run+1} failed:`, err.message);
  } finally {
    await page.close();
  }
}

console.log("Career Done");
await browser.close();
