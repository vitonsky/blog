import { GetPostRequest } from '../../../common/api/GetPost';
import { Post } from '../../../common/Post';

import { buildApiRequest } from '../utils';

export const getPost = buildApiRequest<GetPostRequest, Post>('/getPost');
