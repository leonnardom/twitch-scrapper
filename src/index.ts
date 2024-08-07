import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import puppeteer from 'puppeteer-extra';
import Stealth from 'puppeteer-extra-plugin-stealth';
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha';

import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());

interface TwitchTrackerData {
  peakViewers: number;
  averageViewers: number;
}

async function scrapeTwitchTracker(
  url: string
): Promise<{ [key: string]: TwitchTrackerData }> {
  await puppeteer.use(Stealth());
  await puppeteer.use(
    RecaptchaPlugin({
      provider: {
        id: '2captcha',
        token: process.env.RECAPTCHA_TOKEN || ''
      },
      visualFeedback: true
    })
  );

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle2' });

    const periods = ['week', 'month', '3 months'];
    const results: { [key: string]: TwitchTrackerData } = {};

    for (const period of periods) {
      // Click on the corresponding period tab
      await page.click(`span[data-key="${period}"]`);
      await page.waitForSelector('div.g-x-s-block', { timeout: 10000 }); // Ensure the data has loaded

      // Evaluate and extract data
      const data = await page.evaluate(() => {
        const peakViewersSelector =
          'div.g-x-s-block:nth-child(3) > div.g-x-s-value > div > span';
        const averageViewersSelector =
          'div.g-x-s-block:nth-child(2) > div.g-x-s-value > div > span';

        const parseNumber = (text: string): number => {
          return text ? parseInt(text.replace(/\D/g, ''), 10) : 0;
        };

        const peakViewersElement = document.querySelector(peakViewersSelector);
        const averageViewersElement = document.querySelector(
          averageViewersSelector
        );

        return {
          peakViewers: parseNumber(peakViewersElement?.textContent || ''),
          averageViewers: parseNumber(averageViewersElement?.textContent || '')
        };
      });

      results[period] = data;
      // Wait a bit before the next click to avoid issues
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Remove the following code to disable "All Time" scraping
    // No further action or code related to "All Time" should be here

    return results;
  } catch (error) {
    console.error('Failed to scrape TwitchTracker:', error);
    return {};
  } finally {
    await browser.close();
  }
}

app
  .post('/scrape', async (req: Request, res: Response) => {
    console.log(`\x1b[34m[SCRAPPER]\x1b[0m`, `Starting Scrapper.`);

    const { url } = req.body;

    console.log(`\x1b[34m[NEW POST]\x1b[0m`, `New Post using URL: ${url}`);

    const twitchData = await scrapeTwitchTracker(url);

    res.json({
      success: true,
      data: twitchData
    });
  })

  .listen(PORT, () =>
    console.log(`\x1b[34m[PORT]\x1b[0m`, `Server is running on port ${PORT}`)
  );
