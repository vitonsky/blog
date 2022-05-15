This is my blog

## Road map

- [x] Implement visual design
- [x] Improve markup for SEO
	- [x] improve meta data in layout
	- [x] use meta tags for social media
	- [x] use nofollow and external links
	- [x] add buttons for share
- [x] Implement RSS feed
- [x] Improve view
	- [x] Add graceful font family
	- [x] Improve colors
	- [x] Add favicon
- [x] Add spinner for dynamic loading page content
- [x] Add button "Back to top"
- [x] Move processing logic to API server
	- [x] Implement caching of data
	- [x] Try to implement auto extracting files
- [x] Prefer to data from name instead of file info
- [ ] Set 15 items per page
- [ ] Deploy on gh-pages
- [ ] Bind domain
- [ ] Check TODOs
- [ ] Write about blog

Improvements
- [x] Implement auto extracting local resources of articles to directory `/public/files`. It allow to keep attachments in post directory
- [x] use description instead `previewText`
- [x] Improve url of posts to split date in title to path segments: `2022-01-01-title.md` -> `blog/2022/01/01/title`
- [x] Add styles for code block
- [ ] Improve linters
- [x] Add directory with drafts and subdirectory with not synced drafts. Show posts from this directory in dev mode
- [ ] Add anchors to sections
- [ ] Add page with tags
- [ ] Add analytics
- [ ] Add comments
- [ ] Add components to embedded video, tweets and other iframes
- [ ] Move styles to tokens
- [ ] Use HTTP server which handle all posts only once to optimize building and avoid parse all posts for each page generation