export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: "STUDENT" | "LANDLORD";
  gender: "MALE" | "FEMALE" | "";
  phone: string;
  avatar: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface Tokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  user: User;
  tokens: Tokens;
}

export interface StudentProfile {
  id: number;
  user: number;
  university: string;
  student_number: string;
  budget_min: number | null;
  budget_max: number | null;
  preferred_location: string;
  preferred_room_type: string;
  bio: string;
}

export interface LandlordProfile {
  id: number;
  user: number;
  business_name: string;
  verification_status: "pending" | "verified" | "rejected";
  is_verified: boolean;
  contact_email: string;
  contact_phone: string;
  bio: string;
}

export interface Amenity {
  id: number;
  name: string;
  icon: string;
}

export interface ResidenceImage {
  id: number;
  image: string;
  is_primary: boolean;
}

export interface Residence {
  id: number;
  landlord: number;
  landlord_name: string;
  name: string;
  description: string;
  address: string;
  city: string;
  province: string;
  postal_code?: string;
  latitude: number | null;
  longitude: number | null;
  total_rooms: number;
  total_beds: number;
  amenities: Amenity[];
  images: ResidenceImage[];
  virtual_tour_video: string | null;
  average_rating: number;
  review_count: number;
  is_active: boolean;
  created_at: string;
}

export interface ListingImage {
  id: number;
  image: string;
  is_primary: boolean;
}

export interface Listing {
  id: number;
  residence: number;
  residence_name: string;
  residence_city: string;
  residence_address: string;
  residence_latitude: number | null;
  residence_longitude: number | null;
  landlord_name: string;
  title: string;
  description: string;
  price: number;
  deposit: number;
  room_type: "single" | "shared" | "bachelor" | "ensuite";
  availability: "available" | "occupied" | "reserved";
  available_from: string | null;
  is_featured: boolean;
  max_occupants: number;
  amenities: Amenity[];
  images: ListingImage[];
  average_rating: number;
  created_at: string;
}

export interface Booking {
  id: number;
  student: number;
  student_name: string;
  student_email: string;
  listing: number;
  listing_title: string;
  listing_price: number;
  residence_name: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  move_in_date: string;
  move_out_date: string | null;
  message: string;
  rejection_reason?: string;
  created_at: string;
}

export interface Payment {
  id: number;
  booking: number;
  payer: number;
  payer_name: string;
  booking_listing: string;
  amount: number;
  payment_type: "deposit" | "rent" | "other";
  method: "payfast" | "ozow" | "eft" | "cash";
  status: "pending" | "completed" | "failed" | "refunded";
  transaction_id: string;
  paid_at: string | null;
  created_at: string;
}

export interface Review {
  id: number;
  student: number;
  student_name: string;
  residence: number;
  residence_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Message {
  id: number;
  conversation: number;
  sender: number;
  sender_name: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: number;
  participants: User[];
  last_message: Message | null;
  unread_count: number;
  created_at: string;
  updated_at: string;
  messages?: Message[];
}

export interface Notification {
  id: number;
  notification_type: string;
  title: string;
  message: string;
  is_read: boolean;
  link: string;
  created_at: string;
}

export interface Favorite {
  id: number;
  user: number;
  listing: number;
  listing_detail: Listing;
  created_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface CompatibilityQuestion {
  id: number;
  text: string;
  category: string;
  options: string[];
  order: number;
}

export interface StudentAnswer {
  id: number;
  question: number;
  answer: string;
  created_at: string;
  updated_at: string;
}

export interface RoommateMatch {
  id: number;
  listing: number;
  listing_title: string;
  residence_name: string;
  student_a: number;
  student_a_name: string;
  student_a_email: string;
  student_a_gender: string;
  student_b: number;
  student_b_name: string;
  student_b_email: string;
  student_b_gender: string;
  compatibility_score: number;
  compatibility_percentage: number;
  breakdown: Record<string, number>;
  created_at: string;
}

export interface MaintenanceRequest {
  id: number;
  tenant: number;
  tenant_name: string;
  residence: number;
  residence_name: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  landlord_notes: string;
  image: string | null;
  created_at: string;
}
