# Quick Start Guide - Hotel Booking System

## 🚀 Get Started in 5 Minutes

### Step 1: Fix Python Issue
```bash
pip install setuptools
```

### Step 2: Start Docker
```bash
docker-compose up -d
```

### Step 3: Run Migrations
```bash
cd src
python manage.py migrate
```

### Step 4: Access the Application
Open your browser and go to:
- **Frontend**: http://localhost:8010/
- **Admin**: http://localhost:8010/admin/
- **API Docs**: http://localhost:8010/swagger/

### Step 5: Create Your Account
1. Click "Register" on the home page
2. Fill in your details:
   - First Name
   - Last Name
   - Email
   - Password
3. Click "Register"
4. You'll be logged in automatically!

## 📋 What You Can Do

### 🏨 Manage Rooms
- Click "Rooms" in the menu
- Click "Add New Room" to create rooms
- View, edit, or delete rooms

### 👥 Manage Customers
- Click "Customers" in the menu
- Click "Add New Customer" to add customers
- View, edit, or delete customers

### 📅 Manage Bookings
- Click "Bookings" in the menu
- Click "New Booking" to create bookings
- Use "Check-in" and "Check-out" buttons
- Track booking status

### 💳 Manage Payments
- Click "Payments" in the menu
- Click "Record Payment" to add payments
- Track all payments by booking

### 📊 View Dashboard
- Click "Dashboard" to see statistics
- View total rooms, customers, bookings, and payments
- Quick access to all management pages

## 🔑 Login Credentials

After registration, use your email and password to login.

## 📱 Features

✅ User Registration & Login
✅ Room Management (Add, View, Delete)
✅ Customer Management (Add, View, Delete)
✅ Booking Management (Create, Check-in, Check-out)
✅ Payment Tracking (Record, View, Delete)
✅ Real-time Dashboard Statistics
✅ Responsive Design (Mobile, Tablet, Desktop)
✅ Modern UI with Bootstrap 5

## 🛠️ Troubleshooting

### Docker containers not starting?
```bash
docker-compose down
docker-compose up -d
```

### Can't access the frontend?
- Check if Docker is running: `docker-compose ps`
- Wait 30 seconds for containers to start
- Try http://localhost:8010/ again

### Getting "Module not found" error?
```bash
pip install setuptools
```

### Forgot your password?
- Use the "Reset Password" link on the login page
- Or create a new account

## 📚 Documentation

- **Full Setup Guide**: See `FRONTEND_SETUP.md`
- **Implementation Details**: See `FRONTEND_SUMMARY.md`
- **API Documentation**: http://localhost:8010/swagger/

## 🎯 Next Steps

1. ✅ Register an account
2. ✅ Add some rooms
3. ✅ Add some customers
4. ✅ Create a booking
5. ✅ Record a payment
6. ✅ Check-in the booking
7. ✅ Check-out the booking

## 💡 Tips

- Use the Dashboard to see all statistics at a glance
- Click on any menu item to manage that resource
- Use the modals to add new data
- Confirm before deleting anything
- Check the browser console (F12) if something doesn't work

## 🆘 Need Help?

1. Check the documentation files
2. Look at the API documentation at `/swagger/`
3. Check browser console for errors (F12)
4. Verify Docker containers are running

## 🎉 You're All Set!

Your Hotel Booking System is ready to use. Start by registering an account and exploring the features!

---

**Happy Booking! 🏨**

