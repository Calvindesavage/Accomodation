"use client";

import Link from "next/link";
import { Heart, MapPin, Star, Bed } from "lucide-react";
import { Listing } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFavorite } from "@/lib/queries";
import { useAuth } from "@/lib/auth";
import { useState } from "react";

interface ListingCardProps {
  listing: Listing;
  isFavorited?: boolean;
}

export default function ListingCard({ listing, isFavorited = false }: ListingCardProps) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [fav, setFav] = useState(isFavorited);

  const favMutation = useMutation({
    mutationFn: () => toggleFavorite(listing.id),
    onSuccess: (data) => {
      setFav(data.is_favorited);
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const primaryImage = listing.images?.find((img) => img.is_primary) || listing.images?.[0];
  const roomTypeLabel: Record<string, string> = {
    single: "Single Room",
    shared: "Shared Room",
    bachelor: "Bachelor",
    ensuite: "En-suite",
  };

  return (
    <div className="dark-card overflow-hidden group transition-all hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden" style={{ background: "rgba(249,115,22,0.06)" }}>
        {primaryImage ? (
          <img
            src={primaryImage.image}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[rgba(255,255,255,0.2)]">
            <Bed className="h-12 w-12" />
          </div>
        )}
        {listing.is_featured && (
          <span className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full" style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", color: "white" }}>
            Featured
          </span>
        )}
        {isAuthenticated && (
          <button
            onClick={(e) => { e.preventDefault(); favMutation.mutate(); }}
            className="absolute top-3 right-3 p-2 rounded-full transition" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
          >
            <Heart className={`h-4 w-4 ${fav ? "fill-red-500 text-red-500" : "text-white"}`} />
          </button>
        )}
        <div className="absolute bottom-3 left-3">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            listing.availability === "available"
              ? "bg-green-900/60 text-green-400"
              : listing.availability === "reserved"
              ? "bg-yellow-900/60 text-yellow-400"
              : "bg-red-900/60 text-red-400"
          }`}>
            {listing.availability.charAt(0).toUpperCase() + listing.availability.slice(1)}
          </span>
        </div>
      </div>
      <Link href={`/listings/${listing.id}`} className="block p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-white truncate flex-1">{listing.title}</h3>
          {listing.average_rating > 0 && (
            <div className="flex items-center gap-1 text-sm ml-2 shrink-0">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-white">{listing.average_rating}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 text-sm text-[rgba(255,255,255,0.4)] mb-2">
          <MapPin className="h-3.5 w-3.5" />
          <span className="truncate">{listing.residence_city} &middot; {listing.residence_name}</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(249,115,22,0.1)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(249,115,22,0.2)" }}>
            {roomTypeLabel[listing.room_type] || listing.room_type}
          </span>
          {listing.amenities?.slice(0, 2).map((a) => (
            <span key={a.id} className="dark-badge !text-[11px] !px-2 !py-0.5">
              {a.name}
            </span>
          ))}
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-lg font-bold text-[#f97316]">{formatPrice(listing.price)}</span>
          <span className="text-xs text-[rgba(255,255,255,0.3)]">/month</span>
        </div>
      </Link>
    </div>
  );
}
