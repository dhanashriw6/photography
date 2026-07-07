// Client-side stub.
//
// The original landing page fetched live Google Place reviews through a
// TanStack Start server function (Lovable connector gateway). That backend
// does not exist in this app, so we expose a plain async function + a small
// React hook that returns an empty shape. Every consumer already handles the
// empty/null case gracefully (Hero shows placeholders, Testimonials falls
// back to the static `testimonials` list in @/data/site).
//
// To wire real data later, replace the body of getFilmFrameStudioRating with
// a call to your own API and keep the same return shape.
import { useEffect, useState } from "react";

// Static placeholder shown in the hero trust row. Replace `rating`/
// `userRatingCount`/`reviewers` with real values from your API when ready.
// `reviews` is left empty so Testimonials keeps using the curated static list
// in @/data/site.
const PLACEHOLDER = {
  rating: 4.9,
  userRatingCount: 1280,
  reviewers: [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  ].map((photo, i) => ({ name: `Reviewer ${i + 1}`, photo })),
  reviews: [],
  error: null,
};

export async function getFilmFrameStudioRating() {
  return PLACEHOLDER;
}

export function useFilmFrameStudioRating() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let active = true;
    getFilmFrameStudioRating().then((result) => {
      if (active) setData(result);
    });
    return () => {
      active = false;
    };
  }, []);

  return { data };
}
