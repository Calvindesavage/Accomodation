// Executes when document is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Set today's date
  document.getElementById("dateFilter").valueAsDate = new Date();

  // Load all data
  loadDashboardData();

  // Setup event listeners
  setupEventListeners();
});

// Load all dashboard data
async function loadDashboardData() {
  try {
    await Promise.all([
      loadHotelsData(),
      loadBookingsData(),
      loadRoomsData(),
      loadUsersData(),
      loadCustomersData(),
      loadPaymentsData(),
      loadRecentHotels(),
      loadRecentRooms(),
      loadRecentBookings(),
      loadRecentCustomers(),
      loadRecentPayments(),
    ]);
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }
}

// Load hotels data
async function loadHotelsData() {
  try {
    const response = await fetch("/api/hotel/");
    if (response.ok) {
      const data = await response.json();
      const count = data.count || data.results?.length || data.length || 0;
      document.getElementById("totalHotels").textContent = count;
      document.getElementById("hotelsPercent").textContent = "100%";
    }
  } catch (error) {
    console.error("Error loading hotels:", error);
  }
}

// Load bookings data
async function loadBookingsData() {
  try {
    const response = await fetch("/api/booking/");
    if (response.ok) {
      const data = await response.json();
      const count = data.count || data.results?.length || data.length || 0;
      document.getElementById("totalBookings").textContent = count;
      document.getElementById("bookingsPercent").textContent = "85%";
    }
  } catch (error) {
    console.error("Error loading bookings:", error);
  }
}

// Load rooms data
async function loadRoomsData() {
  try {
    const response = await fetch("/api/room/");
    if (response.ok) {
      const data = await response.json();
      const count = data.count || data.results?.length || data.length || 0;
      document.getElementById("totalRooms").textContent = count;
      document.getElementById("roomsPercent").textContent = "70%";
    }
  } catch (error) {
    console.error("Error loading rooms:", error);
  }
}

// Load users data
async function loadUsersData() {
  try {
    const response = await fetch("/api/account/");
    if (response.ok) {
      const data = await response.json();
      const count = data.count || data.results?.length || data.length || 0;
      document.getElementById("totalUsers").textContent = count;
      document.getElementById("usersChange").textContent = "+12%";
    }
  } catch (error) {
    console.error("Error loading users:", error);
  }
}

// Load customers data
async function loadCustomersData() {
  try {
    const response = await fetch("/api/customer/");
    if (response.ok) {
      const data = await response.json();
      const count = data.count || data.results?.length || data.length || 0;
      document.getElementById("totalCustomers").textContent = count;
      document.getElementById("customersChange").textContent = "+8%";
    }
  } catch (error) {
    console.error("Error loading customers:", error);
    document.getElementById("totalCustomers").textContent = "0";
  }
}

// Load payments data
async function loadPaymentsData() {
  try {
    const response = await fetch("/api/payment/");
    if (response.ok) {
      const data = await response.json();
      const count = data.count || data.results?.length || data.length || 0;
      document.getElementById("totalPayments").textContent = count;
      document.getElementById("paymentsChange").textContent = "+15%";
    }
  } catch (error) {
    console.error("Error loading payments:", error);
    document.getElementById("totalPayments").textContent = "0";
  }
}

// Load recent hotels
async function loadRecentHotels() {
  try {
    const response = await fetch("/api/hotel/");
    if (response.ok) {
      const data = await response.json();
      const hotels = data.results || data;
      const tbody = document.getElementById("recentHotelsBody");

      if (!hotels || hotels.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-muted">No hotels found</td></tr>';
        return;
      }

      const recentHotels = hotels.slice(0, 5);
      tbody.innerHTML = recentHotels
        .map((hotel) => {
          const rating = "⭐".repeat(hotel.star_rating || 3);
          const statusClass = hotel.is_active ? "success" : "danger";
          const statusText = hotel.is_active ? "Active" : "Inactive";

          return `
            <tr>
              <td><strong>${hotel.name || "N/A"}</strong></td>
              <td>${hotel.city || "N/A"}</td>
              <td>${hotel.country || "N/A"}</td>
              <td>${hotel.landlord_email || hotel.landlord_name || "N/A"}</td>
              <td>${rating}</td>
              <td>${hotel.phone_no || "N/A"}</td>
              <td class="${statusClass}">${statusText}</td>
              <td class="primary"><a href="/admin/hotel/hotel/${hotel.id}/change/">Edit</a></td>
            </tr>
          `;
        })
        .join("");
    }
  } catch (error) {
    console.error("Error loading recent hotels:", error);
  }
}

// Load recent rooms
async function loadRecentRooms() {
  try {
    const response = await fetch("/api/room/");
    if (response.ok) {
      const data = await response.json();
      const rooms = data.results || data;
      const tbody = document.getElementById("recentRoomsBody");

      if (!rooms || rooms.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-muted">No rooms found</td></tr>';
        return;
      }

      const recentRooms = rooms.slice(0, 5);
      tbody.innerHTML = recentRooms
        .map((room) => {
          const availableClass = room.is_available ? "success" : "danger";
          const availableText = room.is_available ? "Yes" : "No";
          const price = room.price ? `$${room.price.toFixed(2)}` : "$0.00";

          return `
            <tr>
              <td>${room.hotel_name || "N/A"}</td>
              <td><strong>${room.room_no || "N/A"}</strong></td>
              <td>${room.floor_no || "N/A"}</td>
              <td>${room.capacity || "N/A"}</td>
              <td>${price}</td>
              <td class="${availableClass}">${availableText}</td>
              <td class="primary"><a href="/admin/room/room/${room.id}/change/">Edit</a></td>
            </tr>
          `;
        })
        .join("");
    }
  } catch (error) {
    console.error("Error loading recent rooms:", error);
  }
}

// Load recent bookings
async function loadRecentBookings() {
  try {
    const response = await fetch("/api/booking/");
    if (response.ok) {
      const data = await response.json();
      const bookings = data.results || data;
      const tbody = document.getElementById("recentBookingsBody");

      if (!bookings || bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-muted">No bookings found</td></tr>';
        return;
      }

      const recentBookings = bookings.slice(0, 5);
      tbody.innerHTML = recentBookings
        .map((booking) => {
          const checkIn = booking.booking_start_time
            ? new Date(booking.booking_start_time).toLocaleDateString()
            : "N/A";
          const checkOut = booking.booking_end_time
            ? new Date(booking.booking_end_time).toLocaleDateString()
            : "N/A";
          const price = booking.price ? `$${booking.price.toFixed(2)}` : "$0.00";
          const discount = booking.discounted_price ? `$${booking.discounted_price.toFixed(2)}` : "$0.00";

          return `
            <tr>
              <td><strong>#${booking.id || "N/A"}</strong></td>
              <td>${booking.customer_phone_no || "N/A"}</td>
              <td>Room ${booking.room_no || booking.room || "N/A"}</td>
              <td>${checkIn}</td>
              <td>${checkOut}</td>
              <td>${price}</td>
              <td>${discount}</td>
              <td class="primary"><a href="/admin/booking/booking/${booking.id}/change/">Edit</a></td>
            </tr>
          `;
        })
        .join("");
    }
  } catch (error) {
    console.error("Error loading recent bookings:", error);
  }
}

// Load recent customers
async function loadRecentCustomers() {
  try {
    const response = await fetch("/api/customer/");
    if (response.ok) {
      const data = await response.json();
      const customers = data.results || data;
      const tbody = document.getElementById("recentCustomersBody");

      if (!customers || customers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-muted">No customers found</td></tr>';
        return;
      }

      const recentCustomers = customers.slice(0, 5);
      tbody.innerHTML = recentCustomers
        .map((customer) => {
          const fullName = `${customer.first_name || ""} ${customer.last_name || ""}`.trim() || "N/A";
          const genderClass = customer.gender === "male" ? "primary" : customer.gender === "female" ? "danger" : "warning";

          return `
            <tr>
              <td><strong>${fullName}</strong></td>
              <td>${customer.phone_no || "N/A"}</td>
              <td>${customer.email || "N/A"}</td>
              <td class="${genderClass}">${customer.gender || "N/A"}</td>
              <td>${customer.country || "N/A"}</td>
              <td>${customer.occupation || "N/A"}</td>
              <td class="primary"><a href="/admin/customer/customer/${customer.id}/change/">Edit</a></td>
            </tr>
          `;
        })
        .join("");
    }
  } catch (error) {
    console.error("Error loading recent customers:", error);
  }
}

// Load recent payments
async function loadRecentPayments() {
  try {
    const response = await fetch("/api/payment/");
    if (response.ok) {
      const data = await response.json();
      const payments = data.results || data;
      const tbody = document.getElementById("recentPaymentsBody");

      if (!payments || payments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-muted">No payments found</td></tr>';
        return;
      }

      const recentPayments = payments.slice(0, 5);
      tbody.innerHTML = recentPayments
        .map((payment) => {
          const amount = payment.amount ? `$${payment.amount.toFixed(2)}` : "$0.00";
          const date = payment.created_at
            ? new Date(payment.created_at).toLocaleDateString()
            : "N/A";
          const methodClass = payment.payment_method === "cash" ? "success" : "primary";

          return `
            <tr>
              <td><strong>#${payment.id || "N/A"}</strong></td>
              <td>#${payment.booking || payment.booking_id || "N/A"}</td>
              <td>${amount}</td>
              <td class="${methodClass}">${payment.payment_method || "N/A"}</td>
              <td>${date}</td>
              <td class="primary"><a href="/admin/payment/payment/${payment.id}/change/">Edit</a></td>
            </tr>
          `;
        })
        .join("");
    }
  } catch (error) {
    console.error("Error loading recent payments:", error);
  }
}

// Setup event listeners
function setupEventListeners() {
  // Sidebar menu toggle
  const sideMenu = document.querySelector("aside");
  const menuBtn = document.querySelector("#menu-btn");
  const closeBtn = document.querySelector("#close-btn");
  const themeToggler = document.querySelector(".theme-toggler");

  // Show Sidebar
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      sideMenu.style.display = "block";
    });
  }

  // Hide Sidebar
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      sideMenu.style.display = "none";
    });
  }

  // Change Theme
  if (themeToggler) {
    themeToggler.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme-variables");

      themeToggler
        .querySelector("span:nth-child(1)")
        .classList.toggle("active");
      themeToggler
        .querySelector("span:nth-child(2)")
        .classList.toggle("active");
    });
  }

  // Add Hotel button
  const addProductBtn = document.querySelector(".add-product");
  if (addProductBtn) {
    addProductBtn.addEventListener("click", () => {
      window.location.href = "/admin/hotel/hotel/add/";
    });
  }

  // Date filter
  const dateFilter = document.getElementById("dateFilter");
  if (dateFilter) {
    dateFilter.addEventListener("change", () => {
      console.log("Date filter changed:", dateFilter.value);
      // You can add filtering logic here
    });
  }
}

// Refresh data every 30 seconds
setInterval(() => {
  loadDashboardData();
}, 30000);

