const fs = require('fs');
const path = require('path');

const statusStart = '<!-- Newsletter_Start -->';
const statusEnd = '<!-- Newsletter_End -->';

const readmeFilePath = path.join(process.env.GITHUB_WORKSPACE, 'README.md');
const tmpFilePath = path.join(process.env.GITHUB_WORKSPACE, 'README.tmp');

const currentDate = new Date().toLocaleString();
const successMessage = `Workflow ran successfully at ${currentDate}`;

try {
  const readmeContent = fs.readFileSync(readmeFilePath, 'utf8');
  const statusStartIndex = readmeContent.indexOf(statusStart);
  const statusEndIndex = readmeContent.indexOf(statusEnd, statusStartIndex) + statusEnd.length;

  if (statusStartIndex === -1 || statusEndIndex === -1) {
    console.log('Status markers not found in README.md');
    return;
  }

  const updatedContent =
    readmeContent.slice(0, statusStartIndex + statusStart.length) +
    '\n' +
    successMessage +
    '\n' +
    readmeContent.slice(statusEndIndex);

  fs.writeFileSync(tmpFilePath, updatedContent);
  fs.renameSync(tmpFilePath, readmeFilePath);
} catch (err) {
  console.error('Error updating README.md:', err);
}