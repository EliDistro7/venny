"use client";

import { useState, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AdminProperty, PropertyCategory, PropertyStatus, PropertyType } from "@/types/admin";
import { createProperty, updateProperty, ApiError } from "@/lib/adminApi";

interface PropertyFormProps {
  mode: "create" | "edit";
  property?: AdminProperty;
}

const CITIES = [
 
  "CBD",
  "Chamwino",
  "Kongwa",
  "Mpwapwa",
  "Bahi",
  "Chemba",
  "Kondoa"
];;
const CATEGORIES: PropertyCategory[] = ["apartment", "villa", "house", "land", "commercial"];

export default function PropertyForm({ mode, property }: PropertyFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(property?.title || "");
  const [location, setLocation] = useState(property?.location || "");
  const [city, setCity] = useState(property?.city || CITIES[0]);
  

  const [type, setType] = useState<PropertyType>(property?.type || "sale");
  const [category, setCategory] = useState<PropertyCategory>(property?.category || "house");
  const [bedrooms, setBedrooms] = useState(property?.bedrooms?.toString() || "0");
  const [bathrooms, setBathrooms] = useState(property?.bathrooms?.toString() || "0");
  const [area, setArea] = useState(property?.area?.toString() || "");
  const [status, setStatus] = useState<PropertyStatus>(property?.status || "delivered");
  const [featured, setFeatured] = useState(property?.featured || false);
  const [description, setDescription] = useState(property?.description || "");
  const [amenities, setAmenities] = useState(property?.amenities?.join(", ") || "");

  const [existingImages, setExistingImages] = useState(property?.images || []);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const [cityInput, setCityInput] = useState(property?.city || "");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);


  const filteredCities = CITIES.filter((c) =>
  c.toLowerCase().includes(cityInput.toLowerCase())
);

  function handleNewFiles(files: FileList | null) {
    if (!files) return;
    setNewFiles((prev) => [...prev, ...Array.from(files)]);
  }

  function removeNewFile(index: number) {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function removeExistingImage(url: string) {
    setExistingImages((prev) => prev.filter((u) => u !== url));
    setRemovedImages((prev) => [...prev, url]);
  }

  function isLand() {
    return category === "land";
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!title || !location || !area) {
      setError("Please fill in title, location, price and area.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("location", location);
    formData.append("city", city);
   
  
    formData.append("type", type);
    formData.append("category", category);
    formData.append("bedrooms", isLand() ? "0" : bedrooms);
    formData.append("bathrooms", isLand() ? "0" : bathrooms);
    formData.append("area", area);
    formData.append("status", status);
    formData.append("featured", String(featured));
    formData.append("description", description);
    formData.append(
      "amenities",
      JSON.stringify(
        amenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean)
      )
    );
    newFiles.forEach((file) => formData.append("images", file));
    if (mode === "edit" && removedImages.length) {
      formData.append("removeImages", JSON.stringify(removedImages));
    }

    setSaving(true);
    try {
      if (mode === "create") {
        await createProperty(formData);
      } else if (property) {
        await updateProperty(property._id, formData);
      }
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save this listing");
    } finally {
      setSaving(false);
    }
  }

  return (
    // Added px-4 sm:px-0 so the form isn't flush against the screen edge on mobile
    <form onSubmit={handleSubmit} className="max-w-3xl px-4 sm:px-0">
      {error && (
        <div className="bg-brick-red/10 border border-brick-red/30 text-brick-red font-body text-sm rounded-md px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <Section title="Basic info">
        <Field label="Title" full>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            placeholder="Luxury Penthouse in Chamwino"
          />
        </Field>
        <Field label="Location" full>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={inputClass}
            
          />
        </Field>
      <Field label="District">
  <div className="relative">
    <input
      value={cityInput}
      onChange={(e) => {
        setCityInput(e.target.value);
        setCity(e.target.value);
        setShowSuggestions(true);
      }}
      onFocus={() => setShowSuggestions(true)}
      onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
      className={inputClass}
      placeholder="Type or select a district"
      autoComplete="off"
    />
    {showSuggestions && filteredCities.length > 0 && (
      <ul className="absolute z-10 w-full mt-1 bg-white border border-stone-grey/30 rounded-md shadow-md max-h-48 overflow-y-auto">
        {filteredCities.map((c) => (
          <li
            key={c}
            onMouseDown={() => {
              setCityInput(c);
              setCity(c);
              setShowSuggestions(false);
            }}
            className="px-3 py-2 font-body text-sm text-charcoal-roof hover:bg-mist cursor-pointer"
          >
            {c}
          </li>
        ))}
      </ul>
    )}
  </div>
</Field>
        <Field label="Category">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as PropertyCategory)}
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </Field>
      </Section>

      <Section title="Pricing & specs">
        <Field label="Listing">
          {/* min-h-[44px] ensures both buttons meet the 44px touch-target minimum */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType("sale")}
              className={`flex-1 min-h-[44px] py-2.5 rounded-md font-body text-sm transition-colors ${
                type === "sale" ? "bg-brick-red text-white" : "bg-mist text-text-soft"
              }`}
            >
              For sale
            </button>
            <button
              type="button"
              onClick={() => setType("rent")}
              className={`flex-1 min-h-[44px] py-2.5 rounded-md font-body text-sm transition-colors ${
                type === "rent" ? "bg-brick-red text-white" : "bg-mist text-text-soft"
              }`}
            >
              For rent
            </button>
          </div>
        </Field>
        <Field label="Build status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PropertyStatus)}
            className={inputClass}
          >
            <option value="delivered">Delivered</option>
            <option value="work_in_progress">Work in progress</option>
          </select>
        </Field>
       
        <Field label="Area (sqm)">
          <input
            type="number"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className={inputClass}
            min={0}
          />
        </Field>
        {!isLand() && (
          <>
            <Field label="Bedrooms">
              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className={inputClass}
                min={0}
              />
            </Field>
            <Field label="Bathrooms">
              <input
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className={inputClass}
                min={0}
              />
            </Field>
          </>
        )}
        <Field label="Featured listing">
          <label className="flex items-center gap-2 mt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 accent-brick-red"
            />
            <span className="font-body text-sm text-text-soft">Show on homepage</span>
          </label>
        </Field>
      </Section>

      <Section title="Description & amenities">
        <Field label="Description" full>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
            rows={4}
          />
        </Field>
        <Field label="Amenities (comma-separated)" full>
          <input
            value={amenities}
            onChange={(e) => setAmenities(e.target.value)}
            className={inputClass}
            placeholder="Ocean View, Swimming Pool, 24/7 Security"
          />
        </Field>
      </Section>

      <Section title="Photos">
        <div className="col-span-2">
          {existingImages.length > 0 && (
            // w-20 h-20 on mobile (down from w-24 h-24) to fit more per row
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
              {existingImages.map((url) => (
                <div
                  key={url}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden border border-stone-grey/30"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(url)}
                    // Enlarged tap target: w-6 h-6 on mobile
                    className="absolute top-1 right-1 w-6 h-6 sm:w-5 sm:h-5 rounded-full bg-charcoal-roof/80 text-mist text-xs flex items-center justify-center"
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {newFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
              {newFiles.map((file, i) => (
                <div
                  key={i}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden border border-window-gold/60"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewFile(i)}
                    className="absolute top-1 right-1 w-6 h-6 sm:w-5 sm:h-5 rounded-full bg-charcoal-roof/80 text-mist text-xs flex items-center justify-center"
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleNewFiles(e.target.files)}
            className="hidden"
          />
          {/* Full-width on mobile so it's an easy tap target */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto font-body text-sm border border-stone-grey/40 text-text-soft px-4 py-3 sm:py-2.5 rounded-md hover:border-brick-red hover:text-brick-red transition-colors"
          >
            Add photos
          </button>
        </div>
      </Section>

      {/* Both action buttons full-width on mobile for easy tapping */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto font-body text-sm bg-brick-red text-white px-6 py-3 sm:py-2.5 rounded-md hover:bg-brick-red-dark transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : mode === "create" ? "Add property" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/dashboard")}
          className="w-full sm:w-auto font-body text-sm text-text-soft px-6 py-3 sm:py-2.5 rounded-md hover:bg-mist transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full bg-white border border-stone-grey/30 rounded-md px-3 py-2.5 font-body text-sm text-charcoal-roof focus:outline-none focus:border-brick-red transition-colors";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="font-display text-lg text-charcoal-roof mb-4 pb-2 border-b border-stone-grey/20">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
  full = false,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "col-span-1 sm:col-span-2" : ""}>
      <label className="block font-body text-xs uppercase tracking-wide text-text-soft/70 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}