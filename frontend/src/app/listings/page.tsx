"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchListings } from "@/lib/queries";
import ListingCard from "@/components/listings/ListingCard";
import { Search, SlidersHorizontal, X } from "lucide-react";

export default function ListingsPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    min_price: "",
    max_price: "",
    room_type: "",
    availability: "available",
  });
  const [showFilters, setShowFilters] = useState(false);

  const params: Record<string, string> = { ordering: "-is_featured,-created_at" };
  if (search) params.search = search;
  if (filters.city) params.city = filters.city;
  if (filters.min_price) params.min_price = filters.min_price;
  if (filters.max_price) params.max_price = filters.max_price;
  if (filters.room_type) params.room_type = filters.room_type;
  if (filters.availability) params.availability = filters.availability;

  const { data, isLoading } = useQuery({
    queryKey: ["listings", params],
    queryFn: () => fetchListings(params),
  });

  const clearFilters = () => {
    setFilters({ city: "", min_price: "", max_price: "", room_type: "", availability: "available" });
    setSearch("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Browse Listings</h1>
        <p className="text-[rgba(255,255,255,0.45)]">Find your perfect student accommodation</p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[rgba(255,255,255,0.3)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, location, or description..."
            className="dark-input !pl-12"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition text-sm ${
            showFilters
              ? "text-[#f97316]"
              : "text-[rgba(255,255,255,0.6)] hover:text-white"
          }`}
          style={{ background: showFilters ? "rgba(249,115,22,0.15)" : "rgba(249,115,22,0.06)", border: `1px solid ${showFilters ? "rgba(249,115,22,0.4)" : "rgba(249,115,22,0.15)"}` }}
        >
          <SlidersHorizontal className="h-5 w-5" />
          Filters
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="dark-card p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="dark-label">City</label>
            <input
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              placeholder="e.g. Johannesburg"
              className="dark-input !py-2"
            />
          </div>
          <div>
            <label className="dark-label">Min Price (R)</label>
            <input
              type="number"
              value={filters.min_price}
              onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
              placeholder="0"
              className="dark-input !py-2"
            />
          </div>
          <div>
            <label className="dark-label">Max Price (R)</label>
            <input
              type="number"
              value={filters.max_price}
              onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
              placeholder="10000"
              className="dark-input !py-2"
            />
          </div>
          <div>
            <label className="dark-label">Room Type</label>
            <select
              value={filters.room_type}
              onChange={(e) => setFilters({ ...filters, room_type: e.target.value })}
              className="dark-input !py-2"
            >
              <option value="">All Types</option>
              <option value="single">Single</option>
              <option value="shared">Shared</option>
              <option value="bachelor">Bachelor</option>
              <option value="ensuite">En-suite</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-[rgba(255,255,255,0.4)] hover:text-red-400 transition-colors">
              <X className="h-4 w-4" /> Clear All
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="dark-card animate-pulse">
              <div className="h-48 rounded-t-2xl" style={{ background: "rgba(249,115,22,0.06)" }} />
              <div className="p-4 space-y-3">
                <div className="h-4 rounded w-3/4" style={{ background: "rgba(249,115,22,0.1)" }} />
                <div className="h-3 rounded w-1/2" style={{ background: "rgba(249,115,22,0.08)" }} />
                <div className="h-6 rounded w-1/3" style={{ background: "rgba(249,115,22,0.1)" }} />
              </div>
            </div>
          ))}
        </div>
      ) : data?.results?.length ? (
        <>
          <p className="text-sm text-[rgba(255,255,255,0.4)] mb-4">{data.count} listing{data.count !== 1 ? "s" : ""} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.results.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <Search className="h-12 w-12 text-[rgba(255,255,255,0.15)] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[rgba(255,255,255,0.6)]">No listings found</h3>
          <p className="text-[rgba(255,255,255,0.3)] mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
