describe('Sidebar test', () => {
  beforeEach(async () => {
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
    // global.TARGET_PAGE_URL からURLを取得して使用
    await page.goto(global.TARGET_PAGE_URL);
  });

  test('aside element exists', async () => {
    const hasAside = await page.evaluate(() => {
      return !!document.querySelector('aside');
    });
    expect(hasAside).toBeTruthy();
  });

  test('aside width is between 200 and 300', async () => {
    const asideWidth = await page.evaluate(() => {
      const aside = document.querySelector('aside');
      if (!aside) return null;
      return aside.getBoundingClientRect().width;
    });
    expect(asideWidth).not.toBeNull();
    expect(asideWidth).toBeGreaterThanOrEqual(200);
    expect(asideWidth).toBeLessThanOrEqual(300);
  });
});

describe('Main content test', () => {
  beforeEach(async () => {
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
    // global.TARGET_PAGE_URL からURLを取得して使用
    await page.goto(global.TARGET_PAGE_URL);
  });
  
  test('main element exists', async () => {
    const hasMain = await page.evaluate(() => {
      return !!document.querySelector('main');
    });
    expect(hasMain).toBeTruthy();
  });

  test('main width is more than 600', async () => {
    const mainWidth = await page.evaluate(() => {
      const main = document.querySelector('main');
      if (!main) return null;
      return main.getBoundingClientRect().width;
    });
    expect(mainWidth).not.toBeNull();
    expect(mainWidth).toBeGreaterThanOrEqual(600);
  });

  test('Paragraphs are displayed in separate elements', async () => {
    const paragraph1 = `
      This dashboard is a tool to enrich your daily life. You can easily use essential features such as diary entries, memo management, and checking weather information.
    `.replace(/\s+/g, '');

    const paragraph2 = `
      Small daily records become irreplaceable memories, and efficient task management leads to fulfilling days. Please use this as a partner that supports your everyday life.
    `.replace(/\s+/g, '');

    const paragraphTexts = await page.$$eval('p, div, section', nodes =>
      nodes.map(el => el.innerText.replace(/\s+/g, ''))
    );

    expect(paragraphTexts).toEqual(expect.arrayContaining([
      expect.stringContaining(paragraph1),
      expect.stringContaining(paragraph2)
    ]));
  });
});

describe('layout test', () => {
  beforeEach(async () => {
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
    await page.goto(global.TARGET_PAGE_URL);
  });

  test('Page title is Dashboard or dashboard', async () => {
    const title = await page.title();
    expect(['Dashboard', 'dashboard']).toContain(title);
  });

  test('At least one direct child of body has display:flex', async () => {
    const hasFlex = await page.evaluate(() => {
      const firstChild = document.body.children[0];
      if (!firstChild) return false;
      return getComputedStyle(firstChild).display === 'flex';
    });
    expect(hasFlex).toBeTruthy();
  });

  test('The first direct child of body has height:100vh', async () => {
    const containerHeightDiff = await page.evaluate(() => {
      const firstChild = document.body.children[0];
      if (!firstChild) return null;
      const height = parseInt(getComputedStyle(firstChild).height);
      // 100vhはピクセル値に変換されるので、window.innerHeightと比較
      // 多少の誤差を許容
      return Math.abs(height - window.innerHeight);
    });
    expect(containerHeightDiff).not.toBeNull();
    expect(containerHeightDiff).toBeLessThanOrEqual(2);
  });
});

