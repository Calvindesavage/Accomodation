# Hotel Booking System - Frontend

A complete Django-based frontend for the Hotel Booking System with Bootstrap 5 styling and REST API integration.

## 🎯 Overview

This frontend provides a user-friendly interface for managing:
- **Rooms** - Add, view, and delete hotel rooms
- **Customers** - Manage customer information
- **Bookings** - Create and manage room bookings with check-in/check-out
- **Payments** - Record and track payments
- **Dashboard** - Real-time statistics and quick actions

## ✨ Features

### 🔐 Authentication
- User registration with email validation
- Secure login with token-based authentication
- Automatic session management
- Protected routes with login required

### 📊 Dashboard
- Real-time statistics (rooms, customers, bookings, payments)
- Quick action links
- System information display
- Responsive card layout

### 🏨 Room Management
- List all rooms with details
- Add new rooms with modal form
- Delete rooms with confirmation
- Room information display (number, floor, capacity, price)

### 👥 Customer Management
- List all customers
- Add new customers with detailed form
- Delete customers with confirmation
- Customer information (name, phone, email, gender, country)

### 📅 Booking Management
- Create new bookings
- Select rooms and dates
- Check-in functionality
- Check-out functionality
- Real-time status updates
- Booking history

### 💳 Payment Management
- Record payments for bookings
- Multiple payment methods (cash, card, bKash, Nagad, Rocket, etc.)
- Payment tracking
- Delete payment records

### 🎨 UI/UX
- Responsive Bootstrap 5 design
- Modern navigation bar
- Modal forms for data entry
- Confirmation dialogs
- Loading states
- Success/error alerts
- Bootstrap Icons integration
- Mobile-friendly layout

## 📁 Project Structure

```
src/frontend/
├── __init__.py
├── admin.py
├── apps.py
├── models.py
├── tests.py
├── views.py                    # 7 view functions
├── urls.py                     # URL routing
├── migrations/
├── templates/
│   └── frontend/
│       ├── base.html           # Base template
│       ├── index.html          # Home page
│       ├── login.html          # Login page
│       ├── register.html       # Registration page
│       ├── dashboard.html      # Dashboard
│       ├── rooms.html          # Room management
│       ├── customers.html      # Customer management
│       ├── bookings.html       # Booking management
│       └── payments.html       # Payment management
└── static/
    ├── css/
    │   └── style.css           # Custom styling
    └── js/
        └── api.js              # API helper functions
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Django 3.1.7+
- Docker & Docker Compose
- setuptools

### Installation

1. **Install setuptools**
```bash
pip install setuptools
```

2. **Run migrations**
```bash
cd src
python manage.py migrate
```

3. **Start Docker containers**
```bash
docker-compose up -d
```

4. **Access the application**
- Frontend: http://localhost:8010/
- Admin: http://localhost:8010/admin/
- API Docs: http://localhost:8010/swagger/

### First Time Setup

1. Go to http://localhost:8010/
2. Click "Register"
3. Fill in your details
4. Click "Register"
5. You'll be logged in automatically!

## 📖 Usage

### Login
```
URL: http://localhost:8010/login/
- Enter your email
- Enter your password
- Click "Login"
```

### Register
```
URL: http://localhost:8010/register/
- Enter first name
- Enter last name
- Enter email
- Enter password
- Confirm password
- Click "Register"
```

### Dashboard
```
URL: http://localhost:8010/dashboard/
- View statistics
- Access quick actions
- See system information
```

### Manage Rooms
```
URL: http://localhost:8010/rooms/
- View all rooms
- Click "Add New Room" to create
- Click delete button to remove
```

### Manage Customers
```
URL: http://localhost:8010/customers/
- View all customers
- Click "Add New Customer" to create
- Click delete button to remove
```

### Manage Bookings
```
URL: http://localhost:8010/bookings/
- View all bookings
- Click "New Booking" to create
- Click "Check-in" to check in
- Click "Check-out" to check out
```

### Manage Payments
```
URL: http://localhost:8010/payments/
- View all payments
- Click "Record Payment" to add
- Click delete button to remove
```

## 🔌 API Integration

The frontend communicates with the backend REST API:

### Authentication Endpoints
- `POST /api/account/login` - User login
- `POST /api/account/register` - User registration

### Resource Endpoints
- `GET/POST /api/room/` - Room CRUD
- `GET/POST /api/customer/` - Customer CRUD
- `GET/POST /api/booking/` - Booking CRUD
- `PATCH /api/booking/{id}/checkin/` - Check-in
- `PATCH /api/booking/{id}/checkout/` - Check-out
- `GET/POST /api/payment/` - Payment CRUD

### Authentication
- Token-based authentication
- Token stored in localStorage
- Automatic logout on 401 response

## 🎨 Styling

- **Framework**: Bootstrap 5
- **Icons**: Bootstrap Icons
- **Custom CSS**: 300+ lines
- **Color Scheme**: Professional blue/green/red
- **Responsive**: Mobile, tablet, desktop

## 🛠️ Technologies Used

- **Backend**: Django 3.1.7
- **Frontend**: Django Templates
- **Styling**: Bootstrap 5 + Custom CSS
- **JavaScript**: Vanilla JS (no jQuery)
- **Icons**: Bootstrap Icons
- **Database**: PostgreSQL
- **API**: Django REST Framework
- **Authentication**: Token-based

## 📝 Files Created

### Templates (9 files)
- base.html - Base layout
- index.html - Home page
- login.html - Login form
- register.html - Registration form
- dashboard.html - Dashboard
- rooms.html - Room management
- customers.html - Customer management
- bookings.html - Booking management
- payments.html - Payment management

### Static Files (2 files)
- css/style.css - Custom styling
- js/api.js - API helper functions

### Python Files (2 files)
- views.py - 7 view functions
- urls.py - URL routing

## 🔒 Security Features

- CSRF protection (Django built-in)
- Token-based authentication
- Protected routes with @login_required
- Secure token storage
- Automatic logout on 401
- Input validation

## 📊 Statistics Tracked

- Total rooms
- Total customers
- Active bookings
- Total payments
- Real-time updates

## 🎯 Next Steps

1. Test all features
2. Add edit functionality
3. Add search/filter
4. Add reports
5. Add user roles
6. Add notifications
7. Add file uploads
8. Deploy to production

## 🆘 Troubleshooting

### Docker not starting
```bash
docker-compose down
docker-compose up -d
```

### Module not found error
```bash
pip install setuptools
```

### Can't access frontend
- Check Docker: `docker-compose ps`
- Wait 30 seconds for startup
- Try http://localhost:8010/

### API calls failing
- Check backend is running
- Check token in localStorage
- Check browser console (F12)

## 📚 Documentation

- **Setup Guide**: FRONTEND_SETUP.md
- **Implementation Summary**: FRONTEND_SUMMARY.md
- **Quick Start**: QUICK_START.md
- **Checklist**: IMPLEMENTATION_CHECKLIST.md

## 📞 Support

For issues or questions:
1. Check documentation files
2. Review API docs at /swagger/
3. Check browser console (F12)
4. Verify Docker containers running

## 📄 License

This project is part of the Hotel Booking System.

## ✅ Status

**Frontend Implementation: COMPLETE ✅**

All core features implemented and ready for use!

---

**Happy Booking! 🏨**

