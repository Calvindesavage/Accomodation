"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Upload, X, Image as ImageIcon, Bed, Plus } from "lucide-react";
import { createListing, uploadListingImage, fetchMyResidences } from "@/lib/queries";
import { useAuth } from "@/lib/auth";

export default function NewListingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    residence: "",
    title: "",
    description: "",
    price: "",
    deposit: "",
    room_type: "single",
    availability: "available",
    available_from: "",
    is_featured: false,
    max_occupants: "1",
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]> | null>(null);

  const { data: residences, isLoading: loadingResidences } = useQuery({
    queryKey: ["myResidences"],
    queryFn: fetchMyResidences,
    enabled: user?.role === "LANDLORD",
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const listing = await createListing({
        residence: Number(formData.residence),
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        deposit: formData.deposit ? Number(formData.deposit) : 0,
        room_type: formData.room_type,
        availability: formData.availability,
        available_from: formData.available_from || undefined,
        is_featured: formData.is_featured,
        max_occupants: Number(formData.max_occupants) || 1,
      });
      if (imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          await uploadListingImage(listing.id, imageFiles[i], i === primaryImageIndex);
        }
      }
      return listing;
    },
    onSuccess: () => {
      router.push("/residences/manage");
    },
    onError: (error: any) => {
      const data = error?.response?.data;
      if (data && typeof data === "object") {
        setServerErrors(data);
      } else {
        setServerErrors({ non_field_errors: ["Something went wrong. Please try again."] });
      }
    },
  });

  if (user?.role !== "LANDLORD") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Access Denied</h1>
          <p className="mt-2 text-[rgba(255,255,255,0.45)]">Only landlords can add listings.</p>
        </div>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    if (primaryImageIndex === index && imageFiles.length > 1) {
      setPrimaryImageIndex(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerErrors(null);
    createMutation.mutate();
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Bed className="h-8 w-8 text-[#f97316]" />
            Add New Listing
          </h1>
          <p className="mt-2 text-[rgba(255,255,255,0.45)]">Create a room listing for one of your properties</p>
        </div>

        {!residences?.length && !loadingResidences && (
          <div className="rounded-xl p-6 text-center mb-6" style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.3)" }}>
            <p className="text-yellow-400 font-medium mb-2">You don&apos;t have any properties yet</p>
            <p className="text-yellow-500/70 text-sm mb-4">You need to add a property before creating a listing.</p>
            <button
              onClick={() => router.push("/residences/new")}
              className="dark-btn-primary inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Property First
            </button>
          </div>
        )}

        {serverErrors && (
          <div className="mb-6 rounded-lg p-4" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <h3 className="text-sm font-medium text-red-300 mb-2">Please fix the following errors:</h3>
            <ul className="list-disc list-inside text-sm text-red-400 space-y-1">
              {Object.entries(serverErrors).map(([field, value]) => {
                const msgs = Array.isArray(value) ? value : [String(value)];
                return msgs.map((err, i) => (
                  <li key={`${field}-${i}`}>
                    {field !== "non_field_errors" ? <strong>{field}:</strong> : null} {err}
                  </li>
                ));
              })}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="dark-card p-6 space-y-5">
            <h2 className="text-lg font-semibold text-white">Room Details</h2>

            <div>
              <label className="dark-label">Property</label>
              <select
                required
                value={formData.residence}
                onChange={(e) => setFormData({ ...formData, residence: e.target.value })}
                className="dark-input"
              >
                <option value="">Select a property</option>
                {residences?.map((r) => (
                  <option key={r.id} value={r.id}>{r.name} — {r.city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="dark-label">Listing Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="dark-input"
                placeholder="e.g. Single Room with En-suite"
              />
            </div>

            <div>
              <label className="dark-label">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="dark-input"
                placeholder="Describe the room..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="dark-label">Price (R/month)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="dark-input"
                  placeholder="3500"
                />
              </div>
              <div>
                <label className="dark-label">Deposit (R)</label>
                <input
                  type="number"
                  min={0}
                  value={formData.deposit}
                  onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                  className="dark-input"
                  placeholder="3500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="dark-label">Room Type</label>
                <select
                  value={formData.room_type}
                  onChange={(e) => setFormData({ ...formData, room_type: e.target.value })}
                  className="dark-input"
                >
                  <option value="single">Single Room</option>
                  <option value="shared">Shared Room</option>
                  <option value="bachelor">Bachelor</option>
                  <option value="ensuite">En-suite</option>
                </select>
              </div>
              <div>
                <label className="dark-label">Max Occupants</label>
                <input
                  type="number"
                  min={1}
                  value={formData.max_occupants}
                  onChange={(e) => setFormData({ ...formData, max_occupants: e.target.value })}
                  className="dark-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="dark-label">Availability</label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="dark-input"
                >
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="occupied">Occupied</option>
                </select>
              </div>
              <div>
                <label className="dark-label">Available From</label>
                <input
                  type="date"
                  value={formData.available_from}
                  onChange={(e) => setFormData({ ...formData, available_from: e.target.value })}
                  className="dark-input"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="h-4 w-4 rounded accent-[#f97316]"
              />
              <label htmlFor="is_featured" className="text-sm font-medium text-[rgba(255,255,255,0.6)]">Mark as Featured</label>
            </div>
          </div>

          {/* Room Images */}
          <div className="dark-card p-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-[#f97316]" />
              Room Images
            </h2>
            <div className="rounded-lg p-6" style={{ border: "2px dashed rgba(249,115,22,0.25)" }}>
              <div className="text-center mb-4">
                <ImageIcon className="mx-auto h-12 w-12 text-[rgba(255,255,255,0.2)]" />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="mt-4 text-[#f97316] hover:text-[#fb923c] font-medium"
                >
                  Upload images
                </button>
                <p className="text-sm text-[rgba(255,255,255,0.3)] mt-2">JPG, PNG up to 5MB each</p>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className={`w-full h-24 object-cover rounded-lg ${index === primaryImageIndex ? "ring-2 ring-[#f97316]" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {index === primaryImageIndex && (
                        <span className="absolute bottom-1 left-1 text-xs text-white px-2 py-0.5 rounded" style={{ background: "#f97316" }}>Primary</span>
                      )}
                      <button
                        type="button"
                        onClick={() => setPrimaryImageIndex(index)}
                        className="absolute bottom-1 right-1 text-xs text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.7)" }}
                      >
                        Set Primary
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="dark-btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || !formData.residence}
              className="dark-btn-primary flex items-center gap-2"
            >
              {createMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Create Listing
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
