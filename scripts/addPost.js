const path = require('path');
const fs = require('fs');

const date = new Date();

// Create post title
const slug = [
	date.toLocaleString('en-GB', { year: 'numeric' }),
	date.toLocaleString('en-GB', { month: '2-digit' }),
	date.toLocaleString('en-GB', { day: '2-digit' }),
	date.getTime(),
].join('/');

const template = `
---
slug: '${slug}'
title: "New post"
date: '${date.toLocaleString('en-GB', { minute: '2-digit', hour: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit' })}'
image:
tags:
keywords:
---

`.trimStart();

// Write file

const postDate = {
	year: date.getUTCFullYear(),
	month: date.toLocaleString('en-GB', { month: 'long' }).toLowerCase(),
	day: date.getUTCDate(),
};

const postUrlTitleSegment = String(date.getTime());

const postsDir = path.resolve(__dirname, '../posts');
const postDir = path.join(
	postsDir,
	String(postDate.year),
	String(postDate.month),
	postUrlTitleSegment,
);
const postFilename = `${postDate.year}-${date.toLocaleString('en-GB', {
	month: '2-digit',
})}-${postDate.day}-${postUrlTitleSegment}.mdx`;

// Ensure post dir exists
if (!fs.existsSync(postDir)) {
	fs.mkdirSync(postDir, { recursive: true });
}

const postFilePath = path.resolve(postDir, postFilename);
fs.writeFileSync(postFilePath, template);

console.log('Post draft created', postFilePath);
