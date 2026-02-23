import React from "react";

type Book = {
  id: number;
  title: string;
  coverImage: string;
  author: { name: string };
  rating: number;
};

interface RelatedBooksProps {
  books: Book[];
}

const RelatedBooks: React.FC<RelatedBooksProps> = ({ books }) => (
  <section className="mb-8">
    <h3 className="text-display-lg font-extrabold mb-2">Related Books</h3>
    <div className="flex flex-wrap gap-4">
      {books.map((book) => (
        <div key={book.id} className="bg-white rounded-lg w-36 p-3 shadow flex flex-col items-center">
          <img src={book.coverImage} alt={book.title} className="w-24 h-32 object-cover rounded mb-2" />
          <div className="font-semibold text-sm text-center mb-1">{book.title}</div>
          <div className="text-xs text-gray-500 mb-1">{book.author.name}</div>
          <div className="text-yellow-500 text-xs">★ {book.rating}</div>
        </div>
      ))}
    </div>
  </section>
);

export default RelatedBooks;