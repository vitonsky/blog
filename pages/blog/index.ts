import * as BlogPage from "./p/[id]";

export const getStaticProps = () => BlogPage.getStaticProps({ params: { id: '1' } });
export default BlogPage.default;