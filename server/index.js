const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.post('/analyze', async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const styles = await page.evaluate(() => {
      const textTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'small', 'strong', 'em', 'a', 'li', 'span'];
      const elements = Array.from(document.querySelectorAll(textTags.join(',')));
      const uniqueStyles = [];

      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        const font = style.fontFamily;
        const size = style.fontSize;
        const weight = style.fontWeight;
        const color = style.color;
        const bgColor = style.backgroundColor;

        const key = `${el.tagName}-${font}-${size}-${weight}-${color}-${bgColor}`;
        if (!uniqueStyles.some(s => s.key === key)) {
          uniqueStyles.push({
            tag: el.tagName.toLowerCase(),
            font,
            size,
            weight,
            color,
            bgColor,
            key
          });
        }
      });

      return uniqueStyles;
    });

    await browser.close();
    res.json({ styles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
