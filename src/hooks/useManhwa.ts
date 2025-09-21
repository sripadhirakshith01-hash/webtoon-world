import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Manhwa {
  id: string;
  title: string;
  author: string;
  description: string | null;
  cover_image: string | null;
  genre: string[];
  status: 'ongoing' | 'completed';
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: string;
  manhwa_id: string;
  title: string;
  chapter_number: number;
  pages: string[];
  publish_date: string;
  created_at: string;
  updated_at: string;
}

export const useManhwa = () => {
  const [manhwa, setManhwa] = useState<Manhwa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchManhwa = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('manhwa')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setManhwa((data || []) as Manhwa[]);
    } catch (err) {
      console.error('Error fetching manhwa:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch manhwa');
    } finally {
      setLoading(false);
    }
  };

  const getManhwaById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('manhwa')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching manhwa:', err);
      throw err;
    }
  };

  const getChaptersByManhwaId = async (manhwaId: string) => {
    try {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('manhwa_id', manhwaId)
        .order('chapter_number', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching chapters:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchManhwa();
  }, []);

  return {
    manhwa,
    loading,
    error,
    fetchManhwa,
    getManhwaById,
    getChaptersByManhwaId,
  };
};