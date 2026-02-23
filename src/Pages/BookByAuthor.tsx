import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BookCard from "../components/BookCard";

type Book = {
  id: number;
  title: string;
  author: { id?: number; name: string };
  rating: number;
  coverImage?: string;
};

type Author = {
  id: number;
  name: string;
  bio?: string;
  bookCount: number;
  profilePhoto?: string;
};

const getInitial = (name: string | undefined) => {
  if (!name) return "??";
  const words = name.trim().split(" ");
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

const BookByAuthor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [author, setAuthor] = useState<Author | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [bookCount, setBookCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://library-backend-production-b9cf.up.railway.app/api/authors/${id}/books?page=1&limit=12`)
      .then((res) => res.json())
      .then((data) => {
        setAuthor(data?.data?.author || null);
        setBooks(Array.isArray(data?.data?.books) ? data.data.books : []);
        setBookCount(data?.data?.bookCount ?? 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="w-full flex flex-col items-center justify-center mt-32 px-4 md:px-[120px]">
        <div className="w-full mx-auto">
          {/* Author Card */}
          <div className="flex justify-start mb-10">
            <div className="bg-white  rounded-2xl shadow-md flex items-center gap-6 px-6 py-6 w-full">
              {author?.profilePhoto ? (
                <img
                  src={author.profilePhoto}
                  alt={author.name}
                  className="w-20 h-20 rounded-full object-cover border border-gray-300"
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center border border-gray-300 bg-gray-100 text-primary-300 text-4xl font-bold"
                  style={{ fontFamily: "inherit" }}
                >
                  {getInitial(author?.name)}
                </div>
              )}
              <div>
                <div className="font-semibold text-lg md:text-2xl">{author?.name || "Author name"}</div>
                <div className="flex items-center gap-2 text-gray-700 text-md mt-2">
                  <img src="/icons/book.svg" alt="Book icon" width={20} height={20} />
                  <span>{bookCount} books</span>
                </div>
              </div>
            </div>
          </div>

          {/* Book List */}
          <h2 className="font-bold text-display-lg md:text-2xl mb-8 text-left">
            Book List
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-[118px]">
            {loading ? (
              <div className="col-span-full text-center text-gray-400">Loading...</div>
            ) : books.length === 0 ? (
              <div className="col-span-full text-center text-gray-400">No books found.</div>
            ) : (
              books.map((book) => <BookCard key={book.id} book={book} />)
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookByAuthor;