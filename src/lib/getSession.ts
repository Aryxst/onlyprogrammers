import { auth } from '@/auth';
import { cache } from 'react';

/**
 * Cached version of `auth` available on the server.
 */
export default cache(auth);
