

import { sampleBooks } from '@/constants';

import BookList from '@/components/BookList';

const Page = () => {
  return (
    <>
      <BookList title="Borrowed Books" books={sampleBooks} />
    </>
  );
};

export default Page;
