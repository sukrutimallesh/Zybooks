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
    // Extract username and password from the request JSON payload
    const { username, password, links, keywords } = req.body;

    // Initialize the web driver (make sure you have the appropriate driver for Chrome)
    const driver = await new Builder().forBrowser('chrome').build();

    // Navigate to the Zybooks sign-in page
    await driver.get('https://learn.zybooks.com/signin');

    // Wait for the sign-in page to load (add appropriate wait times or use WebDriver's ExpectedConditions for better handling)
    await driver.sleep(5000);

    // Find the username/email input field and input the username
    const usernameField = await driver.findElement(By.css('input[type="email"]'));
    await usernameField.sendKeys(username);

    // Find the password input field and input the password
    const passwordField = await driver.findElement(By.css('input[type="password"]'));
    await passwordField.sendKeys(password);

    // Find the sign-in button and click it
    const signInButton = await driver.findElement(By.css('button.signin-button'));
    await signInButton.click();

    // Wait for authentication to complete (add appropriate waits based on the website's behavior)
    await driver.sleep(5000);

    // Proceed with your desired interactions on the authenticated Zybooks page

    // The WebDriver will continue running after signing in, allowing you to interact with the website.

    // Loop through each link and search for the keyword
    for (const link of links) {
        await driver.get(link); // Navigate to the next link
  
        // Wait for the page to load (add appropriate wait times or use WebDriver's ExpectedConditions for better handling)
        await driver.sleep(5000);
  
        // Search for the "Start" keyword and click on it
        for (const keyword of keywords) {
          const pageContent = await driver.getPageSource();
          if (pageContent.includes(keyword)) {
            const element = await driver.findElement(By.xpath(`//span[contains(text(), '${keyword}')]`));
            await element.click();
            await driver.sleep(2000); // Wait for a moment to simulate human interaction
          }
        }
      }

    res.status(200).json({ message: 'Authentication and automation completed successfully.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong during authentication and automation.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
