"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchListing, fetchReviews, createBooking, toggleFavorite, checkFavorite, fetchResidence } from "@/lib/queries";
import { useAuth } from "@/lib/auth";
import { formatPrice, formatDate } from "@/lib/utils";
import { useState } from "react";
import { MapPin, Star, Bed, Heart, MessageSquare, Calendar, ArrowLeft, Shield, Video, ChevronLeft, ChevronRight, Images, Map } from "lucide-react";
import Link from "next/link";

export default function ListingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const listingId = Number(id);

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", listingId],
    queryFn: () => fetchListing(listingId),
    enabled: !!listingId,
  });

  const { data: reviews } = useQuery({
    queryKey: ["reviews", listing?.residence],
    queryFn: () => fetchReviews(listing!.residence),
    enabled: !!listing?.residence,
  });

  const { data: residence } = useQuery({
    queryKey: ["residence", listing?.residence],
    queryFn: () => fetchResidence(listing!.residence),
    enabled: !!listing?.residence,
  });

  const { data: isFav } = useQuery({
    queryKey: ["fav", listingId],
    queryFn: () => checkFavorite(listingId),
    enabled: isAuthenticated && !!listingId,
  });

  const [bookingDate, setBookingDate] = useState("");
  const [bookingMsg, setBookingMsg] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const bookMutation = useMutation({
    mutationFn: () => createBooking({ listing: listingId, move_in_date: bookingDate, message: bookingMsg }),
    onSuccess: () => setBookingSuccess(true),
  });

  const favMutation = useMutation({ mutationFn: () => toggleFavorite(listingId) });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 rounded w-1/3" style={{ background: "rgba(249,115,22,0.1)" }} />
          <div className="h-80 rounded-2xl" style={{ background: "rgba(249,115,22,0.06)" }} />
          <div className="h-4 rounded w-2/3" style={{ background: "rgba(249,115,22,0.08)" }} />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-[rgba(255,255,255,0.6)]">Listing not found</h2>
        <Link href="/listings" className="text-[#f97316] mt-4 inline-block">Back to listings</Link>
      </div>
    );
  }

  // Combine listing images + residence images into one gallery
  const allImages = [
    ...(listing.images || []).map((img) => ({ ...img, source: "Room" as const })),
    ...(residence?.images || []).filter((ri) => !listing.images?.some((li) => li.image === ri.image)).map((img) => ({ ...img, source: "Property" as const })),
  ];
  // Sort so primary is first
  allImages.sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0));

  const hasCoords = listing.residence_latitude && listing.residence_longitude;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-[rgba(255,255,255,0.45)] hover:text-white mb-4 text-sm transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* Image Gallery */}
      {allImages.length > 0 ? (
        <div className="mb-8">
          {/* Main Image */}
          <div className="relative h-64 sm:h-[28rem] rounded-2xl overflow-hidden" style={{ background: "rgba(249,115,22,0.06)" }}>
            <img
              src={allImages[selectedImage]?.image}
              alt={`${listing.title} - ${selectedImage + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Navigation arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setSelectedImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
            {/* Image counter + source badge */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <span className="bg-black/50 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                <Images className="h-3 w-3" />
                {selectedImage + 1} / {allImages.length}
              </span>
              <span className="dark-badge">
                {allImages[selectedImage]?.source}
              </span>
            </div>
            {/* Favorite button */}
            {isAuthenticated && (
              <button onClick={() => favMutation.mutate()}
                className="absolute top-4 right-4 p-3 rounded-full transition" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
                <Heart className={`h-5 w-5 ${isFav ? "fill-red-500 text-red-500" : "text-white"}`} />
              </button>
            )}
          </div>
          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
              {allImages.map((img, index) => (
                <button
                  key={img.id + "-" + img.source}
                  onClick={() => setSelectedImage(index)}
                  className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition ${
                    index === selectedImage
                      ? "border-[#f97316]"
                      : "border-transparent hover:border-[rgba(249,115,22,0.3)]"
                  }`}
                >
                  <img src={img.image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden mb-8 flex items-center justify-center text-[rgba(255,255,255,0.15)]" style={{ background: "rgba(249,115,22,0.06)" }}>
          <Bed className="h-16 w-16" />
        </div>
      )}

      {/* Virtual Tour Video */}
      {residence?.virtual_tour_video && (
        <div className="mb-8 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(249,115,22,0.05))", border: "1px solid rgba(249,115,22,0.2)" }}>
          <div className="p-4 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Video className="h-5 w-5 text-[#f97316]" />
              <h2 className="text-lg font-semibold">Virtual Tour</h2>
              <span className="dark-badge">Watch before booking</span>
            </div>
            <video
              src={residence.virtual_tour_video}
              controls
              className="w-full max-h-96 rounded-lg bg-black"
              poster={allImages[0]?.image}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-start justify-between">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{listing.title}</h1>
              <span className="text-2xl font-bold text-[#f97316]">{formatPrice(listing.price)}<span className="text-sm font-normal text-[rgba(255,255,255,0.35)]">/mo</span></span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-[rgba(255,255,255,0.45)]">
              <MapPin className="h-4 w-4" />
              <span>{listing.residence_address}, {listing.residence_city}</span>
            </div>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <span className="dark-badge">
                {listing.room_type.charAt(0).toUpperCase() + listing.room_type.slice(1)}
              </span>
              <span className={`text-sm px-3 py-1 rounded-full font-medium ${listing.availability === "available" ? "bg-green-900/40 text-green-400" : "bg-red-900/40 text-red-400"}`}>
                {listing.availability.charAt(0).toUpperCase() + listing.availability.slice(1)}
              </span>
              {listing.is_featured && <span className="text-sm px-3 py-1 rounded-full font-medium" style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", color: "white" }}>Featured</span>}
            </div>
          </div>

          {listing.description && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Description</h2>
              <p className="text-[rgba(255,255,255,0.5)] whitespace-pre-line">{listing.description}</p>
            </div>
          )}

          {listing.amenities?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((a) => (
                  <span key={a.id} className="text-sm px-3 py-1.5 rounded-full" style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", color: "rgba(255,255,255,0.6)" }}>{a.name}</span>
                ))}
              </div>
            </div>
          )}

          {listing.deposit > 0 && (
            <div className="dark-card p-4">
              <p className="text-sm text-[rgba(255,255,255,0.5)]">Deposit required: <span className="font-semibold text-[#f97316]">{formatPrice(listing.deposit)}</span></p>
            </div>
          )}

          {/* Google Maps */}
          {hasCoords && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Map className="h-5 w-5 text-[#f97316]" /> Location
              </h2>
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(249,115,22,0.2)" }}>
                <iframe
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(listing.residence_longitude) - 0.005},${Number(listing.residence_latitude) - 0.003},${Number(listing.residence_longitude) + 0.005},${Number(listing.residence_latitude) + 0.003}&layer=mapnik&marker=${listing.residence_latitude},${listing.residence_longitude}`}
                  allowFullScreen
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${listing.residence_latitude},${listing.residence_longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[#f97316] hover:text-[#fb923c] font-medium transition-colors"
                >
                  <MapPin className="h-4 w-4" />
                  Get Directions
                </a>
                <span className="text-xs text-[rgba(255,255,255,0.3)]">{listing.residence_address}, {listing.residence_city}</span>
              </div>
            </div>
          )}

          {/* Reviews */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" /> Reviews
              {listing.average_rating > 0 && <span className="text-[rgba(255,255,255,0.4)] text-sm font-normal">({listing.average_rating} avg)</span>}
            </h2>
            {reviews?.results?.length ? (
              <div className="space-y-4">
                {reviews.results.map((r) => (
                  <div key={r.id} className="dark-card p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-white">{r.student_name}</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-[rgba(255,255,255,0.15)]"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-[rgba(255,255,255,0.5)]">{r.comment}</p>
                    <p className="text-xs text-[rgba(255,255,255,0.25)] mt-1">{formatDate(r.created_at)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[rgba(255,255,255,0.3)]">No reviews yet.</p>
            )}
          </div>
        </div>

        {/* Sidebar: Booking + Landlord */}
        <div className="space-y-6">
          <div className="dark-card p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-[#f97316]" />
              <span className="font-medium text-sm text-white">{listing.landlord_name}</span>
            </div>

            {isAuthenticated && user?.role === "STUDENT" && listing.availability === "available" && !bookingSuccess ? (
              <div className="space-y-3">
                <h3 className="font-semibold text-white">Book This Room</h3>
                <div>
                  <label className="dark-label">Move-in Date</label>
                  <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)}
                    className="dark-input !py-2" />
                </div>
                <div>
                  <label className="dark-label">Message (optional)</label>
                  <textarea value={bookingMsg} onChange={(e) => setBookingMsg(e.target.value)} rows={3}
                    className="dark-input resize-none"
                    placeholder="Hi, I'm interested in this room..." />
                </div>
                <button onClick={() => bookMutation.mutate()} disabled={!bookingDate || bookMutation.isPending}
                  className="w-full dark-btn-primary flex items-center justify-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {bookMutation.isPending ? "Booking..." : "Request Booking"}
                </button>
                {bookMutation.isError && <p className="text-red-400 text-xs">Booking failed. Try again.</p>}
              </div>
            ) : bookingSuccess ? (
              <div className="p-4 rounded-xl text-sm" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80" }}>
                Booking request sent! The landlord will review it.
              </div>
            ) : !isAuthenticated ? (
              <Link href="/login" className="block w-full dark-btn-primary text-center">
                Login to Book
              </Link>
            ) : null}

            {isAuthenticated && (
              <Link href={`/messages`}
                className="mt-3 w-full py-2.5 font-medium rounded-xl flex items-center justify-center gap-2 dark-btn-outline">
                <MessageSquare className="h-4 w-4" /> Message Landlord
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
