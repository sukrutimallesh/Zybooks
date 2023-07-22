const { Builder, By } = require('selenium-webdriver');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

// Define your routes
app.post('/automateZybooks', async (req, res) => {
  try {
    const targetUrl = 'https://learn.zybooks.com/zybook/SDSUCS150Fall2022/chapter/2/section/1'; // URL of the specific Zybooks page you want to interact with
    const targetKeywords = ['Start']; // Keywords of elements you want to click

    // Initialize the web driver (make sure you have the appropriate driver for Chrome)
    const driver = await new Builder().forBrowser('chrome').build();

    // Navigate to the target page
    await driver.get(targetUrl);

    // Wait for the page to load (add appropriate wait times or use WebDriver's ExpectedConditions for better handling)
    await driver.sleep(5000);

    // Look for keywords in the page content
    for (const keyword of targetKeywords) {
      const pageContent = await driver.getPageSource();
      if (pageContent.includes(keyword)) {
        // Find the element and click on it
        const element = await driver.findElement(By.xpath(`//*[contains(text(), '${keyword}')]`));
        await element.click();

        // Wait for a moment to simulate human interaction
        await driver.sleep(2000);
      }
    }

    // Close the browser
    await driver.quit();

    res.status(200).json({ message: 'Automation completed successfully.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
