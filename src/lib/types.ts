export type Project = {
  id: string;
  title: string;
  year: number | null;
  images: string[];
  description: string;
  category: string[];
  platform: string[];
  tags: string[];
  url?: string;
  repo?: string;
  privacy: 'public' | 'private' | 'restricted';
};

export type Job = {
  id: number;
  title: string;
  name: string;
  year: number;
  location: string;
};

export type Post = {
  slug: string;
  title: string;
  date: string | number;
};
