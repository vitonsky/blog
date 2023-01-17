import { buildApiRequest } from '../utils';
import { PostWithAdditionalData } from '../../../common/Post';
import { GetPostWithAdditionalDataRequest } from '../../../common/api/GetPostWithAdditionalData';

export const getPostWithAdditionalData = buildApiRequest<
	GetPostWithAdditionalDataRequest,
	PostWithAdditionalData
>('/getPostWithAdditionalData');
