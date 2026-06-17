export type ShortLink = {
  id: number;
  slug: string;
  original_url: string;
  short_url: string;
  created_at: string;
  access_count: number;
};

export type LinkResolveResponse = {
  slug: string;
  original_url: string;
};
