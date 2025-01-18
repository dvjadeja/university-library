'use server';

import { db } from '@/database/drizzle';
import { books } from '@/database/schema';

export const createBook = async (params: BookParams) => {
  try {
    const newBook = await db
      .insert(books)
      .values({
        ...params,
        availableCopies: params?.totalCopies,
      })
      .returning();

    return {
      success: true,
      message: 'Book created successfully',
      data: JSON.parse(JSON.stringify(newBook)),
    };
  } catch (error) {
    console.log('🚀 ~ createBook ~ error:', error);
    return {
      success: false,
      message: 'An error occurred while creating the book',
    };
  }
};
