import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CartItem from "../components/CartItem";

type Author = { id: number; name: string };
type Category = { id: number; name: string };
type Book = {
  id: number;
  title: string;
  coverImage: string;
  author: Author;
  category: Category;
};
type CartItemType = {
  id: number;
  bookId: number;
  book: Book;
};

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  // Fetch cart items
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://library-backend-production-b9cf.up.railway.app/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setCartItems(data.data.items || []);
      });
  }, []);

  const handleSelect = (itemId: number) => {
    setSelected((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selected.length === cartItems.length) {
      setSelected([]);
    } else {
      setSelected(cartItems.map((item) => item.id));
    }
  };

  const handleBorrow = () => {
    if (selected.length === 0) {
      alert("Please select at least one book to borrow.");
      return;
    }
    const token = localStorage.getItem("token");
    fetch("https://library-backend-production-b9cf.up.railway.app/api/loans/from-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        itemIds: selected,
        days: 7,
        borrowDate: new Date().toISOString().slice(0, 10),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || "Borrowed successfully!");
        window.location.reload();
      });
  };

  const [showShadow, setShowShadow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowShadow(window.scrollY > 0);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 w-full flex flex-col items-start md:items-center px-0 md:px-0">
        <div className="w-full md:max-w-[1000px] mx-0 md:mx-auto px-0 md:px-0 pt-20 md:pt-32 mb-[100px]">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Book List & Select All */}
            <div className="flex-1 bg-white p-4 md:p-0">
              <h2 className="text-2xl font-bold mb-4">My Cart</h2>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={selected.length === cartItems.length && cartItems.length > 0}
                  onChange={handleSelectAll}
                  className="mr-2"
                />
                <span className="font-medium">Select All</span>
              </div>
              <div>
                {cartItems.length === 0 ? (
                  <div className="text-gray-400 text-center py-8">Your cart is empty.</div>
                ) : (
                  cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      checked={selected.includes(item.id)}
                      onChange={handleSelect}
                    />
                  ))
                )}
              </div>
            </div>
            {/* Loan Summary (Desktop only) */}
            <div className="hidden md:block w-full max-w-[320px]">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-32">
                <div className="mb-2 text-gray-700 font-semibold text-lg">Loan Summary</div>
                <div className="mb-4 font-bold text-lg flex justify-between">
                  <span>Total Book</span>
                  <span>{selected.length} Items</span>
                </div>
                <button
                  className="w-full bg-blue-600 text-white py-2 rounded-full font-semibold hover:bg-blue-700 transition"
                  onClick={handleBorrow}
                  disabled={selected.length === 0}
                >
                  Borrow Book
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Floating menu for mobile */}
        <div
          className={`fixed bottom-0 left-0 w-full bg-white border-t z-50 md:hidden transition-shadow ${
            showShadow ? "shadow-[0_-6px_24px_rgba(0,0,0,0.20)]" : ""
          }`}
        >
          <div className="w-full max-w-[1000px] mx-auto px-4 py-3 flex justify-between items-center">
            <div>
              <span className="text-gray-700">Total Book</span>
              <span className="font-bold ml-2">{selected.length} Items</span>
            </div>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
              onClick={handleBorrow}
              disabled={selected.length === 0}
            >
              Borrow Book
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;