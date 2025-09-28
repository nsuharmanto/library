import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import HeroCarousel from '../components/HeroCarousel';
import { Button } from '../components/ui/button';

// Tipe data buku sesuai API
type Book = {
  id: number;
  title: string;
  author: { id?: number; name: string };
  rating: number;
  coverImage?: string;
  img?: string;
  // Tambahkan field lain jika diperlukan
};

const categories = [
  { name: 'Fiction', icon: '/icons/fiction.svg' },
  { name: 'Non-Fiction', icon: '/icons/non_fiction.svg' },
  { name: 'Self-Improvement', icon: '/icons/self_improvement.svg' },
  { name: 'Finance', icon: '/icons/finance.svg' },
  { name: 'Science', icon: '/icons/science.svg' },
  { name: 'Education', icon: '/icons/education.svg' },
];

const authors = [
  { name: 'Author name', books: 5, img: 'https://i.imgur.com/author1.jpg' },
  { name: 'Author name', books: 5, img: 'https://i.imgur.com/author2.jpg' },
  { name: 'Author name', books: 5, img: 'https://i.imgur.com/author3.jpg' },
  { name: 'Author name', books: 5, img: 'https://i.imgur.com/author4.jpg' },
];

const LIMIT = 10;

const Home: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Fetch books with pagination
  useEffect(() => {
    setLoading(true);
    fetch(
      `https://belibraryformentee-production.up.railway.app/api/books?limit=${LIMIT}&page=${page}`,
    )
      .then((res) => res.json())
      .then((data) => {
        const books: Book[] = Array.isArray(data?.data?.books) ? data.data.books : [];
        if (page === 1) {
          setRecommendations(books);
        } else {
          // Hindari duplikasi jika API mengulang data
          setRecommendations((prev) => {
            const ids = new Set(prev.map((b) => b.id));
            const newBooks = books.filter((b) => !ids.has(b.id));
            return [...prev, ...newBooks];
          });
        }
        // Cek apakah masih ada data berikutnya
        const totalPages = data?.data?.pagination?.totalPages ?? 1;
        setHasMore(page < totalPages);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [page]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <Header />

      {/* Hero */}
      <section className="w-full flex flex-col items-center justify-center py-8 px-4 md:px-[120px]">
        <div className="w-full">
          <HeroCarousel />
        </div>
      </section>

      {/* Category Navigation */}
      <nav className="w-full px-4 md:px-[120px] mb-8">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className="flex flex-col items-center rounded-xl bg-white text-gray-950 font-semibold hover:text-blue-600 shadow hover:bg-stone-50 transition w-full"
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
          {recommendations.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-xl shadow flex flex-col"
              style={{
                padding: 'clamp(8px, 2vw, 16px)',
              }}
            >
              
              <div
                className="w-full rounded-lg overflow-hidden mb-2 bg-white"
                style={{
                  aspectRatio: '5/7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={book.coverImage || book.img || 'https://i.imgur.com/placeholder.png'}
                  alt={book.title}
                  className="w-full h-full object-content"
                  style={{
                    background: '#fff',
                    borderRadius: '12px',
                    transition: 'box-shadow 0.2s',
                  }}
                />
              </div>
              <div className="flex flex-col gap-1 px-0">
                <span
                  className="font-semibold"
                  style={{
                    fontSize: 'clamp(0.85rem, 1vw, 1.1rem)',
                    lineHeight: 1.2,
                    marginBottom: '2px',
                  }}
                >
                  {book.title}
                </span>
                <span className="text-xs text-gray-500">{book.author?.name}</span>
                <span className="flex items-center gap-1 text-accent-yellow text-xs">
                  ★ {book.rating}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <Button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading || !hasMore}
            variant="outline"
            className={`h-12 px-8 rounded-full font-bold text-md shadow-none border border-[#E5E7EB] bg-white
      ${loading || !hasMore ? 'text-gray-700 border-[#E5E7EB] bg-[#F3F4F6] cursor-not-allowed' : 'text-gray-900 hover:bg-gray-100'}
    `}
            style={{ minWidth: 180 }}
          >
            {loading ? 'Loading...' : hasMore ? 'Load More' : 'No More Data'}
          </Button>
        </div>
      </section>

      {/* Popular Authors */}
      <section
        className="mb-8"
        style={{
          paddingLeft: 'clamp(16px, 8vw, 120px)',
          paddingRight: 'clamp(16px, 8vw, 120px)',
        }}
      >
        <h2
          className="font-bold text-xl md:text-2xl mb-4"
          style={{ fontSize: 'clamp(1.25rem, 2vw, 2rem)' }}
        >
          Popular Authors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {authors.map((author, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-white rounded-xl shadow p-3">
              <img
                src={author.img}
                alt={author.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold">{author.name}</div>
                <div className="text-xs text-gray-500">{author.books} books</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="bg-white border-t py-8 mt-auto"
        style={{
          paddingLeft: 'clamp(16px, 8vw, 120px)',
          paddingRight: 'clamp(16px, 8vw, 120px)',
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-bold text-blue-700 text-xl">Booky</span>
          <p className="text-center text-gray-500 text-sm max-w-xl">
            Discover inspiring stories & timeless knowledge, ready to borrow anytime. Explore online
            or visit our nearest library branch.
          </p>
          <div className="flex gap-4 mt-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <img src="https://i.imgur.com/instagram.png" alt="Instagram" className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <img src="https://i.imgur.com/linkedin.png" alt="LinkedIn" className="w-6 h-6" />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <img src="https://i.imgur.com/tiktok.png" alt="TikTok" className="w-6 h-6" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
