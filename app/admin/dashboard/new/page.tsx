import PropertyForm from "@/components/admin/PropertyForm";

export default function NewPropertyPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-charcoal-roof mb-1">Add property</h1>
      <p className="font-body text-sm text-text-soft mb-8">
        New listings appear on the public site immediately after saving.
      </p>
      <PropertyForm mode="create" />
    </div>
  );
}
