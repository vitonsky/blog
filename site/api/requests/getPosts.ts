import { GetPostsRequest } from '../../../common/api/GetPosts';
import { Post } from '../../../common/Post';

import { buildApiRequest } from '../utils';

export const getPosts = buildApiRequest<GetPostsRequest, Post[]>('/getPosts');
