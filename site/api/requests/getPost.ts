import { buildApiRequest } from '../api';
import { Post } from '../../../common/Post';
import { GetPostRequest } from '../../../common/api/GetPost';

export const getPost = buildApiRequest<GetPostRequest, Post>('/getPost');
