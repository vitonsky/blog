import { buildApiRequest } from '../api';

export const getPostUrls = buildApiRequest<void, string[]>('/getPostUrls');
