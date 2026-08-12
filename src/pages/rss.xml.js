import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  return rss({
    title: '周游·记',
    description: '独立开发者。写代码也写字。',
    site: context.site,
    items: posts
      .filter((p) => !p.data.draft)
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        link: `/blog/${post.id.replace('.md', '')}/`,
      })),
  });
}
