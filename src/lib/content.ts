import { supabase } from './supabase';
import { ContentFormData } from '../components/AddContentModal';
import { getUserProfile } from './profile';

export interface Content {
  id: string;
  user_id: string;
  title: string;
  type: 'post' | 'video' | 'article';
  platform: 'instagram' | 'youtube' | 'twitter' | 'linkedin';
  scheduled_date: string;
  description: string;
  image_url?: string;
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export async function uploadContentImage(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError, data } = await supabase.storage
    .from('content-images')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('content-images')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function getContent() {
  let retries = 0;
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000;

  while (retries < MAX_RETRIES) {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('scheduled_date', { ascending: true, nullsLast: true });

      if (error) throw error;
      return data as Content[];
    } catch (error) {
      retries++;
      if (retries === MAX_RETRIES) throw error;
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retries));
    }
  }

  // This should never be reached due to throw in the loop
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .order('scheduled_date', { ascending: true, nullsLast: true });

  if (error) throw error;
  return data as Content[];
}

import { toUTC } from './dates';

export async function createContent(content: ContentFormData) {
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get user's timezone from profile
  const profile = await getUserProfile();
  
  if (!user) {
    throw new Error('User must be authenticated to create content');
  }
  
  const { data, error } = await supabase
    .from('content')
    .insert([{
      user_id: user.id,
      title: content.title,
      type: content.type,
      platform: content.platform,
      scheduled_date: content.scheduledDate ? toUTC(content.scheduledDate) : null,
      description: content.description,
      image_url: content.imageUrl,
      status: content.scheduledDate ? 'scheduled' : 'draft'
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Content;
}

export async function updateContent(id: string, content: Partial<ContentFormData>) {
  if (!id) {
    throw new Error('Content ID is required for update');
  }

  // Get user's timezone from profile
  const profile = await getUserProfile();

  const updateData = {
    title: content.title,
    type: content.type,
    platform: content.platform,
    description: content.description,
    image_url: content.imageUrl,
    scheduled_date: content.scheduledDate ? toUTC(content.scheduledDate) : null,
    status: content.status,
  };

  // Remove undefined values
  Object.keys(updateData).forEach(key => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });

  const { error } = await supabase
    .from('content')
    .update(updateData)
    .eq('id', id);

  if (error) {
    throw error;
  }
}

export async function deleteContent(id: string) {
  const { error } = await supabase
    .from('content')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}
export async function updateContentStatus(id: string, status: Content['status']) {
  const { error } = await supabase
    .from('content')
    .update({ status })
    .eq('id', id);

  if (error) {
    throw error;
  }
}