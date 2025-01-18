import ImageKit from 'imagekit';
import dummyBooks from '../dummybooks.json';
import { books } from './schema';
import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle({ client: sql });

const imagekit = new ImageKit({
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY!,
  publicKey: process.env.NEXT_PUBLIC_IMAGE_KIT_PUBLIC_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGE_KIT_URL_ENDPOINT!,
});

const uploadToImageKit = async (
  url: string,
  fileName: string,
  folder: string
) => {
  try {
    const response = await imagekit.upload({
      file: url,
      fileName,
      folder,
    });

    return response.filePath;
  } catch (error) {
    console.log('🚀 ~ error uploading in uploadToImageKit:', error);
  }
};

const seed = async () => {
  console.log('🚀 ~ seed ~ seeding data...');

  try {
    for (const book of dummyBooks) {
      // extract from last / and and after extract after . from the book.title
      const fileName = `${book.title}.jpg`;
      console.log('🚀 ~ seed ~ fileName:', fileName);
      const coverUrl = (await uploadToImageKit(
        book.coverUrl,
        fileName,
        '/books/covers'
      )) as string;

      console.log('🚀 ~ seed ~ coverUrl:', coverUrl);

      const videoUrl = (await uploadToImageKit(
        book.videoUrl,
        fileName,
        '/books/videos'
      )) as string;

      console.log('🚀 ~ seed ~ videoUrl:', videoUrl);

      console.log('----------------------------');

      await db.insert(books).values({
        ...book,
        coverUrl,
        videoUrl,
      });
    }

    console.log('🚀 ~ seed ~ data seeded successfully');
  } catch (error) {
    console.log('Error seeding ~ error:', error);
  }
};

seed();
