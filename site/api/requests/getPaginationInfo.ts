import { buildApiRequest } from '../api';
import {
	GetPaginationInfoRequest,
	GetPaginationInfoResponse,
} from '../../../common/api/GetPaginationInfo';

export const getPaginationInfo = buildApiRequest<
	GetPaginationInfoRequest,
	GetPaginationInfoResponse
>('/getPaginationInfo');
