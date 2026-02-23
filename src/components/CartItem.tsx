import React from "react";

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

interface CartItemProps {
  item: CartItemType;
  checked: boolean;
  onChange: (itemId: number) => void;
}

const getImageSrc = (coverImage: string) => {
  if (!coverImage || coverImage.trim() === "" || coverImage.startsWith("blob:")) {
    return "/images/not-available.svg";
  }
  return coverImage;
};

const CartItem: React.FC<CartItemProps> = ({ item, checked, onChange }) => (
  <div className="w-full flex items-center border-b border-neutral-300 py-3 gap-3">
    <input
      type="checkbox"
      checked={checked}
      onChange={() => onChange(item.id)}
      className="mr-2 self-start"
    />
    <img
      src={getImageSrc(item.book.coverImage)}
      alt={item.book.title}
      width={92}
      height={138}
      className="w-[92px] h-[138px] object-cover"
    />
    <div className="flex-1">
      <span className="inline-block bg-gray-100 text-xs font-semibold rounded px-2 py-1 mb-1">
        {item.book.category?.name}
      </span>
      <div className="font-bold">{item.book.title}</div>
      <div className="text-gray-500 text-sm">{item.book.author?.name}</div>
    </div>
  </div>
);

export default CartItem;