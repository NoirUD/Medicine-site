import { AdminShell } from "@/components/admin/AdminShell";
import { ReviewsManager } from "@/components/admin/ReviewsManager";
import { getExternalReviews } from "@/lib/reviews/fetch-reviews";

export default async function AdminReviewsPage() {
  const cache = await getExternalReviews();

  return (
    <AdminShell title="Отзывы">
      <ReviewsManager initialCache={cache} />
    </AdminShell>
  );
}
