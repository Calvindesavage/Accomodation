"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMyResidences, fetchMyListings, deleteListing, deleteResidence } from "@/lib/queries";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  Home, Bed, Plus, Trash2, Edit, Eye, MapPin, Star, ChevronRight,
} from "lucide-react";

export default function ManageResidencesPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "LANDLORD")) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, user, router]);

  const { data: residences, isLoading: loadingRes } = useQuery({
    queryKey: ["myResidences"],
    queryFn: fetchMyResidences,
    enabled: isAuthenticated && user?.role === "LANDLORD",
  });

  const { data: listings, isLoading: loadingListings } = useQuery({
    queryKey: ["myListings"],
    queryFn: fetchMyListings,
    enabled: isAuthenticated && user?.role === "LANDLORD",
  });

  const deleteListingMut = useMutation({
    mutationFn: deleteListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myListings"] });
    },
  });

  const deleteResidenceMut = useMutation({
    mutationFn: deleteResidence,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myResidences"] });
      queryClient.invalidateQueries({ queryKey: ["myListings"] });
    },
  });

  if (loading || loadingRes || loadingListings) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 rounded w-1/3" style={{ background: "rgba(249,115,22,0.1)" }} />
          <div className="h-40 dark-card" />
          <div className="h-40 dark-card" />
        </div>
      </div>
    );
  }

  if (!user || user.role !== "LANDLORD") return null;

  const getListingsForResidence = (residenceId: number) =>
    listings?.filter((l) => l.residence === residenceId) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Home className="h-8 w-8 text-[#f97316]" />
            My Properties
          </h1>
          <p className="text-[rgba(255,255,255,0.45)] mt-1">Manage your residences and room listings</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/residences/new"
            className="dark-btn-primary inline-flex items-center gap-2 !text-sm"
          >
            <Plus className="h-4 w-4" /> Add Property
          </Link>
          <Link
            href="/listings/new"
            className="dark-btn-outline inline-flex items-center gap-2 !text-sm"
          >
            <Bed className="h-4 w-4" /> Add Listing
          </Link>
        </div>
      </div>

      {!residences?.length ? (
        <div className="text-center py-20 dark-card">
          <Home className="h-16 w-16 text-[rgba(255,255,255,0.15)] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No properties yet</h3>
          <p className="text-[rgba(255,255,255,0.4)] mb-6">Start by adding your first property</p>
          <Link
            href="/residences/new"
            className="dark-btn-primary inline-flex items-center gap-2"
          >
            <Plus className="h-5 w-5" /> Add Your First Property
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {residences.map((residence) => {
            const resListings = getListingsForResidence(residence.id);
            const primaryImage = residence.images?.find((img) => img.is_primary) || residence.images?.[0];

            return (
              <div key={residence.id} className="dark-card overflow-hidden">
                {/* Residence Header */}
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-48 h-40 sm:h-auto shrink-0" style={{ background: "rgba(249,115,22,0.06)" }}>
                    {primaryImage ? (
                      <img src={primaryImage.image} alt={residence.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[rgba(255,255,255,0.15)]">
                        <Home className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-white">{residence.name}</h2>
                        <div className="flex items-center gap-1 text-sm text-[rgba(255,255,255,0.4)] mt-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{residence.address}, {residence.city}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/residences/${residence.id}/edit`}
                          className="p-2 text-[rgba(255,255,255,0.3)] hover:text-[#f97316] rounded-lg transition-colors"
                          title="Edit Property"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${residence.name}" and all its listings? This cannot be undone.`)) {
                              deleteResidenceMut.mutate(residence.id);
                            }
                          }}
                          className="p-2 text-[rgba(255,255,255,0.3)] hover:text-red-400 rounded-lg transition-colors"
                          title="Delete Property"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {residence.average_rating > 0 && (
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium text-white">{residence.average_rating}</span>
                            <span className="text-[rgba(255,255,255,0.3)]">({residence.review_count})</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {residence.description && (
                      <p className="text-sm text-[rgba(255,255,255,0.45)] mt-2 line-clamp-2">{residence.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-3">
                      <span className="dark-badge">
                        {resListings.length} listing{resListings.length !== 1 ? "s" : ""}
                      </span>
                      {residence.amenities?.slice(0, 3).map((a) => (
                        <span key={a.id} className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(249,115,22,0.08)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(249,115,22,0.15)" }}>
                          {a.name}
                        </span>
                      ))}
                      <span className="text-xs text-[rgba(255,255,255,0.25)]">
                        Added {formatDate(residence.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Listings for this residence */}
                {resListings.length > 0 ? (
                  <div style={{ borderTop: "1px solid rgba(249,115,22,0.12)" }}>
                    <div className="px-5 py-3 flex items-center justify-between" style={{ background: "rgba(249,115,22,0.04)" }}>
                      <h3 className="text-sm font-semibold text-[rgba(255,255,255,0.6)]">Room Listings</h3>
                      <Link
                        href="/listings/new"
                        className="text-xs text-[#f97316] hover:underline flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" /> Add Room
                      </Link>
                    </div>
                    <div>
                      {resListings.map((listing) => {
                        const listingImg = listing.images?.find((img) => img.is_primary) || listing.images?.[0];
                        return (
                          <div key={listing.id} className="px-5 py-4 flex items-center gap-4 transition hover:bg-[rgba(249,115,22,0.04)]" style={{ borderTop: "1px solid rgba(249,115,22,0.06)" }}>
                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0" style={{ background: "rgba(249,115,22,0.06)" }}>
                              {listingImg ? (
                                <img src={listingImg.image} alt={listing.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[rgba(255,255,255,0.2)]">
                                  <Bed className="h-6 w-6" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-white truncate">{listing.title}</h4>
                              <div className="flex items-center gap-3 mt-1 text-sm">
                                <span className="font-semibold text-[#f97316]">{formatPrice(listing.price)}/mo</span>
                                <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: "rgba(249,115,22,0.1)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(249,115,22,0.15)" }}>
                                  {listing.room_type}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  listing.availability === "available"
                                    ? "bg-green-900/40 text-green-400"
                                    : listing.availability === "reserved"
                                    ? "bg-yellow-900/40 text-yellow-400"
                                    : "bg-red-900/40 text-red-400"
                                }`}>
                                  {listing.availability}
                                </span>
                                {listing.max_occupants > 1 && (
                                  <span className="text-xs text-[rgba(255,255,255,0.35)]">
                                    {listing.max_occupants} occupants
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Link
                                href={`/listings/${listing.id}`}
                                className="p-2 text-[rgba(255,255,255,0.3)] hover:text-[#f97316] rounded-lg transition-colors"
                                title="View"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              <Link
                                href={`/listings/${listing.id}/edit`}
                                className="p-2 text-[rgba(255,255,255,0.3)] hover:text-[#f97316] rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => {
                                  if (confirm("Delete this listing?")) {
                                    deleteListingMut.mutate(listing.id);
                                  }
                                }}
                                className="p-2 text-[rgba(255,255,255,0.3)] hover:text-red-400 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="px-5 py-6 text-center" style={{ borderTop: "1px solid rgba(249,115,22,0.12)", background: "rgba(249,115,22,0.03)" }}>
                    <p className="text-sm text-[rgba(255,255,255,0.4)] mb-3">No room listings for this property yet</p>
                    <Link
                      href="/listings/new"
                      className="inline-flex items-center gap-1 text-sm text-[#f97316] hover:underline font-medium"
                    >
                      <Plus className="h-4 w-4" /> Add a Room Listing
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
