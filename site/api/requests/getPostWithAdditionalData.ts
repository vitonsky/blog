import { buildApiRequest } from '../api';
import { PostWithAdditionalData } from '../../../common/Post';
import { GetPostWithAdditionalDataRequest } from '../../../common/api/GetPostWithAdditionalData';

export const getPostWithAdditionalData = buildApiRequest<
	GetPostWithAdditionalDataRequest,
	PostWithAdditionalData
>('/getPostWithAdditionalData');
