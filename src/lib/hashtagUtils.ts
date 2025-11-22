export function extractHashtags(text: string): string[] {
  const regex = /#(\w+)/g;
  const matches = text.match(regex);
  return matches ? matches.map(tag => tag.slice(1).toLowerCase()) : [];
}
