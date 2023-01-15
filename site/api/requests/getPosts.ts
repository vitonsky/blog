import { buildApiRequest } from '../api';
import { Post } from '../../../common/Post';
import { GetPostsRequest } from '../../../common/api/GetPosts';

export const getPosts = buildApiRequest<GetPostsRequest, Post[]>('/getPosts');
