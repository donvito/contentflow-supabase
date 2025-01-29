import { supabase } from './supabase';

export async function updateUserTimezone(timezone: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to update timezone');
  }

  const { error } = await supabase
    .from('profiles')
    .update({ timezone })
    .eq('id', user.id);

  if (error) {
    throw error;
  }
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getUserProfile() {
  let retries = 0;
  let lastError: any;
  
  while (retries < MAX_RETRIES) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to get profile');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      lastError = error;
      retries++;
      
      if (retries < MAX_RETRIES) {
        await wait(RETRY_DELAY * retries); // Exponential backoff
        continue;
      }
      
      console.error('Failed to fetch user profile after retries:', error);
      // Return default profile with UTC timezone if all retries fail
      return {
        id: null,
        timezone: 'UTC',
        email: null,
        name: null,
        created_at: null,
        updated_at: null
      };
    }
  }
  
  throw lastError;
}