"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchListing, fetchReviews, createBooking, toggleFavorite, checkFavorite, fetchResidence } from "@/lib/queries";
import { useAuth } from "@/lib/auth";
import { formatPrice, formatDate } from "@/lib/utils";
import { useState } from "react";
import { MapPin, Star, Bed, Heart, MessageSquare, Calendar, ArrowLeft, Shield, Video, ChevronLeft, ChevronRight, Images, Map, Home, Users } from "lucide-react";
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
  const [selectedRoomImage, setSelectedRoomImage] = useState(0);
  const [selectedPropertyImage, setSelectedPropertyImage] = useState(0);

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

  const roomImages = listing.images || [];
  const propertyImages = residence?.images || [];
  const hasCoords = listing.residence_latitude && listing.residence_longitude;

  const ImageGallery = ({
    images, selected, onSelect, label,
  }: { images: { id: number; image: string; is_primary: boolean }[]; selected: number; onSelect: (i: number) => void; label: string }) => (
    images.length > 0 ? (
      <div>
        <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden" style={{ background: "rgba(249,115,22,0.06)" }}>
          <img src={images[selected]?.image} alt={label} className="w-full h-full object-cover" />
          {images.length > 1 && (
            <>
              <button onClick={() => onSelect(selected === 0 ? images.length - 1 : selected - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={() => onSelect(selected === images.length - 1 ? 0 : selected + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition">
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
          <span className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
            <Images className="h-3 w-3" /> {selected + 1} / {images.length}
          </span>
          {label === "Room" && isAuthenticated && (
            <button onClick={() => favMutation.mutate()}
              className="absolute top-4 right-4 p-3 rounded-full transition" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
              <Heart className={`h-5 w-5 ${isFav ? "fill-red-500 text-red-500" : "text-white"}`} />
            </button>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button key={img.id} onClick={() => onSelect(i)}
                className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition ${i === selected ? "border-[#f97316]" : "border-transparent hover:border-[rgba(249,115,22,0.3)]"}`}>
                <img src={img.image} alt={`${label} ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    ) : (
      <div className="h-48 rounded-2xl flex items-center justify-center text-[rgba(255,255,255,0.15)]" style={{ background: "rgba(249,115,22,0.06)" }}>
        {label === "Room" ? <Bed className="h-12 w-12" /> : <Home className="h-12 w-12" />}
        <span className="ml-3 text-sm text-[rgba(255,255,255,0.25)]">No {label.toLowerCase()} photos yet</span>
      </div>
    )
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-[rgba(255,255,255,0.45)] hover:text-white mb-4 text-sm transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Main content */}
        <div className="lg:col-span-2 space-y-8">

          {/* ── ROOM SECTION ── */}
          <div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{listing.title}</h1>
                <div className="flex items-center gap-2 mt-1 text-[rgba(255,255,255,0.45)]">
                  <MapPin className="h-4 w-4" />
                  <span>{listing.residence_address}, {listing.residence_city}</span>
                </div>
              </div>
              <div className="text-right shrink-0 ml-4">
                <span className="text-2xl font-bold text-[#f97316]">{formatPrice(listing.price)}</span>
                <span className="text-sm text-[rgba(255,255,255,0.35)]">/mo</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="dark-badge flex items-center gap-1">
                <Bed className="h-3 w-3" />
                {listing.room_type === "single" ? "Single Room" : listing.room_type === "shared" ? "Sharing Room" : listing.room_type === "ensuite" ? "En-suite" : "Bachelor"}
              </span>
              <span className={`text-sm px-3 py-1 rounded-full font-medium ${listing.availability === "available" ? "bg-green-900/40 text-green-400" : listing.availability === "reserved" ? "bg-yellow-900/40 text-yellow-400" : "bg-red-900/40 text-red-400"}`}>
                {listing.availability.charAt(0).toUpperCase() + listing.availability.slice(1)}
              </span>
              {listing.max_occupants > 1 && (
                <span className="text-sm px-3 py-1 rounded-full flex items-center gap-1" style={{ background: "rgba(249,115,22,0.1)", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(249,115,22,0.15)" }}>
                  <Users className="h-3 w-3" /> {listing.max_occupants} occupants
                </span>
              )}
              {listing.is_featured && <span className="text-sm px-3 py-1 rounded-full font-medium" style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", color: "white" }}>Featured</span>}
            </div>

            {/* Room Photos */}
            <div className="mb-4">
              <h2 className="text-base font-semibold text-[rgba(255,255,255,0.6)] mb-2 flex items-center gap-2">
                <Bed className="h-4 w-4 text-[#f97316]" /> Room Photos
              </h2>
              <ImageGallery images={roomImages} selected={selectedRoomImage} onSelect={setSelectedRoomImage} label="Room" />
            </div>

            {listing.description && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">About This Room</h2>
                <p className="text-[rgba(255,255,255,0.5)] whitespace-pre-line">{listing.description}</p>
              </div>
            )}

            {listing.deposit > 0 && (
              <div className="mt-4 p-4 rounded-xl" style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.15)" }}>
                <p className="text-sm text-[rgba(255,255,255,0.5)]">Deposit required: <span className="font-semibold text-[#f97316]">{formatPrice(listing.deposit)}</span></p>
              </div>
            )}
          </div>

          {/* ── PROPERTY SECTION ── */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(249,115,22,0.15)" }}>
            <div className="px-5 py-4 flex items-center gap-2" style={{ background: "rgba(249,115,22,0.08)", borderBottom: "1px solid rgba(249,115,22,0.12)" }}>
              <Home className="h-5 w-5 text-[#f97316]" />
              <h2 className="text-lg font-semibold text-white">{listing.residence_name || residence?.name}</h2>
              {(residence?.total_rooms || residence?.total_beds) ? (
                <div className="ml-auto flex items-center gap-3 text-sm text-[rgba(255,255,255,0.45)]">
                  {residence.total_rooms > 0 && <span>{residence.total_rooms} rooms</span>}
                  {residence.total_beds > 0 && <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" /> {residence.total_beds} beds</span>}
                </div>
              ) : null}
            </div>

            <div className="p-5 space-y-5" style={{ background: "rgba(0,0,0,0.2)" }}>
              {/* Property Photos */}
              <div>
                <h3 className="text-sm font-medium text-[rgba(255,255,255,0.55)] mb-2 flex items-center gap-1.5">
                  <Images className="h-3.5 w-3.5 text-[#f97316]" /> Property Photos
                </h3>
                <ImageGallery images={propertyImages} selected={selectedPropertyImage} onSelect={setSelectedPropertyImage} label="Property" />
              </div>

              {/* Amenities */}
              {residence?.amenities && residence.amenities.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-[rgba(255,255,255,0.55)] mb-2">Amenities included</h3>
                  <div className="flex flex-wrap gap-2">
                    {residence.amenities.map((a) => (
                      <span key={a.id} className="text-sm px-3 py-1.5 rounded-full" style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", color: "rgba(255,255,255,0.65)" }}>
                        {a.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Virtual Tour */}
              {residence?.virtual_tour_video && (
                <div>
                  <h3 className="text-sm font-medium text-[rgba(255,255,255,0.55)] mb-2 flex items-center gap-1.5">
                    <Video className="h-3.5 w-3.5 text-[#f97316]" /> Virtual Tour
                  </h3>
                  <video src={residence.virtual_tour_video} controls className="w-full max-h-64 rounded-xl bg-black" />
                </div>
              )}

              {/* Location */}
              {hasCoords && (
                <div>
                  <h3 className="text-sm font-medium text-[rgba(255,255,255,0.55)] mb-2 flex items-center gap-1.5">
                    <Map className="h-3.5 w-3.5 text-[#f97316]" /> Location
                  </h3>
                  <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(249,115,22,0.15)" }}>
                    <iframe width="100%" height="280" style={{ border: 0 }} loading="lazy"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(listing.residence_longitude) - 0.005},${Number(listing.residence_latitude) - 0.003},${Number(listing.residence_longitude) + 0.005},${Number(listing.residence_latitude) + 0.003}&layer=mapnik&marker=${listing.residence_latitude},${listing.residence_longitude}`}
                    />
                  </div>
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${listing.residence_latitude},${listing.residence_longitude}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-[#f97316] hover:text-[#fb923c] font-medium mt-2 transition-colors">
                    <MapPin className="h-4 w-4" /> Get Directions
                  </a>
                </div>
              )}
            </div>
          </div>

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
              <Link href="/messages"
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
