import React from "react";
import { Link } from "react-router-dom";

type Book = {
  id: number;
  title: string;
  author: { id?: number; name: string };
  rating: number;
  coverImage?: string;
  img?: string;
};

interface BookCardProps {
  book: Book;
}

const getImageSrc = (book: Book) => {
  const url = book.coverImage || book.img;
  if (!url || url.startsWith('blob:')) {
    return '/images/not-available.svg';
  }
  return url;
};

const BookCard: React.FC<BookCardProps> = ({ book }) => (
  <Link to={`/books/${book.id}`} className="block h-full">
    <div className="bg-white border border-gray-300 rounded-xl shadow-md flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full">
      <div
        className="w-full overflow-hidden bg-white"
        style={{
          aspectRatio: '5/7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
        }}
      >
        <img
          src={getImageSrc(book)}
          alt={book.title}
          className="w-full h-full object-cover"
          style={{
            background: '#ffffff',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            transition: 'box-shadow 0.2s',
          }}
        />
      </div>
      <div
        className="flex flex-col gap-1 px-0"
        style={{
          padding: 'clamp(8px, 2vw, 16px)',
        }}
      >
        <span
          className="font-bold"
          style={{
            fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
            lineHeight: 1.2,
            marginBottom: '2px',
          }}
        >
          {book.title}
        </span>
        <span className="text-neutral-700 text-text-md mb-1">
          {book.author?.name || "-"}
        </span>
        <span className="flex items-center gap-1 text-accent-yellow font-semibold text-text-md mt-1">
          <img src="/icons/star.svg" alt="Star icon" width={18} height={18} className="inline-block" />
          {book.rating}
        </span>
      </div>
    </div>
  </Link>
);

export default BookCard;