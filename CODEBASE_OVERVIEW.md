# ResPlug Codebase Overview

**Last Updated:** March 2026
**Stack:** Next.js 14 (Frontend) + Django REST Framework (Backend)

---

## Project Structure

```
resplug/
├── frontend/                 # Next.js 14 App Router
│   ├── src/
│   │   ├── app/             # All pages (App Router)
│   │   │   ├── page.tsx     # Landing page (orange background, custom hero)
│   │   │   ├── layout.tsx   # Root layout with LayoutShell
│   │   │   ├── globals.css  # Dark theme utility classes
│   │   │   ├── listings/    # Browse + detail + new + edit
│   │   │   ├── residences/  # New property + manage + edit
│   │   │   ├── bookings/    # Student bookings view
│   │   │   ├── dashboard/   # Landlord dashboard
│   │   │   ├── favorites/   # Saved listings
│   │   │   ├── messages/    # Chat interface
│   │   │   ├── notifications/
│   │   │   └── matching/    # Roommate compatibility quiz
│   │   ├── components/
│   │   │   ├── layout/      # Navbar, Footer, LayoutShell
│   │   │   └── listings/    # ListingCard
│   │   ├── lib/
│   │   │   ├── api.ts       # Axios instance
│   │   │   ├── queries.ts   # React Query functions
│   │   │   └── auth.tsx     # Auth context
│   │   └── types/           # TypeScript types
│   └── public/
│
└── backend/                  # Django 5 + DRF
    ├── apps/
    │   ├── users/           # Custom user model (Student/Landlord)
    │   ├── residences/      # Property CRUD + amenities
    │   ├── listings/        # Room listings within residences
    │   ├── bookings/        # Booking requests
    │   ├── reviews/         # Residence reviews
    │   ├── messages/        # Conversations + messages
    │   ├── notifications/   # Notification system
    │   ├── favorites/       # Saved listings
    │   └── matching/        # Roommate compatibility scoring
    └── config/              # Django settings
```

---

## Frontend Architecture

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + custom CSS utilities
- **State:** React Query (TanStack Query) for server state
- **Auth:** JWT tokens stored in memory + localStorage refresh
- **UI Theme:** Dark orange/glassmorphic

### Key Files

**globals.css** — Dark theme utility classes:
```css
.dark-card          /* Gradient orange-tinted card */
.dark-input         /* Dark input with orange focus */
.dark-btn-primary   /* Orange gradient button */
.dark-btn-outline   /* Outlined orange button */
.dark-badge         /* Orange badge */
.dark-label         /* Form label */
```

**LayoutShell.tsx** — Conditionally hides Navbar/Footer on landing page (which has its own).

**Auth Flow (lib/auth.tsx):**
- JWT access token in memory
- Refresh token in localStorage
- Auto-refresh on 401 responses
- `useAuth()` hook provides user + login/logout/register

**API Layer (lib/queries.ts):**
- All backend calls organized by feature
- React Query hooks pattern: `useQuery({ queryKey: ['listings'], queryFn: fetchListings })`
- Mutations invalidate queries on success

---

## Backend Architecture

### Tech Stack
- **Framework:** Django 5 + Django REST Framework
- **DB:** PostgreSQL (default config)
- **Auth:** JWT (simplejwt)
- **File Storage:** Local filesystem (uploads to MEDIA_ROOT)

### Key Models

**User** (Custom user model)
- `role`: STUDENT | LANDLORD
- `email`, `full_name`, `phone`, `university`

**Residence** (Property)
- Belongs to LANDLORD
- Fields: name, address, city, province, postal_code, lat/lng, rules
- Has many: amenities, images, virtual_tour_video

**Listing** (Room within a property)
- Belongs to RESIDENCE (so indirectly to landlord)
- Fields: title, description, price, deposit, room_type, availability, max_occupants
- Has many: images

**Other:** Booking, Review, Conversation/Message, Notification, Favorite, StudentAnswer/RoommateMatch

### API Patterns
- All endpoints under `/api/`
- ViewSets with ModelViewSet for CRUD
- Custom actions: `/residences/my_residences/`, `/listings/my_listings/`
- Upload endpoints: `/{id}/upload_image/`
- Permission classes: `IsAuthenticated`, `IsLandlord`, `IsOwnerOrReadOnly`

---

## Feature Walkthrough

### 1. Landing Page (`/`)
- Custom orange gradient background (NOT using global Nav/Footer)
- Hero section with "Find Your Perfect Student Home"
- Search bar, feature cards, how-it-works, CTA
- **LayoutShell** detects this route and hides global nav

### 2. Listings Browse (`/listings`)
- Search bar + filter panel (city, price, room type, availability)
- Grid of `ListingCard` components
- Dark cards with orange price badges
- Empty state: "No listings found"

### 3. Listing Detail (`/listings/[id]`)
- Image gallery with primary image highlighted
- Property info (amenities, rules)
- Price + availability badge
- "Book Now" button for students
- Reviews section
- Map (static placeholder currently)

### 4. Landlord Dashboard (`/dashboard`)
- Stats: pending bookings, total properties
- Quick action cards: Add Property, Add Listing, View My Properties
- Recent bookings list

### 5. My Properties (`/residences/manage`)
- **CRUD Operations:**
  - Create: `/residences/new`
  - Read: List of residences with listings nested
  - Update: `/residences/[id]/edit` — Edit property info, amenities, add images
  - Delete: Trash icon → confirmation → deletes property + all listings
- **Room Listings within property:**
  - Create: `/listings/new` (select residence first)
  - Edit: `/listings/[id]/edit`
  - Delete: Trash icon next to listing

### 6. Bookings (`/bookings`)
- Student view: their booking requests with status
- Landlord view: incoming booking requests (via dashboard mainly)
- Status badges: pending (yellow), accepted (green), rejected (red)

### 7. Matching System (`/matching/questionnaire` + `/results`)
- Students answer compatibility questions
- System computes match % with other students
- Shows breakdown by category (lifestyle, schedule, etc.)

---

## Styling System (Dark Orange Theme)

**Color Palette:**
- Background: `#0f0a00` (near-black)
- Primary accent: `#f97316` (orange-500)
- Secondary: `#fb923c` (orange-400)
- Text primary: `white`
- Text secondary: `rgba(255,255,255,0.6)`
- Text muted: `rgba(255,255,255,0.4)`

**Card Style:**
```tsx
<div className="dark-card">
  {/* Gradient orange-tinted background with subtle border */}
</div>
```

**Input Style:**
```tsx
<input className="dark-input" placeholder="..." />
```

**Button Styles:**
```tsx
<button className="dark-btn-primary">Primary</button>
<button className="dark-btn-outline">Outline</button>
```

---

## Common Development Tasks

### Adding a New Page
1. Create folder under `src/app/` (e.g., `src/app/new-feature/page.tsx`)
2. Use `dark-card`, `dark-input` classes for consistency
3. Add to queries.ts if it needs API calls
4. Update types/index.ts if new data structures

### Adding a New API Endpoint
1. Backend: Add to appropriate ViewSet in `apps/<feature>/views.py`
2. Frontend: Add query function to `lib/queries.ts`
3. Use React Query: `useQuery({ queryKey: ['key'], queryFn: ... })`

### Styling Guidelines
- **NEVER** use `bg-white`, `text-gray-900`, `bg-gray-50` (light theme remnants)
- Always use `dark-*` utility classes or explicit dark colors
- Icons from `lucide-react` with `text-[#f97316]` for accent

---

## Environment Setup

### Frontend
```bash
cd frontend
npm install
npm run dev        # localhost:3000
```

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver  # localhost:8000
```

**Backend .env:**
```
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgres://user:pass@localhost/resplug
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

---

## Recent Changes (March 2026)

1. **Full CRUD for Properties & Listings**
   - Edit property page: `/residences/[id]/edit`
   - Edit listing page: `/listings/[id]/edit`
   - Delete property with confirmation
   - All wired up on manage page

2. **Dark Theme Refactor**
   - All pages restyled to dark orange theme
   - Custom utility classes in globals.css
   - Landing page keeps unique orange gradient

3. **LayoutShell**
   - Hides global Nav/Footer on landing page
   - Shows on all other pages

---

## Gotchas & Notes

- **Landing page** has its own Nav/Footer inline — don't add global ones
- **Auth redirects:** Non-landlords trying to access landlord pages get redirected to `/login`
- **Image uploads:** Backend expects `multipart/form-data`, frontend uses FormData
- **Query invalidation:** After mutations, always `queryClient.invalidateQueries({ queryKey: ['key'] })`
- **Lint warnings:** `@tailwind` / `@apply` warnings in IDE are false positives (linter config), build works fine

---

## Need Help?

- Frontend routes: Check `src/app/` folder structure
- API endpoints: Check `backend/apps/<feature>/urls.py`
- Database models: Check `backend/apps/<feature>/models.py`
- Type definitions: Check `frontend/src/types/index.ts`
