import { supabase } from '@lib/supabaseClient';

interface HashtagPageProps {
  params: { tag: string };
}

export default async function HashtagPage({ params }: HashtagPageProps) {
  const { data: hashtagData } = await supabase
    .from('hashtags')
    .select('tweet_ids')
    .eq('tag', params.tag)
    .single();

  // Fetch tweets from the main tweets table
  const { data: tweets } = await supabase
    .from('tweets')
    .select('*')
    .in('id', hashtagData?.tweet_ids || []);

  return (
    <div>
      <h1>#{params.tag}</h1>
      {tweets?.map(tweet => (
        <div key={tweet.id}>
          <p>{tweet.content}</p>
        </div>
      ))}
    </div>
  );
}
