'use client';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { borrowBook } from '@/lib/actions/book';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  userId: string;
  bookId: string;
  borrowingEligibilty: {
    isEligible: boolean;
    message: string;
  };
}

const BorrowBook = ({
  userId,
  bookId,
  borrowingEligibilty: { isEligible, message },
}: Props) => {
  const router = useRouter();

  const [borrowing, setBorrowing] = useState(false);

  const handleBorrow = async () => {
    if (!isEligible) {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });

      return;
    }

    setBorrowing(true);

    try {
      const result = await borrowBook({
        bookId,
        userId,
      });

      if (result.success) {
        toast({
          title: 'Success',
          description: result.message,
        });
        router.push(`/`);
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.log('🚀 ~ handleBorrow ~ error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while borrowing the book',
        variant: 'destructive',
      });
    } finally {
      setBorrowing(false);
    }
  };
  return (
    <Button
      className="book-overview_btn"
      onClick={handleBorrow}
      disabled={borrowing}
    >
      <Image src="/icons/book.svg" alt="book" width={20} height={20} />
      <p className="font-bebas-neue text-xl text-dark-100">
        {borrowing ? 'Borrowing...' : 'Borrow Book'}
      </p>
    </Button>
  );
};

export default BorrowBook;
