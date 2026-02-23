import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type Author = { id: number; name: string };
type Category = { id: number; name: string };
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
};

interface BookDetailProps {
  book: Book;
}

const getImageSrc = (book: Book) => {
  const url = book.coverImage;
  if (!url || url.trim() === "" || url.startsWith("blob:")) {
    return "/images/not-available.svg";
  }
  return url;
};

const BookDetail: React.FC<BookDetailProps> = ({ book }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.info("Please login to add books to your cart.");
      navigate("/login");
      return;
    }
    if (!book.id) {
      toast.error("Invalid book data.");
      return;
    }
    fetch(`https://library-backend-production-b9cf.up.railway.app/api/cart/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bookId: book.id }),
    })
      .then((res) =>
        res.json().then((data) => ({
          status: res.status,
          body: data,
        }))
      )
      .then(({ status, body }) => {
        if (
          status === 200 &&
          (body.success || body.message?.toLowerCase().includes("added"))
        ) {
          toast.success("Book added to cart!");
          navigate("/cart");
        } else if (body.message?.toLowerCase().includes("already in cart")) {
          toast.info("Book already in cart!");
          navigate("/cart");
        } else {
          toast.error(body.message || "Failed to add to cart.");
          console.error("Add to cart error:", body);
        }
      })
      .catch((err) => {
        toast.error("Failed to add to cart.");
        console.error("Fetch error:", err);
      });
  };

  const handleBorrowBook = () => {
    if (!isLoggedIn) {
      toast.info("Please login to borrow books.");
      navigate("/login");
      return;
    }
    fetch(`https://library-backend-production-b9cf.up.railway.app/api/loans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bookId: book.id, days: 7 }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success || data.message?.toLowerCase().includes("borrowed")) {
          toast.success("Book borrowed!");
        } else {
          toast.error(data.message || "Failed to borrow book.");
        }
      })
      .catch(() => {
        toast.error("Failed to borrow book.");
      });
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `Check out this book: ${book.title}`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.info("Link copied to clipboard!");
    }
  };

  return (
    <div className="relative bg-white p-0 mb-8">
      <div className="w-full pb-6">
        <div className="text-sm text-primary-300 font-semibold">
          <Link to="/" className="hover:underline">
            Home
          </Link>{" "}
          &gt;{" "}
          <Link
            to={`/category/${book.category.id}`}
            className="hover:underline"
          >
            {book.category.name}
          </Link>{" "}
          &gt;{" "}
          <span className="text-neutral-950 font-semibold">{book.title}</span>
        </div>
      </div>
      {/* Main Content: cover + detail */}
      <div className="flex flex-col md:flex-row gap-8 w-full px-0 pb-6">
        <div className="flex-shrink-0 flex justify-center md:items-stretch">
          <img
            src={getImageSrc(book)}
            alt={book.title}
            className="w-full h-auto max-w-[337px] md:max-w-[337px] md:h-[498px] object-cover mx-auto md:mx-0"
            style={{ width: "100%", maxWidth: 337, height: "auto", maxHeight: 498 }}
          />
        </div>
        <div className="flex-1 pt-8 md:pt-0 flex flex-col">
          <span className="border border-neutral-300 rounded-sm px-2 py-1 text-sm font-bold mb-2 inline-block self-start">
            {book.category.name}
          </span>
          <h2 className="text-2xl font-bold mb-1">{book.title}</h2>
          <div className="text-gray-700 mb-2">{book.author.name}</div>
          <div className="flex items-center gap-1 mb-2">
            <img
              src="/icons/star.svg"
              alt="Star"
              width={16}
              height={16}
              className="inline-block align-middle"
            />
            <span className="text-text-md font-bold">{book.rating}</span>
          </div>
          <div className="flex gap-0 mb-4 items-stretch">
            <div className="w-full max-w-[70px] md:max-w-[102px] text-left text-neutral-950 flex-shrink-0">
              <div className="font-bold text-display-xs">{book.totalCopies}</div>
              <div className="font-medium text-text-md">Copies</div>
            </div>
            <div className="w-[1px] bg-neutral-300 mx-5" />
            <div className="w-full max-w-[70px] md:max-w-[102px] text-left text-neutral-950 flex-shrink-0">
              <div className="font-bold text-display-xs">{book.availableCopies}</div>
              <div className="font-medium text-text-md">Available</div>
            </div>
            <div className="w-[1px] bg-neutral-300 mx-5" />
            <div className="w-full max-w-[70px] md:max-w-[102px] text-left text-neutral-950 flex-shrink-0">
              <div className="font-bold text-display-xs">{book.reviewCount}</div>
              <div className="font-medium text-text-md">Reviews</div>
            </div>
          </div>
          <div className="my-6 h-[1px] bg-neutral-300 w-full md:w-[559px]" />
          <div className="font-semibold mb-1">Description</div>
          <div className="text-gray-600 mb-4">{book.description}</div>
          <div className="flex gap-3">
            <button
              className="md:w-[200px] h-10 bg-gray-100 px-4 py-2 rounded-full border border-neutral-300 font-medium hover:bg-neutral-300"
              onClick={handleAddToCart}
              title={!isLoggedIn ? "Login to add to cart" : ""}
            >
              Add to Cart
            </button>
            <button
              className="md:w-[200px] h-10 bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700"
              onClick={handleBorrowBook}
              title={!isLoggedIn ? "Login to borrow book" : ""}
            >
              Borrow Book
            </button>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-neutral-300 hover:bg-neutral-300"
              style={{ width: 40, height: 40 }}
              aria-label="Share"
              onClick={handleShare}
            >
              <img src="/icons/share.svg" alt="Share" width={20} height={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;