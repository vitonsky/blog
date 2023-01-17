import { buildApiRequest } from '../utils';

export const getPostUrls = buildApiRequest<void, string[]>('/getPostUrls');
