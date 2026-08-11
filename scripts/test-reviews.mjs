import { fetchAllExternalReviews } from "../lib/reviews/fetch-reviews.ts";

const r = await fetchAllExternalReviews();
console.log("Total:", r.reviews.length);
console.log("Errors:", JSON.stringify(r.errors, null, 2));
for (const x of r.reviews.slice(0, 8)) {
  console.log(`[${x.source}] ${x.rating} ${x.author}: ${x.text.slice(0, 80)}...`);
}
