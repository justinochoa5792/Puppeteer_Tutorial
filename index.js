const puppeteer = require("puppeteer");
const fs = require("fs");

async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.traversymedia.com/");
  //await page.screenshot({ path: "lp.png", fullPage: true });
  //Gets All of the html elements
  const html = await page.content();
  //Gets the title of the page
  const title = await page.evaluate(() => document.title);
  const text = await page.evaluate(() => document.body.innerText);
  //Gets all of the hrefs on the page
  const links = await page.evaluate(() =>
    Array.from(document.querySelectorAll("a"), (e) => e.href)
  );

  // Get courses using $$eval
  const courses = await page.$$eval("#courses .card", (elements) =>
    elements.map((e) => ({
      title: e.querySelector(".card-body h3").innerText,
      level: e.querySelector(".card-body .level").innerText,
      url: e.querySelector(".card-footer a").href,
      promo: e.querySelector(".card-footer .promo-code .promo").innerText,
    }))
  );

  //Save info to JSON file
  fs.writeFile("courses.json", JSON.stringify(courses), (err) => {
    if (err) {
      throw err;
    } else {
      console.log("File Saved");
    }
  });
  await browser.close();
}

run();
