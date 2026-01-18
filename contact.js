import { chromium } from "playwright";
import {
  firstNames, lastNames, emails,
  industries, countries, companySize, registered,
  product, timeline, positions, companyName, messages
} from "./example.js";

const MAX_RUNS = 143;

const browser = await chromium.launch({
  headless: true,
  slowMo: 50
});

for (let run = 1; run <= MAX_RUNS; run++) {
  const page = await browser.newPage();
  const URL = "https://zorvyn.io/contact";
  const isRegistered = registered[Math.floor(Math.random() * registered.length)];

  try {
    await page.goto(URL, { waitUntil: "networkidle" });

    const email = Date.now() + emails[Math.floor(Math.random() * emails.length)];
    const phone = `9${Math.floor(100000000 + Math.random() * 900000000)}`;

    await page.fill('input[placeholder="Acme Inc."]',
      companyName[Math.floor(Math.random() * companyName.length)]
    );

    await page.locator('select[name="companyIndustry"]')
      .selectOption(industries[Math.floor(Math.random() * industries.length)]);

    await page.locator('select[name="country"]')
      .selectOption(countries[Math.floor(Math.random() * countries.length)]);

    await page.locator('select[name="companySize"]')
      .selectOption(companySize[Math.floor(Math.random() * companySize.length)]);

    await page.locator('select[name="isRegistered"]').selectOption(isRegistered);

    if (isRegistered === "Yes") {
      await page.fill('input[name="registrationNumber"]',
        Math.floor(Math.random() * 1e9).toString()
      );
    }

    await page.click("text=Next");

    await page.fill('input[name="yourName"]',
      `${firstNames[Math.floor(Math.random()*firstNames.length)]} ${lastNames[Math.floor(Math.random()*lastNames.length)]}`
    );

    await page.fill('input[name="yourPosition"]',
      positions[Math.floor(Math.random()*positions.length)]
    );

    await page.fill('input[name="email"]', email);
    await page.fill('input[name="phone"]', phone);

    await page.click("text=Next");

    await page.locator('select[name="product"]')
      .selectOption(product[Math.floor(Math.random()*product.length)]);

    await page.locator('select[name="timeline"]')
      .selectOption(timeline[Math.floor(Math.random()*timeline.length)]);

    await page.fill('textarea[name="message"]',
      messages[Math.floor(Math.random()*messages.length)]
    );

    await page.click('input[name="agree"]');
    await page.click("button[type='submit']");

  } finally {
    await page.close();
  }
}

await browser.close();
