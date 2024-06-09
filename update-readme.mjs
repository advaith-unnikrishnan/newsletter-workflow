import fs from 'fs';
import fetch from 'node-fetch';
import xml2js from 'xml2js';

const SUBSTACK_RSS_FEED_URL = 'https://advaithu.substack.com/feed';
const MAX_EDITIONS = 5;

async function fetchLatestEditions() { 
  const response = await fetch(SUBSTACK_RSS_FEED_URL);
  const data = await response.text();

  const parser = new xml2js.Parser();
  const feed = await parser.parseStringPromise(data);

  return feed.rss.channel[0].item.slice(0, MAX_EDITIONS);
}

async function updateReadme(editions) {
  const readmeFile = 'README.md';
  const readmeContent = fs.readFileSync(readmeFile, 'utf8');

  const readmeLines = readmeContent.split('\n');
  const updatedLines = [];

  let foundSection = false;
  for (const line of readmeLines) {
    if (line.trim() === '<!-- SUBSTACK_NEWSLETTER_START -->') {
      foundSection = true;
      updatedLines.push(line);
      for (const edition of editions) {
        updatedLines.push(`- [${edition.title[0]}](${edition.link[0]})`);
      }
      updatedLines.push('<!-- SUBSTACK_NEWSLETTER_END -->');
    } else if (line.trim() === '<!-- SUBSTACK_NEWSLETTER_END -->') {
      foundSection = false;
      updatedLines.push(line);
    } else if (!foundSection) {
      updatedLines.push(line);
    }
  }

  const updatedContent = updatedLines.join('\n');
  fs.writeFileSync(readmeFile, updatedContent);
}

async function main() {
  const editions = await fetchLatestEditions();
  await updateReadme(editions);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});