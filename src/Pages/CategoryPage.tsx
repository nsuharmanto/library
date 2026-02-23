import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BookCard from "../components/BookCard";
import { Category } from '../types/Category';

type Book = {
  id: number;
  title: string;
  author: { id?: number; name: string };
  rating: number; 
  coverImage?: string;
};

const ratings = [5, 4, 3, 2, 1];

const categories = [
  { id: 1, name: 'Fiction' },
  { id: 2, name: 'Non-Fiction' },
  { id: 3, name: 'Self-Improvement' },
  { id: 4, name: 'Finance' },
  { id: 5, name: 'Science' },
  { id: 6, name: 'Education' },
];

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [books, setBooks] = useState<Book[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number>(Number(id));
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch category info
  useEffect(() => {
    fetch("https://library-backend-production-b9cf.up.railway.app/api/categories")
      .then((res) => res.json())
      .then((data) => {
        const found = data?.data?.categories?.find((cat: Category) => String(cat.id) === String(selectedCategory));
        setCategory(found || null);
      });
  }, [selectedCategory]);

  // Fetch books by category
  useEffect(() => {
    setLoading(true);
    let url = `https://library-backend-production-b9cf.up.railway.app/api/books?categoryId=${selectedCategory}&page=1&limit=12`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setBooks(Array.isArray(data?.data?.books) ? data.data.books : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedCategory]);

  // Handler for category (single select)
  const handleCategorySelect = (catId: number) => {
    setSelectedCategory(catId);
  };

  // Handler for rating (multi select)
  const handleRatingToggle = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };

  const filteredBooks = books.filter((book) => {
    if (selectedRatings.length === 0) return true;
    const bookRating = book.rating;
    if (selectedRatings.length === 1) {
      return Math.floor(bookRating) === selectedRatings[0];
    } else {
      const minRating = Math.min(...selectedRatings);
      const maxRating = Math.max(...selectedRatings);
      return bookRating >= minRating && bookRating <= maxRating;
    }
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="w-full flex flex-col items-center justify-center mt-24 px-4 md:px-[120px]">
        <h2 className="font-bold text-xl md:text-2xl mb-4 text-left w-full">
          Book List {category ? `- ${category.name}` : ""}
        </h2>

        {/* Filter Section */}
        <div className="w-full flex flex-col md:flex-row gap-4 mb-6">
          {/* Filter Card */}
          <div
            className="bg-white rounded-xl shadow-md p-4 w-full md:w-[240px] flex-shrink-0"
            style={{ height: "auto" }}
          >
            <div className="text-text-md font-extrabold mb-2">FILTER</div>
            {/* Category Filter */}
            <div className="mb-4">
              <div className="font-extrabold text-text-lg mb-2">Category</div>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <label className="flex items-center gap-2 cursor-pointer" key={cat.id}>
                    <input
                      type="radio"
                      name="category"
                      value={cat.id}
                      checked={selectedCategory === cat.id}
                      onChange={() => handleCategorySelect(cat.id)}
                      className="hidden"
                    />
                    <span
                      className={
                        "w-5 h-5 flex items-center justify-center rounded border border-gray-400 transition-colors duration-200 " +
                        (selectedCategory === cat.id ? "bg-blue-600 border-blue-600" : "bg-white")
                      }
                    >
                      {selectedCategory === cat.id && (
                        <svg width="14" height="14" viewBox="0 0 16 16">
                          <polyline
                            points="4 8 7 11 12 5"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="2"
                          />
                        </svg>
                      )}
                    </span>
                    <span className="text-text-md font-medium">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <hr className="-mx-4 w-[calc(100%+32px)] border-t border-neutral-300 my-6" />
            
            {/* Rating Filter */}
            <div className="mb-4">
              <div className="font-extrabold text-text-lg mb-2">Rating</div>
              <div className="flex flex-col gap-2">
                {ratings.map((r) => (
                  <label
                    key={r}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="rating"
                      value={r}
                      checked={selectedRatings.includes(r)}
                      onChange={() => handleRatingToggle(r)}
                      className="hidden"
                    />
                    <span
                      className={
                        "w-5 h-5 flex items-center justify-center rounded border border-gray-400 transition-colors duration-200 " +
                        (selectedRatings.includes(r) ? "bg-blue-600 border-blue-600" : "bg-white")
                      }
                    >
                      {selectedRatings.includes(r) && (
                        <svg width="14" height="14" viewBox="0 0 16 16">
                          <polyline
                            points="4 8 7 11 12 5"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="2"
                          />
                        </svg>
                      )}
                    </span>
                    <span className="flex items-center text-text-md font-normal">
                      <img src="/icons/star.svg" alt="star" width={18} height={18} className="inline-block align-middle mr-2" />
                      {r}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Book Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {loading ? (
                <div className="col-span-full text-center text-gray-400">Loading...</div>
              ) : filteredBooks.length === 0 ? (
                <div className="col-span-full text-center text-gray-400">No books found.</div>
              ) : (
                filteredBooks.map((book) => <BookCard key={book.id} book={book} />)
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;