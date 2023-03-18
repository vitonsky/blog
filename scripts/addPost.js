const path = require('path');
const fs = require('fs');

const date = new Date();
const postDate = {
	year: date.getUTCFullYear(),
	month: date.toLocaleString('en-GB', { month: 'long' }).toLowerCase(),
	day: date.getUTCDate(),
};

const template = `
---
title: "Draft: Title"
time: '${date.toLocaleString('en-GB', { minute: '2-digit', hour: '2-digit' })}'
tags:
keywords:
description:
image:
lang:
---

Text
`.trimStart();

const postUrlTitleSegment = String(date.getTime());

const postsDir = path.resolve(__dirname, '../posts/_drafts');
const postDir = path.join(
	postsDir,
	String(postDate.year),
	String(postDate.month),
	postUrlTitleSegment,
);
const postFilename = `${postDate.year}-${date.toLocaleString('en-GB', {
	month: '2-digit',
})}-${postDate.day}-${postUrlTitleSegment}.md`;

// Ensure post dir exists
if (!fs.existsSync(postDir)) {
	fs.mkdirSync(postDir, { recursive: true });
}

const postFilePath = path.resolve(postDir, postFilename);
fs.writeFileSync(postFilePath, template);

console.log('Post draft created', postFilePath);
