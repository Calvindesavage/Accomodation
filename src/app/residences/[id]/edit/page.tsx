"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Upload, X, Video, Image as ImageIcon, MapPin, Home, Loader2 } from "lucide-react";
import { fetchResidence, updateResidence, uploadResidenceImage, fetchAmenities } from "@/lib/queries";
import { useAuth } from "@/lib/auth";

export default function EditResidencePage() {
  const router = useRouter();
  const params = useParams();
  const residenceId = Number(params.id);
  const { user } = useAuth();
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    latitude: "",
    longitude: "",
    rules: "",
    amenity_ids: [] as number[],
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]> | null>(null);
  const [loaded, setLoaded] = useState(false);

  const { data: residence, isLoading } = useQuery({
    queryKey: ["residence", residenceId],
    queryFn: () => fetchResidence(residenceId),
    enabled: !!residenceId,
  });

  const { data: amenities } = useQuery({
    queryKey: ["amenities"],
    queryFn: fetchAmenities,
  });

  useEffect(() => {
    if (residence && !loaded) {
      setFormData({
        name: residence.name || "",
        description: residence.description || "",
        address: residence.address || "",
        city: residence.city || "",
        province: residence.province || "",
        postal_code: residence.postal_code || "",
        latitude: residence.latitude ? String(residence.latitude) : "",
        longitude: residence.longitude ? String(residence.longitude) : "",
        rules: "",
        amenity_ids: residence.amenities?.map((a) => a.id) || [],
      });
      if (residence.virtual_tour_video) {
        setVideoPreview(residence.virtual_tour_video);
      }
      setLoaded(true);
    }
  }, [residence, loaded]);

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const updated = await updateResidence(residenceId, data);
      if (newImageFiles.length > 0) {
        for (let i = 0; i < newImageFiles.length; i++) {
          await uploadResidenceImage(updated.id, newImageFiles[i], i === 0 && !residence?.images?.length);
        }
      }
      return updated;
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
          <p className="mt-2 text-[rgba(255,255,255,0.45)]">Only landlords can edit properties.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
      </div>
    );
  }

  if (!residence) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Property Not Found</h1>
          <p className="mt-2 text-[rgba(255,255,255,0.45)]">This property does not exist or you don&apos;t have access.</p>
        </div>
      </div>
    );
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        alert("Video file must be less than 100MB");
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((f) => URL.createObjectURL(f));
    setNewImageFiles((prev) => [...prev, ...files]);
    setNewImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      amenity_ids: prev.amenity_ids.includes(id)
        ? prev.amenity_ids.filter((a) => a !== id)
        : [...prev.amenity_ids, id],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerErrors(null);

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("description", formData.description);
    submitData.append("address", formData.address);
    submitData.append("city", formData.city);
    submitData.append("province", formData.province);
    submitData.append("postal_code", formData.postal_code);
    if (formData.latitude) submitData.append("latitude", formData.latitude);
    if (formData.longitude) submitData.append("longitude", formData.longitude);
    submitData.append("rules", formData.rules);
    formData.amenity_ids.forEach((id) => submitData.append("amenity_ids", String(id)));
    if (videoFile) submitData.append("virtual_tour_video", videoFile);

    updateMutation.mutate(submitData);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Home className="h-8 w-8 text-[#f97316]" />
            Edit Property
          </h1>
          <p className="mt-2 text-[rgba(255,255,255,0.45)]">Update details for {residence.name}</p>
        </div>

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
          {/* Property Information */}
          <div className="dark-card p-6 space-y-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Home className="w-5 h-5 text-[#f97316]" />
              Property Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="dark-label">Property Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="dark-input mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <label className="dark-label">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="dark-input mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <label className="dark-label">Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="dark-input mt-1"
                />
              </div>

              <div>
                <label className="dark-label">City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="dark-input mt-1"
                />
              </div>

              <div>
                <label className="dark-label">Province</label>
                <input
                  type="text"
                  required
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="dark-input mt-1"
                />
              </div>

              <div>
                <label className="dark-label">Postal Code</label>
                <input
                  type="text"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  className="dark-input mt-1"
                />
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#f97316]" />
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="any"
                    placeholder="Latitude"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    className="dark-input"
                  />
                  <input
                    type="number"
                    step="any"
                    placeholder="Longitude"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    className="dark-input"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="dark-label">House Rules</label>
                <textarea
                  rows={3}
                  value={formData.rules}
                  onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                  className="dark-input mt-1"
                  placeholder="Any rules tenants should know about..."
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="dark-card p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {amenities?.map((amenity) => (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => toggleAmenity(amenity.id)}
                  className="p-3 rounded-lg text-left transition-colors"
                  style={{
                    border: `1.5px solid ${formData.amenity_ids.includes(amenity.id) ? "#f97316" : "rgba(249,115,22,0.15)"}`,
                    background: formData.amenity_ids.includes(amenity.id) ? "rgba(249,115,22,0.1)" : "transparent",
                  }}
                >
                  <span className={`text-sm font-medium ${formData.amenity_ids.includes(amenity.id) ? "text-[#f97316]" : "text-[rgba(255,255,255,0.7)]"}`}>
                    {amenity.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Existing Images */}
          {residence.images && residence.images.length > 0 && (
            <div className="dark-card p-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <ImageIcon className="w-5 h-5 text-[#f97316]" />
                Current Images
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {residence.images.map((img) => (
                  <div key={img.id} className="relative">
                    <img
                      src={img.image}
                      alt="Property"
                      className={`w-full h-24 object-cover rounded-lg ${img.is_primary ? "ring-2 ring-[#f97316]" : ""}`}
                    />
                    {img.is_primary && (
                      <span className="absolute bottom-1 left-1 text-xs text-white px-2 py-0.5 rounded" style={{ background: "#f97316" }}>
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload New Images */}
          <div className="dark-card p-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-[#f97316]" />
              Add More Images
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
              {newImagePreviews.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {newImagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`New ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Virtual Tour */}
          <div className="dark-card p-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
              <Video className="w-5 h-5 text-[#f97316]" />
              Virtual Tour Video
            </h2>
            <div className="rounded-lg p-6" style={{ border: "2px dashed rgba(249,115,22,0.25)" }}>
              {!videoPreview ? (
                <div className="text-center">
                  <Video className="mx-auto h-12 w-12 text-[rgba(255,255,255,0.2)]" />
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="mt-4 text-[#f97316] hover:text-[#fb923c] font-medium"
                  >
                    Upload a video
                  </button>
                  <p className="text-sm text-[rgba(255,255,255,0.3)] mt-2">MP4, MOV up to 100MB</p>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative">
                  <video src={videoPreview} controls className="w-full max-h-64 rounded-lg" />
                  <button
                    type="button"
                    onClick={() => { setVideoFile(null); setVideoPreview(null); }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/residences/manage")}
              className="dark-btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="dark-btn-primary flex items-center gap-2"
            >
              {updateMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
