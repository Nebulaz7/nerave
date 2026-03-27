import { useMemo } from 'react';
import { Nerave } from 'nerave-sdk';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_NERAVE_API_URL || 'https://nerave.onrender.com';

/**
 * Returns an initialized Nerave SDK client bound to the current user's API key.
 * Also returns the user's access token for JWT-authenticated calls.
 */
export function useNerave() {
  const { user } = useAuth();

  const client = useMemo(() => {
    if (!user) return null;
    return new Nerave({
      apiKey: user.apiKey,
      baseUrl: API_URL,
    });
  }, [user]);

  return { nerave: client, apiKey: user?.apiKey ?? null, accessToken: user?.accessToken ?? null };
}
