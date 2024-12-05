import { auth } from '@/auth';
import { cache } from 'react';

/**
 * Deduped version of `auth` available on the server.
 */
export default cache(auth);
