import React from "react";

type Review = {
  id: number;
  star: number;
  comment: string;
  createdAt: string;
  user: { id: number; name: string };
};

interface ReviewListProps {
  reviews: Review[];
}

const getInitial = (name: string | undefined) => {
  if (!name) return "??";
  const words = name.trim().split(" ");
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => (
  <section className="mb-8">
    <h3 className="text-4xl font-extrabold mb-2">Review</h3>
    <div className="flex items-center gap-2 mb-4">
      <img
        src="/icons/star.svg"
        alt="Star"
        width={20}
        height={20}
        className="inline-block align-middle"
      />
      <span className="text-text-xl font-extrabold">
        {reviews.length > 0
          ? (
              reviews.reduce((acc, r) => acc + r.star, 0) / reviews.length
            ).toFixed(1)
          : "0.0"}
      </span>
      <span className="text-text-xl font-extrabold">
        ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
      </span>
    </div>
    <div className="grid md:grid-cols-2 gap-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-gray-50 rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-3xl">
              {getInitial(review.user.name)}
            </div>
            <div>
              <div className="text-text-lg font-extrabold text-neutral-950">{review.user.name}</div>
              <div className="text-text-md font-medium text-neutral-950">
                {new Date(review.createdAt).toLocaleDateString()}{" "}
                {new Date(review.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
          <div className="flex gap-1 mb-1">
            {Array.from({ length: 5 }).map((_, idx) =>
              idx < review.star ? (
                <img
                  key={idx}
                  src="/icons/star.svg"
                  alt="Star"
                  width={20}
                  height={20}
                  className="inline-block"
                />
              ) : (
                <img
                  key={idx}
                  src="/icons/star-f.svg"
                  alt="Star empty"
                  width={20}
                  height={20}
                  className="inline-block"
                />
              )
            )}
          </div>
          <div className="text-neutral-950 font-semibold text-text-md">{review.comment}</div>
        </div>
      ))}
    </div>
  </section>
);

export default ReviewList;