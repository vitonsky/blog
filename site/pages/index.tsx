import { getStaticProps as getStaticPropsForBlog } from './blog/index';
import { generateRss } from '../lib/rss';

export { default } from './blog/index';

// Execute service tasks
export const getStaticProps = async () => {
	console.log('Generate RSS');
	await generateRss();

	return getStaticPropsForBlog();
};