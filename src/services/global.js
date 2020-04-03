import { get } from '@/utils/ajax';

export async function querySystemVersion() {
  return get('/api/release');
}
