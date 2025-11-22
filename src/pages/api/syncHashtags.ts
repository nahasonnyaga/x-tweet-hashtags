import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@lib/supabaseClient';
import { extractHashtags } from '@lib/hashtagUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { tweetId, content } = req.body;
  if (!tweetId || !content) return res.status(400).json({ error: 'Missing tweetId or content' });

  const hashtags = extractHashtags(content);

  for (const tag of hashtags) {
    const { error } = await supabase.from('hashtags').upsert({
      tag,
      tweet_ids: supabase.raw('array_append(tweet_ids, ?)', [tweetId])
    });
    if (error) console.error(`Error syncing hashtag ${tag}:`, error);
  }

  res.status(200).json({ success: true, hashtags });
}
