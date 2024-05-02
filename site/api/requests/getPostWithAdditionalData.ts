import { GetPostWithAdditionalDataRequest } from '../../../common/api/GetPostWithAdditionalData';
import { PostWithAdditionalData } from '../../../common/Post';

import { buildApiRequest } from '../utils';

export const getPostWithAdditionalData = buildApiRequest<
	GetPostWithAdditionalDataRequest,
	PostWithAdditionalData
>('/getPostWithAdditionalData');
