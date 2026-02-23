import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookDetail from "../components/BookDetail";
import ReviewList from "../components/ReviewList";
import RelatedBooks from "../components/RelatedBooks";
import Footer from "../components/Footer";
import Header from '../components/Header';

type Author = { id: number; name: string };
type Category = { id: number; name: string };
type Review = {
  id: number;
  star: number;
  comment: string;
  createdAt: string;
  user: { id: number; name: string };
};
type Book = {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  totalCopies: number;
  availableCopies: number;
  author: Author;
  category: Category;
  reviews: Review[];
};

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [related, setRelated] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://library-backend-production-b9cf.up.railway.app/api/books/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setBook(data.data);
        } else {
          setBook(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setBook(null);
        setLoading(false);
      });

    fetch("https://library-backend-production-b9cf.up.railway.app/api/books?page=1&limit=8")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setRelated(data.data.filter((b: Book) => String(b.id) !== id));
        } else {
          setRelated([]);
        }
      })
      .catch(() => {
        setRelated([]);
      });
  }, [id]);

  if (loading) return <div className="text-center py-20 text-lg">Loading...</div>;
  if (!book) return <div className="text-center py-20 text-lg text-red-500">Book not found.</div>;

  return (
    <>
      <Header />
      <div className="w-full bg-white mx-auto px-4 md:px-[120px] py-[128px]">
        <BookDetail book={book} />
        <div className="my-16 h-[1px] bg-neutral-300 w-full" />
        <ReviewList reviews={book.reviews || []} />
        <div className="my-16 h-[1px] bg-neutral-300 w-full" />
        <RelatedBooks books={related} />
      </div>
      <Footer />
    </>
  );
};

export default BookDetailPage;