import {
	GetPaginationInfoRequest,
	GetPaginationInfoResponse,
} from '../../../common/api/GetPaginationInfo';

import { buildApiRequest } from '../utils';

export const getPaginationInfo = buildApiRequest<
	GetPaginationInfoRequest,
	GetPaginationInfoResponse
>('/getPaginationInfo');
