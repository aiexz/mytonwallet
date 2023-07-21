/* eslint-env node */

const fs = require('fs');
const createPrComment = require('./createPrComment');
const template = require('../.github/workflows/statoscope-comment');

module.exports = async ({ github, context }) => {
  const data = JSON.parse(fs.readFileSync('result.json', 'utf8'));
  data.prNumber = context.issue.number;
  const body = template(data);

  await createPrComment({ github, context, body });
};
