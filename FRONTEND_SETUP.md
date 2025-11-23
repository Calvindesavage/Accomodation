# Frontend Setup Guide

## Overview
A complete Django-based frontend has been created for the Hotel Booking System. The frontend uses Django templates, Bootstrap 5, and vanilla JavaScript to consume the existing REST API.

## What's Been Created

### 1. **Frontend Django App** (`src/frontend/`)
- **Views**: 7 main views for different pages
- **URLs**: Routing configuration
- **Templates**: HTML templates for all pages
- **Static Files**: CSS and JavaScript

### 2. **Templates Created**
- `base.html` - Base template with navigation
- `index.html` - Home page
- `login.html` - Login page
- `register.html` - Registration page
- `dashboard.html` - Admin dashboard with statistics
- `rooms.html` - Room management
- `customers.html` - Customer management
- `bookings.html` - Booking management
- `payments.html` - Payment management

### 3. **Static Files**
- `css/style.css` - Custom styling with Bootstrap 5
- `js/api.js` - API helper functions

## Features

### Authentication
- Login with email and password
- User registration
- Token-based authentication
- Automatic logout on 401 response

### Dashboard
- Real-time statistics (rooms, customers, bookings, payments)
- Quick action links
- System information

### Room Management
- View all rooms
- Add new rooms
- Delete rooms
- Edit functionality (ready to implement)

### Customer Management
- View all customers
- Add new customers
- Delete customers
- Edit functionality (ready to implement)

### Booking Management
- View all bookings
- Create new bookings
- Check-in functionality
- Check-out functionality
- Real-time status updates

### Payment Management
- View all payments
- Record new payments
- Multiple payment methods supported
- Delete payments

## Installation & Setup

### 1. **Install setuptools** (if you haven't already)
```bash
pip install setuptools
```

### 2. **Run Migrations**
```bash
cd src
python manage.py migrate
```

### 3. **Create Superuser** (optional)
```bash
python manage.py createsuperuser
```

### 4. **Start Docker Containers**
```bash
docker-compose up -d
```

### 5. **Access the Application**
- **Frontend**: http://localhost:8010/
- **Admin Panel**: http://localhost:8010/admin/
- **API Swagger**: http://localhost:8010/swagger/

## Usage

### First Time Setup
1. Go to http://localhost:8010/
2. Click "Register" to create a new admin account
3. Fill in your details and submit
4. You'll be automatically logged in and redirected to the dashboard

### Login
1. Go to http://localhost:8010/login/
2. Enter your email and password
3. Click "Login"

### Managing Rooms
1. Click "Rooms" in the navigation
2. Click "Add New Room" to create a room
3. Fill in room details and submit
4. View, edit, or delete rooms from the table

### Managing Customers
1. Click "Customers" in the navigation
2. Click "Add New Customer" to create a customer
3. Fill in customer details and submit
4. View, edit, or delete customers from the table

### Managing Bookings
1. Click "Bookings" in the navigation
2. Click "New Booking" to create a booking
3. Select room, dates, and prices
4. Use "Check-in" and "Check-out" buttons to manage booking status

### Managing Payments
1. Click "Payments" in the navigation
2. Click "Record Payment" to add a payment
3. Select booking, amount, and payment method
4. View all payments in the table

## API Integration

The frontend communicates with the backend API using:
- **Base URL**: `/api`
- **Authentication**: Token-based (stored in localStorage)
- **Content-Type**: application/json

### API Endpoints Used
- `POST /api/account/login` - User login
- `POST /api/account/register` - User registration
- `GET/POST /api/room/` - Room management
- `GET/POST /api/customer/` - Customer management
- `GET/POST /api/booking/` - Booking management
- `PATCH /api/booking/{id}/checkin/` - Check-in
- `PATCH /api/booking/{id}/checkout/` - Check-out
- `GET/POST /api/payment/` - Payment management

## Customization

### Adding New Pages
1. Create a new view in `src/frontend/views.py`
2. Create a new template in `src/frontend/templates/frontend/`
3. Add URL route in `src/frontend/urls.py`
4. Add navigation link in `base.html`

### Styling
- Edit `src/frontend/static/css/style.css`
- Uses Bootstrap 5 classes
- Custom CSS variables defined in `:root`

### JavaScript
- Edit `src/frontend/static/js/api.js` for API functions
- Add page-specific scripts in template `<script>` tags

## Troubleshooting

### "Module not found" errors
```bash
pip install setuptools
```

### API calls failing
- Check if backend is running: `docker-compose ps`
- Verify token is stored in localStorage
- Check browser console for errors

### Templates not loading
- Ensure `frontend` is in `INSTALLED_APPS` in settings
- Check template paths are correct
- Clear browser cache

### Static files not loading
```bash
python manage.py collectstatic
```

## Next Steps

1. **Implement Edit Functionality** - Add edit modals for rooms, customers
2. **Add Search/Filter** - Filter bookings by date, customer, etc.
3. **Add Reports** - Generate revenue reports, occupancy reports
4. **Add User Roles** - Implement different user types (admin, staff, customer)
5. **Add Email Notifications** - Send booking confirmations, payment receipts
6. **Add File Upload** - Upload room images, customer documents
7. **Add Charts** - Visualize booking trends, revenue

## Support

For issues or questions, refer to:
- Django Documentation: https://docs.djangoproject.com/
- Bootstrap Documentation: https://getbootstrap.com/docs/
- API Documentation: http://localhost:8010/swagger/

