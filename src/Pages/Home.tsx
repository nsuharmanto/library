import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import HeroCarousel from '../components/HeroCarousel';
import { Button } from '../components/ui/button';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import { useNavigate } from 'react-router-dom';

type Book = {
  id: number;
  title: string;
  author: { id?: number; name: string };
  rating: number;
  coverImage?: string;
  img?: string;
};

type Author = {
  id: number;
  name: string;
  bio?: string;
  bookCount: number;
  accumulatedScore?: number;
  profilePhoto?: string; 
};

const categories = [
  { id: 1, name: 'Fiction', icon: '/icons/fiction.svg' },
  { id: 2, name: 'Non-Fiction', icon: '/icons/non_fiction.svg' },
  { id: 3, name: 'Self-Improvement', icon: '/icons/self_improvement.svg' },
  { id: 4, name: 'Finance', icon: '/icons/finance.svg' },
  { id: 5, name: 'Science', icon: '/icons/science.svg' },
  { id: 6, name: 'Education', icon: '/icons/education.svg' },
];

const getInitial = (name: string | undefined) => {
  if (!name) return "??";
  const words = name.trim().split(" ");
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

const Home: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [authors, setAuthors] = useState<Author[]>([]);
  const navigate = useNavigate();

  // Fetch books with pagination
  useEffect(() => {
    setLoading(true);
    fetch(
      `https://library-backend-production-b9cf.up.railway.app/api/books/recommend?by=rating&page=${page}&limit=8`
    )
      .then((res) => res.json())
      .then((data) => {
        const books: Book[] = Array.isArray(data?.data?.books) ? data.data.books : [];
        if (page === 1) {
          setRecommendations(books);
        } else {
          setRecommendations((prev) => {
            const ids = new Set(prev.map((b) => b.id));
            const newBooks = books.filter((b) => !ids.has(b.id));
            return [...prev, ...newBooks];
          });
        }
        const totalPages = data?.data?.pagination?.totalPages ?? 1;
        setHasMore(page < totalPages);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [page]);

  // Fetch popular authors
  useEffect(() => {
    fetch(
      'https://library-backend-production-b9cf.up.railway.app/api/authors/popular?limit=10'
    )
      .then((res) => res.json())
      .then((data) => {
        setAuthors(Array.isArray(data?.data?.authors) ? data.data.authors : []);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <Header />

      {/* Hero */}
      <section className="w-full flex flex-col items-center justify-center mt-24 py-8 px-4 md:px-[120px]">
        <div className="w-full">
          <HeroCarousel />
        </div>
      </section>

      {/* Category Navigation */}
      <nav className="w-full px-4 md:px-[120px] mb-8">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="flex flex-col items-center rounded-xl bg-white text-text-md text-gray-950 font-semibold hover:text-blue-600 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 w-full"
              onClick={() => navigate(`/category/${cat.id}`)}
            >
              <div className="flex items-center justify-center w-full">
                <img
                  src={cat.icon}
                  alt={cat.name + ' icon'}
                  className="w-full"
                  style={{
                    maxHeight: 'clamp(34px, 8vw, 72px)',
                    marginLeft: '12px',
                    marginRight: '12px',
                    marginTop: '12px',
                    marginBottom: '12px',
                    objectFit: 'contain',
                  }}
                />
              </div>
              <span className="text-sm md:text-md mt-3 mb-3 w-full text-left self-start pl-3">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Recommendation */}
      <section className="px-4 md:px-[120px] mb-8">
        <h2
          className="font-bold text-xl md:text-2xl mb-4"
          style={{ fontSize: 'clamp(1.25rem, 2vw, 2rem)' }}
        >
          Recommendation
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {recommendations.length === 0 ? (
            <div className="col-span-full text-center text-gray-400">No books found.</div>
          ) : (
            recommendations.map((book) => (
              <BookCard key={book.id} book={book} />
            ))
          )}
        </div>
        <div className="flex justify-center mt-10">
          <Button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading || !hasMore}
            variant="outline"
            className={`h-[48px] px-8 rounded-full font-bold text-text-md shadow-none border border-gray-400 bg-white
              ${loading || !hasMore ? 'text-gray-800 border-gray-400 bg-[#F3F4F6] cursor-not-allowed' : 'text-gray-950 hover:bg-gray-100'}
            `}
            style={{ minWidth: 180 }}
          >
            {loading ? 'Loading...' : hasMore ? 'Load More' : 'No More Data'}
          </Button>
        </div>
      </section>

      {/* Popular Authors */}
      <section className="mb-8 px-4 md:px-[120px]">
        <h2
          className="font-bold text-xl md:text-2xl mb-4"
          style={{ fontSize: 'clamp(1.25rem, 2vw, 2rem)' }}
        >
          Popular Authors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {authors.length === 0 ? (
            <div className="col-span-full text-center text-gray-400">No authors found.</div>
          ) : (
            authors.map((author) => (
              <div
                key={author.id}
                className="flex items-center gap-3 bg-white rounded-xl shadow-md p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                onClick={() => navigate(`/author/${author.id}`)}
              >
                <div className="w-12 h-12 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-xl font-bold text-primary-300 overflow-hidden">
                  {author.profilePhoto ? (
                    <img
                      src={author.profilePhoto}
                      alt={author.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    getInitial(author.name)
                  )}
                </div>
                <div>
                  <div className="font-semibold">{author.name}</div>
                  <div className="text-text-md h-[30px] text-gray-950">
                    <img src="/icons/book.svg" alt="Book icon" width={24} height={24} className="inline-block" />
                    <span className="ml-1">{author.bookCount} books</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;