describe('Tab switching check', () => {
  beforeEach(async () => {
    await page.goto(global.TARGET_PAGE_URL, {waitUntil: 'networkidle0' });
  });

  test('should render a tab with data-tab="converter"', async () =>{
    const element = await page.$('.tab-item[data-tab="converter"]');
    expect(element).toBeTruthy();
  });

  test('should display "Unit Converter" in the sidebar', async () => {
    const element = await page.$('.tab-item[data-tab="converter"]');
    expect(element).toBeTruthy();
    const text = await element.evaluate(el => el.textContent);
    expect(text).toContain('Unit Converter');
  });

  test('should render the unit converter section', async () =>{
    const section = await page.$('section.content-section#converter');
    expect(section).toBeTruthy();
  });

  test('should display #home content and hide unit converter by default', async () => {
    const topDisplay = await page.$eval('#home', el => window.getComputedStyle(el).display);
    const converterTabDisplay = await page.$eval('#converter', el => window.getComputedStyle(el).display);
    expect(topDisplay).not.toBe('none');
    expect(converterTabDisplay).toBe('none');
  });

  test('should display unit converter content and hide others when the tab is clicked', async () => {
    await page.click('.tab-item[data-tab="converter"]');
    const topDisplay = await page.$eval('#home', el => window.getComputedStyle(el).display);
    const converterTabDisplay = await page.$eval('#converter', el => window.getComputedStyle(el).display);
    expect(topDisplay).toBe('none');
    expect(converterTabDisplay).not.toBe('none');
  });
});

describe('Conversion functionality check', () => {
  beforeEach(async () => {
    await page.goto(global.TARGET_PAGE_URL, { waitUntil: 'networkidle0' });
    await page.click('.tab-item[data-tab="converter"]');
    await page.waitForSelector('.converter-form', { timeout: 1000 });
  });

  test('should have an input field with class "converter-input"', async () =>{
    const input = await page.$('input.converter-input[type="number"]');
    expect(input).toBeTruthy();
  });

  test('should have a source unit select with class "converter-from"', async () =>{
    const selectFrom = await page.$('select.converter-from');
    expect(selectFrom).toBeTruthy();
  });

  test('should have a target unit select with class "converter-to"', async () =>{
    const selectTo = await page.$('select.converter-to');
    expect(selectTo).toBeTruthy();
  });

  test('should have an element with class "converter-result" for displaying results', async () =>{
    const result = await page.$('.converter-result');
    expect(result).toBeTruthy();
  });

  test('should display correct conversion result when converting 3 kilometers to miles', async () => {
    await page.select('.converter-from', '1000');
    await page.select('.converter-to', '1609.344');
    await page.evaluate(() => {
      const form = document.querySelector('.converter-form');
      if (form) {
        form.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    const inputSelector = '.converter-input';
    await page.waitForSelector(inputSelector);
    await page.click(inputSelector, { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type(inputSelector, '3');
    await page.evaluate((selector) => {
      const input = document.querySelector(selector);
      if (input) {
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, inputSelector);
    await page.waitForFunction(() => {
      const resultEl = document.querySelector('.converter-result');
      return resultEl && resultEl.textContent.includes('kilometer') && resultEl.textContent.includes('mile');
    }, { timeout: 500 });
    const resultText = await page.$eval('.converter-result', el => el.textContent);
    expect(resultText).toContain('3 kilometer = 1.864 mile');
  });

  test('should display an error message for non-numeric input', async () => {
    const inputSelector = '.converter-input';
    await page.waitForSelector(inputSelector);
    await page.click(inputSelector, { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type(inputSelector, 'abc');
    await page.evaluate(selector => {
      const input = document.querySelector(selector);
      if (input) {
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, inputSelector);
    await page.waitForFunction(() => {
      const resultEl = document.querySelector('.converter-result');
      return resultEl && resultEl.textContent.includes('Please enter a valid number');
    }, { timeout: 500 });
    const resultText = await page.$eval('.converter-result', el => el.textContent);
    expect(resultText).toContain('Please enter a valid number');
  });
});
