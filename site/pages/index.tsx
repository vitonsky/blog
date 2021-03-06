import { getStaticProps as getStaticPropsForBlog } from './blog/index';
import { generateRss } from '../lib/rss';
import { generateSitemap } from '../lib/sitemap';

export { default } from './blog/index';

// Execute service tasks
export const getStaticProps = async () => {
	console.log('Generate RSS');
	await generateRss();

	console.log('Generate sitemap');
	await generateSitemap();

	return getStaticPropsForBlog();
};
