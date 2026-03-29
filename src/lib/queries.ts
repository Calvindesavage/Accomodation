import api from "./api";
import {
  Listing,
  Booking,
  Conversation,
  Notification,
  Favorite,
  Review,
  Residence,
  Amenity,
  PaginatedResponse,
  CompatibilityQuestion,
  StudentAnswer,
  RoommateMatch,
} from "@/types";

// Listings
export const fetchListings = async (params?: Record<string, string>) => {
  const { data } = await api.get<PaginatedResponse<Listing>>("/listings/", { params });
  return data;
};

export const fetchListing = async (id: number) => {
  const { data } = await api.get<Listing>(`/listings/${id}/`);
  return data;
};

export const fetchMyListings = async () => {
  const { data } = await api.get<Listing[]>("/listings/my_listings/");
  return data;
};

export const createListing = async (listingData: {
  residence: number;
  title: string;
  description?: string;
  price: number;
  deposit?: number;
  room_type: string;
  availability?: string;
  available_from?: string;
  is_featured?: boolean;
  max_occupants?: number;
}) => {
  const { data } = await api.post<Listing>("/listings/", listingData);
  return data;
};

export const updateListing = async (id: number, listingData: Partial<{
  title: string;
  description: string;
  price: number;
  deposit: number;
  room_type: string;
  availability: string;
  available_from: string;
  is_featured: boolean;
  max_occupants: number;
}>) => {
  const { data } = await api.patch<Listing>(`/listings/${id}/`, listingData);
  return data;
};

export const deleteListing = async (id: number) => {
  await api.delete(`/listings/${id}/`);
};

export const uploadListingImage = async (listingId: number, image: File, isPrimary: boolean = false) => {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("is_primary", String(isPrimary));
  const { data } = await api.post(
    `/listings/${listingId}/upload_image/`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
};

// Residences
export const fetchResidences = async () => {
  const { data } = await api.get<PaginatedResponse<Residence>>("/residences/");
  return data;
};

export const fetchResidence = async (id: number) => {
  const { data } = await api.get<Residence>(`/residences/${id}/`);
  return data;
};

export const fetchMyResidences = async () => {
  const { data } = await api.get<Residence[]>("/residences/my_residences/");
  return data;
};

export const createResidence = async (formData: FormData) => {
  const { data } = await api.post<Residence>("/residences/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateResidence = async (id: number, formData: FormData) => {
  const { data } = await api.patch<Residence>(`/residences/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteResidence = async (id: number) => {
  await api.delete(`/residences/${id}/`);
};

export const uploadResidenceImage = async (residenceId: number, image: File, isPrimary: boolean = false) => {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("is_primary", String(isPrimary));
  const { data } = await api.post(
    `/residences/${residenceId}/upload_image/`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
};

// Amenities
export const fetchAmenities = async () => {
  const { data } = await api.get<Amenity[]>("/residences/amenities/");
  return data;
};

// Bookings
export const fetchBookings = async () => {
  const { data } = await api.get<PaginatedResponse<Booking>>("/bookings/");
  return data;
};

export const createBooking = async (bookingData: {
  listing: number;
  move_in_date: string;
  move_out_date?: string;
  message?: string;
}) => {
  const { data } = await api.post<Booking>("/bookings/", bookingData);
  return data;
};

export const acceptBooking = async (id: number) => {
  const { data } = await api.post<Booking>(`/bookings/${id}/accept/`);
  return data;
};

export const rejectBooking = async (id: number, reason?: string) => {
  const { data } = await api.post<Booking>(`/bookings/${id}/reject/`, { reason });
  return data;
};

export const cancelBooking = async (id: number) => {
  const { data } = await api.post<Booking>(`/bookings/${id}/cancel/`);
  return data;
};

// Reviews
export const fetchReviews = async (residenceId: number) => {
  const { data } = await api.get<PaginatedResponse<Review>>("/reviews/", {
    params: { residence: residenceId },
  });
  return data;
};

export const createReview = async (reviewData: {
  residence: number;
  rating: number;
  comment: string;
}) => {
  const { data } = await api.post<Review>("/reviews/", reviewData);
  return data;
};

// Conversations
export const fetchConversations = async () => {
  const { data } = await api.get<PaginatedResponse<Conversation>>("/messages/conversations/");
  return data;
};

export const fetchConversation = async (id: number) => {
  const { data } = await api.get<Conversation>(`/messages/conversations/${id}/`);
  return data;
};

export const sendMessage = async (conversationId: number, content: string) => {
  const { data } = await api.post(`/messages/conversations/${conversationId}/send/`, { content });
  return data;
};

export const startConversation = async (recipientId: number, message: string) => {
  const { data } = await api.post<Conversation>("/messages/start/", {
    recipient_id: recipientId,
    message,
  });
  return data;
};

// Notifications
export const fetchNotifications = async () => {
  const { data } = await api.get<PaginatedResponse<Notification>>("/notifications/");
  return data;
};

export const markNotificationRead = async (id: number) => {
  const { data } = await api.post(`/notifications/${id}/mark_read/`);
  return data;
};

export const markAllNotificationsRead = async () => {
  await api.post("/notifications/mark_all_read/");
};

export const fetchUnreadCount = async () => {
  const { data } = await api.get<{ unread_count: number }>("/notifications/unread_count/");
  return data.unread_count;
};

// Favorites
export const fetchFavorites = async () => {
  const { data } = await api.get<PaginatedResponse<Favorite>>("/favorites/");
  return data;
};

export const toggleFavorite = async (listingId: number) => {
  const { data } = await api.post<{ is_favorited: boolean }>("/favorites/toggle/", {
    listing_id: listingId,
  });
  return data;
};

export const checkFavorite = async (listingId: number) => {
  const { data } = await api.get<{ is_favorited: boolean }>(`/favorites/check/${listingId}/`);
  return data.is_favorited;
};

// Matching / Roommate Compatibility
export const fetchQuestions = async () => {
  const { data } = await api.get<CompatibilityQuestion[]>("/matching/questions/");
  return data;
};

export const submitAnswers = async (answers: { question: string; answer: string }[]) => {
  const { data } = await api.post<{ detail: string; completed: boolean }>("/matching/submit/", {
    answers,
  });
  return data;
};

export const fetchMyAnswers = async () => {
  const { data } = await api.get<{ answers: StudentAnswer[]; completed: boolean }>(
    "/matching/my-answers/"
  );
  return data;
};

export const fetchQuestionnaireStatus = async () => {
  const { data } = await api.get<{ completed: boolean }>("/matching/status/");
  return data;
};

export const fetchMyMatches = async (listingId?: number) => {
  const params = listingId ? { listing: String(listingId) } : {};
  const { data } = await api.get<RoommateMatch[]>("/matching/my-matches/", { params });
  return data;
};

export const computeMatches = async (listingId: number) => {
  const { data } = await api.post<{ detail: string; matches: RoommateMatch[] }>(
    "/matching/compute/",
    { listing: listingId }
  );
  return data;
};

export const fetchListingMatches = async (listingId: number) => {
  const { data } = await api.get<RoommateMatch[]>(`/matching/listing/${listingId}/`);
  return data;
};
