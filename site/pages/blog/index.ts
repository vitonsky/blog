import * as BlogPage from "./p/[pageNumber]";

export const getStaticProps = () => BlogPage.getStaticProps({ params: { id: '1' } });
export default BlogPage.default;