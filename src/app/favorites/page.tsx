"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchFavorites } from "@/lib/queries";
import ListingCard from "@/components/listings/ListingCard";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const { data, isLoading } = useQuery({ queryKey: ["favorites"], queryFn: fetchFavorites });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
        <Heart className="h-8 w-8 text-red-500" /> Saved Listings
      </h1>
      <p className="text-[rgba(255,255,255,0.45)] mb-8">Your favorite listings in one place</p>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 dark-card animate-pulse" />
          ))}
        </div>
      ) : data?.results?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.results.map((fav) => (
            <ListingCard key={fav.id} listing={fav.listing_detail} isFavorited={true} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Heart className="h-12 w-12 mx-auto mb-4 text-[rgba(255,255,255,0.15)]" />
          <p className="font-semibold text-[rgba(255,255,255,0.5)]">No saved listings</p>
          <p className="text-sm text-[rgba(255,255,255,0.3)] mt-1">Browse listings and tap the heart to save them here</p>
        </div>
      )}
    </div>
  );
}
