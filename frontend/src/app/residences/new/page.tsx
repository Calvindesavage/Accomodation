"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Upload, X, Video, Image as ImageIcon, MapPin, Home } from "lucide-react";
import { createResidence, uploadResidenceImage, fetchAmenities } from "@/lib/queries";
import { useAuth } from "@/lib/auth";

export default function NewResidencePage() {
  const router = useRouter();
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
    total_rooms: "",
    total_beds: "",
    rules: "",
    amenity_ids: [] as number[],
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [step, setStep] = useState(1);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]> | null>(null);

  const { data: amenities } = useQuery({
    queryKey: ["amenities"],
    queryFn: fetchAmenities,
  });

  const createMutation = useMutation({
    mutationFn: createResidence,
    onSuccess: async (residence) => {
      // Upload images after residence is created
      if (imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          await uploadResidenceImage(residence.id, imageFiles[i], i === primaryImageIndex);
        }
      }
      router.push("/dashboard");
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
          <p className="mt-2 text-[rgba(255,255,255,0.45)]">Only landlords can add properties.</p>
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
    if (formData.total_rooms) submitData.append("total_rooms", formData.total_rooms);
    if (formData.total_beds) submitData.append("total_beds", formData.total_beds);
    submitData.append("rules", formData.rules);
    formData.amenity_ids.forEach((id) => submitData.append("amenity_ids", String(id)));
    if (videoFile) submitData.append("virtual_tour_video", videoFile);

    createMutation.mutate(submitData);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Add New Property</h1>
          <p className="mt-2 text-[rgba(255,255,255,0.45)]">Create a new residence listing with images and virtual tour</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center mb-8">
          <div className={`flex-1 h-2 rounded ${step >= 1 ? "bg-[#f97316]" : "bg-[rgba(255,255,255,0.1)]"}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-2 ${step >= 1 ? "bg-[#f97316] text-white" : "bg-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.4)]"}`}>1</div>
          <div className={`flex-1 h-2 rounded ${step >= 2 ? "bg-[#f97316]" : "bg-[rgba(255,255,255,0.1)]"}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-2 ${step >= 2 ? "bg-[#f97316] text-white" : "bg-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.4)]"}`}>2</div>
          <div className={`flex-1 h-2 rounded ${step >= 3 ? "bg-[#f97316]" : "bg-[rgba(255,255,255,0.1)]"}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-2 ${step >= 3 ? "bg-[#f97316] text-white" : "bg-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.4)]"}`}>3</div>
          <div className={`flex-1 h-2 rounded ${step >= 3 ? "bg-[#f97316]" : "bg-[rgba(255,255,255,0.1)]"}`} />
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

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Info */}
          {step === 1 && (
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
                    placeholder="e.g., Sunrise Student Apartments"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="dark-label">Description</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="dark-input mt-1"
                    placeholder="Describe your property..."
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
                    placeholder="Street address"
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

                <div>
                  <label className="dark-label">Total Rooms</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.total_rooms}
                    onChange={(e) => setFormData({ ...formData, total_rooms: e.target.value })}
                    className="dark-input mt-1"
                    placeholder="e.g. 10"
                  />
                </div>

                <div>
                  <label className="dark-label">Total Beds</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.total_beds}
                    onChange={(e) => setFormData({ ...formData, total_beds: e.target.value })}
                    className="dark-input mt-1"
                    placeholder="e.g. 15"
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

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="dark-btn-primary"
                >
                  Next: Amenities & Media
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Amenities & Media */}
          {step === 2 && (
            <div className="dark-card p-6 space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {amenities?.map((amenity) => (
                    <button
                      key={amenity.id}
                      type="button"
                      onClick={() => toggleAmenity(amenity.id)}
                      className={`p-3 rounded-lg text-left transition-colors ${
                        formData.amenity_ids.includes(amenity.id)
                          ? "border-[#f97316] text-[#f97316]"
                          : "hover:border-[rgba(249,115,22,0.3)]"
                      }`}
                    >
                      <span className="text-sm font-medium text-[rgba(255,255,255,0.7)]">{amenity.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Virtual Tour Video Upload */}
              <div>
                <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
                  <Video className="w-5 h-5 text-[#f97316]" />
                  Virtual Tour Video
                </h2>
                <div className="rounded-lg p-6" style={{ border: "2px dashed rgba(249,115,22,0.25)" }}>
                  {!videoPreview ? (
                    <div className="text-center">
                      <Video className="mx-auto h-12 w-12 text-[rgba(255,255,255,0.2)]" />
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => videoInputRef.current?.click()}
                          className="text-[#f97316] hover:text-[#fb923c] font-medium"
                        >
                          Upload a video
                        </button>
                        <p className="text-sm text-[rgba(255,255,255,0.3)] mt-2">MP4, MOV up to 100MB</p>
                      </div>
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
                        onClick={() => {
                          setVideoFile(null);
                          setVideoPreview(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Property Images Upload */}
              <div>
                <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
                  <ImageIcon className="w-5 h-5 text-[#f97316]" />
                  Property Images
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
                            className={`w-full h-24 object-cover rounded-lg ${
                              index === primaryImageIndex ? "ring-2 ring-[#f97316]" : ""
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          {index === primaryImageIndex && (
                            <span className="absolute bottom-1 left-1 text-xs text-white px-2 py-0.5 rounded" style={{ background: "#f97316" }}>
                              Primary
                            </span>
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

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[rgba(255,255,255,0.5)] hover:text-white px-6 py-2 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
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
                      Create Property
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
