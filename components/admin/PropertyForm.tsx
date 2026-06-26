"use client";

import { useState, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AdminProperty, PropertyCategory, PropertyStatus, PropertyType } from "@/types/admin";
import { createProperty, updateProperty, ApiError, getPresignedUrls, uploadToR2Direct } from "@/lib/adminApi";

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
  "Kondoa",
];

const CATEGORIES: PropertyCategory[] = ["apartment", "villa", "house", "land", "commercial"];

type AvailabilityType = "available" | "sold" | "rented" | "reserved";

// Pair a File with its base64 preview so thumbnails render
// immediately on pick — no waiting for a re-render to flush.
interface StagedFile {
  file: File;
  preview: string; // base64 data URL
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export default function PropertyForm({ mode, property }: PropertyFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(property?.title || "");
  const [location, setLocation] = useState(property?.location || "");
  const [cityInput, setCityInput] = useState(property?.city || "");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [type, setType] = useState<PropertyType>(property?.type || "sale");
  const [category, setCategory] = useState<PropertyCategory>(property?.category || "house");
  const [bedrooms, setBedrooms] = useState(property?.bedrooms?.toString() || "0");
  const [bathrooms, setBathrooms] = useState(property?.bathrooms?.toString() || "0");
  const [area, setArea] = useState(property?.area?.toString() || "");
  const [status, setStatus] = useState<PropertyStatus>(property?.status || "delivered");
  const [availability, setAvailability] = useState<AvailabilityType>(
    (property?.availability as AvailabilityType) || "available"
  );
  const [featured, setFeatured] = useState(property?.featured || false);
  const [description, setDescription] = useState(property?.description || "");
  const [amenities, setAmenities] = useState(property?.amenities?.join(", ") || "");

  // Images
  const [existingImages, setExistingImages] = useState(property?.images || []);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<StagedFile[]>([]);

  // Videos
  const [existingVideos, setExistingVideos] = useState<string[]>(property?.videos || []);
  const [removedVideos, setRemovedVideos] = useState<string[]>([]);
  const [newVideos, setNewVideos] = useState<StagedFile[]>([]);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [progressLabel, setProgressLabel] = useState("Uploading files…");

  // Stable IDs for the hidden file inputs — never change so label clicking
  // always works regardless of re-renders
  const imageInputId = useRef(`img-input-${Math.random().toString(36).slice(2)}`);
  const videoInputId = useRef(`vid-input-${Math.random().toString(36).slice(2)}`);

  const filteredCities = CITIES.filter((c) =>
    c.toLowerCase().includes(cityInput.toLowerCase())
  );

  function isLand() {
    return category === "land";
  }

  // ── Image handlers ──────────────────────────────────────────────
  async function handleImagePick(files: FileList | null) {
    if (!files || files.length === 0) return;
    const staged = await Promise.all(
      Array.from(files).map(async (file) => ({
        file,
        preview: await readAsDataURL(file),
      }))
    );
    setNewImages((prev) => [...prev, ...staged]);
  }

  function removeNewImage(index: number) {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  }
  function removeExistingImage(url: string) {
    setExistingImages((prev) => prev.filter((u) => u !== url));
    setRemovedImages((prev) => [...prev, url]);
  }

  // ── Video handlers ───────────────────────────────────────────────
  async function handleVideoPick(files: FileList | null) {
    if (!files || files.length === 0) return;
    const staged = await Promise.all(
      Array.from(files).map(async (file) => ({
        file,
        preview: await readAsDataURL(file),
      }))
    );
    setNewVideos((prev) => [...prev, ...staged]);
  }

  function removeNewVideo(index: number) {
    setNewVideos((prev) => prev.filter((_, i) => i !== index));
  }
  function removeExistingVideo(url: string) {
    setExistingVideos((prev) => prev.filter((u) => u !== url));
    setRemovedVideos((prev) => [...prev, url]);
  }

  // ── Submit ───────────────────────────────────────────────────────
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!title || !location || !area) {
      setError("Please fill in title, location, and area.");
      return;
    }

    setSaving(true);
    setUploadProgress(0);

    try {
      const imageFiles = newImages.map((s) => s.file);
      const videoFiles = newVideos.map((s) => s.file);
      const allFiles = [...imageFiles, ...videoFiles];

      let uploadedImageUrls: string[] = [];
      let uploadedVideoUrls: string[] = [];

      if (allFiles.length > 0) {
        setProgressLabel("Preparing upload…");

        const allRequests = [
          ...imageFiles.map((f) => ({ name: f.name, type: f.type, category: "image" as const })),
          ...videoFiles.map((f) => ({ name: f.name, type: f.type, category: "video" as const })),
        ];

        const presigned = await getPresignedUrls(allRequests);
        const totalSize = allFiles.reduce((s, f) => s + f.size, 0);
        let bytesUploaded = 0;

        for (let i = 0; i < allFiles.length; i++) {
          const file = allFiles[i];
          const fileStart = bytesUploaded;

          setProgressLabel(
            `Uploading ${i + 1} of ${allFiles.length}: ${file.name.slice(0, 30)}…`
          );

          await uploadToR2Direct(presigned[i].url, file, (filePct) => {
            const bytesThisFile = (filePct / 100) * file.size;
            const overall = Math.round(((fileStart + bytesThisFile) / totalSize) * 92);
            setUploadProgress(overall);
          });

          bytesUploaded += file.size;
        }

        uploadedImageUrls = presigned.slice(0, imageFiles.length).map((r) => r.publicUrl);
        uploadedVideoUrls = presigned.slice(imageFiles.length).map((r) => r.publicUrl);
      }

      setProgressLabel("Saving listing…");
      setUploadProgress(95);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("location", location);
      formData.append("city", cityInput);
      formData.append("type", type);
      formData.append("category", category);
      formData.append("bedrooms", isLand() ? "0" : bedrooms);
      formData.append("bathrooms", isLand() ? "0" : bathrooms);
      formData.append("area", area);
      formData.append("status", status);
      formData.append("availability", availability);
      formData.append("featured", String(featured));
      formData.append("description", description);
      formData.append("amenities", JSON.stringify(
        amenities.split(",").map((a) => a.trim()).filter(Boolean)
      ));
      formData.append("imageUrls", JSON.stringify([...existingImages, ...uploadedImageUrls]));
      formData.append("videoUrls", JSON.stringify([...existingVideos, ...uploadedVideoUrls]));

      if (mode === "edit") {
        if (removedImages.length) formData.append("removeImages", JSON.stringify(removedImages));
        if (removedVideos.length) formData.append("removeVideos", JSON.stringify(removedVideos));
      }

      if (mode === "create") await createProperty(formData);
      else if (property) await updateProperty(property._id, formData);

      setUploadProgress(100);
      setProgressLabel("Done!");
      await new Promise((r) => setTimeout(r, 400));

      // router.refresh() clears the Next.js client cache so the dashboard
      // reflects the new property, then push navigates there.
      router.refresh();
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save this listing");
      setUploadProgress(null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/* ── Hidden file inputs outside <form> ───────────────────────
          Triggered via <label htmlFor> — no .click() calls, no refs,
          no synthetic event chain. Browser opens picker natively.    */}
      <input
        id={imageInputId.current}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleImagePick(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        id={videoInputId.current}
        type="file"
        accept="video/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleVideoPick(e.target.files);
          e.target.value = "";
        }}
      />

      <form onSubmit={handleSubmit} className="max-w-3xl px-4 sm:px-0">
        {error && (
          <div className="bg-brick-red/10 border border-brick-red/30 text-brick-red font-body text-sm rounded-md px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {/* ── Basic info ─────────────────────────────────────────── */}
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

        {/* ── Pricing & specs ────────────────────────────────────── */}
        <Section title="Pricing & specs">
          <Field label="Listing">
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
              <option value="finished">Finished</option>
              <option value="work_in_progress">Work in progress</option>
            </select>
          </Field>

          <Field label="Availability">
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value as AvailabilityType)}
              className={inputClass}
            >
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
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

        {/* ── Description & amenities ────────────────────────────── */}
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

        {/* ── Photos ─────────────────────────────────────────────── */}
        <Section title="Photos">
          <div className="col-span-2">
            {existingImages.length > 0 && (
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
                      className="absolute top-1 right-1 w-6 h-6 sm:w-5 sm:h-5 rounded-full bg-charcoal-roof/80 text-mist text-xs flex items-center justify-center"
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {newImages.length > 0 && (
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
                {newImages.map((staged, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden border border-window-gold/60"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={staged.preview} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 sm:w-5 sm:h-5 rounded-full bg-charcoal-roof/80 text-mist text-xs flex items-center justify-center"
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* label triggers the file input natively — always works */}
            <label
              htmlFor={imageInputId.current}
              className="inline-block w-full sm:w-auto font-body text-sm border border-stone-grey/40 text-text-soft px-4 py-3 sm:py-2.5 rounded-md hover:border-brick-red hover:text-brick-red transition-colors cursor-pointer text-center"
            >
              Add photos
            </label>
          </div>
        </Section>

        {/* ── Videos ─────────────────────────────────────────────── */}
        <Section title="Videos">
          <div className="col-span-2">
            {existingVideos.length > 0 && (
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
                {existingVideos.map((url) => (
                  <div
                    key={url}
                    className="relative w-32 h-20 sm:w-40 sm:h-24 rounded-md overflow-hidden border border-stone-grey/30 bg-charcoal-roof/5"
                  >
                    <video src={url} className="w-full h-full object-cover" muted preload="metadata" />
                    <button
                      type="button"
                      onClick={() => removeExistingVideo(url)}
                      className="absolute top-1 right-1 w-6 h-6 sm:w-5 sm:h-5 rounded-full bg-charcoal-roof/80 text-mist text-xs flex items-center justify-center"
                      aria-label="Remove video"
                    >
                      ×
                    </button>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-8 h-8 rounded-full bg-charcoal-roof/50 flex items-center justify-center">
                        <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                          <path d="M1 1l10 6-10 6V1z" fill="#F2C94C" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {newVideos.length > 0 && (
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
                {newVideos.map((staged, i) => (
                  <div
                    key={i}
                    className="relative w-32 h-20 sm:w-40 sm:h-24 rounded-md overflow-hidden border border-window-gold/60 bg-charcoal-roof/5"
                  >
                    {/* Video preview via base64 — renders immediately without
                        waiting for a re-render to flush object URLs */}
                    <video
                      src={staged.preview}
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewVideo(i)}
                      className="absolute top-1 right-1 w-6 h-6 sm:w-5 sm:h-5 rounded-full bg-charcoal-roof/80 text-mist text-xs flex items-center justify-center"
                      aria-label="Remove video"
                    >
                      ×
                    </button>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-8 h-8 rounded-full bg-charcoal-roof/50 flex items-center justify-center">
                        <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                          <path d="M1 1l10 6-10 6V1z" fill="#F2C94C" />
                        </svg>
                      </div>
                    </div>
                    <span className="absolute bottom-1 left-2 font-body text-xs text-mist/80 truncate max-w-[80%]">
                      {staged.file.name}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <label
              htmlFor={videoInputId.current}
              className="inline-block w-full sm:w-auto font-body text-sm border border-stone-grey/40 text-text-soft px-4 py-3 sm:py-2.5 rounded-md hover:border-brick-red hover:text-brick-red transition-colors cursor-pointer text-center"
            >
              Add videos
            </label>
          </div>
        </Section>

        {/* ── Upload progress ────────────────────────────────────── */}
        {saving && uploadProgress !== null && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-body text-xs text-text-soft">{progressLabel}</span>
              <span className="font-body text-xs text-charcoal-roof tabular-nums">
                {uploadProgress}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-stone-grey/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-brick-red rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            {uploadProgress === 100 && (
              <p className="font-body text-xs text-text-soft mt-1.5">Saving listing details…</p>
            )}
          </div>
        )}

        {/* ── Actions ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto font-body text-sm bg-brick-red text-white px-6 py-3 sm:py-2.5 rounded-md hover:bg-brick-red-dark transition-colors disabled:opacity-50"
          >
            {saving
              ? uploadProgress !== null && uploadProgress < 100
                ? "Uploading…"
                : "Saving…"
              : mode === "create"
              ? "Add property"
              : "Save changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/dashboard")}
            disabled={saving}
            className="w-full sm:w-auto font-body text-sm text-text-soft px-6 py-3 sm:py-2.5 rounded-md hover:bg-mist transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
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