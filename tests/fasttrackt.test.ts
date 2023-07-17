import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { chromium, expect, test, Page  } from "@playwright/test";

/**
 * Automated use cases for fasttrack
 * https://demo.ft-crm.com/tour
 */
// require playwright, csv-parse;
 
/**
 * See execution command test {npx playwright test --workers=1 --headed ;  npx playwright show-report}.
 */

//configures the test to run in series
test.describe.configure({ mode: 'serial' });
let page: Page;

//saves the data used by the use cases in the file user.csv
const records = parse(fs.readFileSync(path.join(__dirname, 'user.csv')), {
    columns: true,
    skip_empty_lines: true
  });

//method to be executed before any test 
test.beforeAll(async ({  }) => {
  //Arrange
  const browser = await chromium.launch({
    args: [
          
            "--enable-features=UseOzonePlatform",
            "--ozone-platform=wayland",
            "--in-process-gpu",
          ],
    headless: false,
  });    
  const context = await browser.newContext();
  page = await browser.newPage();
});

//method to be executed after any test 
test.afterAll(async () => {
  await page.close();
});

//scrolls through the data in user.csv file
for (const record of records) {
    
    test(`fasttrack_casinoApp_registerUser Case: ${record.test_case}`, async ({  }) => {
      console.log(record.test_case, record.username, record.password);

      //Act
      await page.goto("https://demo.ft-crm.com/tour")
      await page.click(".register")
      await page.click(".button--intro")
      await page.fill(".input", `${record.username}`)
      await page.click(".input-button")
      await page.fill(".input", `${record.password}`)
      await page.click(".input-button")
      await page.fill(".phone-number-input--small", "+57")
      await page.fill(".phone-number-input:nth-child(2)", "99970876")
      await page.click(".input-button")
      await page.fill(".input", "edwin barreto")
      await page.click(".input-button")
      await page.fill("input[type='password']", "holapage")
      await page.click(".input-button")
      
      //Assert
      await expect(page.locator("h3")).toContainText('Your registration is complete');
    
    });

    test(`fasttrack_casinoApp_loginUser Case: ${record.test_case}`, async ({  }) => {
      console.log(record.test_case, record.username, record.password);

      //Act
      await page.goto("https://demo.ft-crm.com/tour")
      await page.click(".column:nth-child(2) > .button")
      await page.fill(".input", `${record.username}`)
      await page.click(".input-button")
      
      //Assert
      await expect(page.locator(".big-text")).toContainText('Fast Track CRM - Built for Casino, Sports and Lottery');
      
      });

    test(`fasttrack_casinoApp_assessBalance Case: ${record.test_case}`, async ({  }) => {
      console.log(record.test_case, record.username, record.password);
      
      //Act
      await page.goto("https://demo.ft-crm.com/tour")

      const beforeBalance =  await page.locator('.money').textContent();
      const beforeBalanceclean=beforeBalance?.replace("€","").replace("\n        ", "").replace("\n","").replace("      ","")
      const beforeBalanceNum=Number(beforeBalanceclean);
      await page.click(".money")

      await page.locator('.form-input:nth-child(2)').selectOption('FastTrackBonus + 500%')
      await page.click(".buttons > .button--deposit:nth-child(2)")
      await page.click(".button-row:nth-child(2) > .button:nth-child(2)")
      await page.click(".button--secondary:nth-child(1)")
      await page.click(".button-wrapper > .button")

      await page.reload({waitUntil:'load', timeout:5000});
      const afterBalance =  await page.locator('.money').textContent();
      const afterBalanceclean=afterBalance?.replace("€","").replace("\n        ", "").replace("\n","").replace("      ","")
      const afterBalanceNum=Number(afterBalanceclean);
      
      //Assert
      await expect(beforeBalanceNum < afterBalanceNum).toBeTruthy();
            
      });

    test(`fasttrack_casinoApp_playGame Case: ${record.test_case}`, async ({  }) => {
      console.log(record.test_case, record.username, record.password);

      //Act
      await page.goto("https://demo.ft-crm.com/tour")

      const beforeBalance =  await page.locator('.money').textContent();
      const beforeBalanceclean=beforeBalance?.replace("€","").replace("\n        ", "").replace("\n","").replace("      ","")
      const beforeBalanceNum=Number(beforeBalanceclean);

      await page.click(".second")
      await page.click(".menu-item:nth-child(2) > .page-link")
      await page.click(".game:nth-child(1) .bet-button:nth-child(1)")
      await page.click(".button:nth-child(4)")
      await page.click(".column:nth-child(3) > .button")
      await page.click(".button--secondary")

      await page.reload({waitUntil:'load', timeout:5000});
      const afterBalance =  await page.locator('.money').textContent();
      const afterBalanceclean=afterBalance?.replace("€","").replace("\n        ", "").replace("\n","").replace("      ","")
      const afterBalanceNum=Number(afterBalanceclean);
      
      //Assert
      await expect(beforeBalanceNum != afterBalanceNum).toBeTruthy();
      });
  }