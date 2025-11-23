// API Helper Functions

const API_BASE_URL = '/api';

/**
 * Get authorization token from localStorage
 */
function getToken() {
    return localStorage.getItem('token');
}

/**
 * Set authorization token in localStorage
 */
function setToken(token) {
    localStorage.setItem('token', token);
}

/**
 * Remove authorization token from localStorage
 */
function removeToken() {
    localStorage.removeItem('token');
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    return !!getToken();
}

/**
 * Make API request with authentication
 */
async function apiRequest(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Token ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (response.status === 401) {
        // Unauthorized - redirect to login
        removeToken();
        window.location.href = '/login/';
        return null;
    }

    return response;
}

/**
 * Login user
 */
async function login(email, password) {
    const response = await fetch(`${API_BASE_URL}/account/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: email,
            password: password
        })
    });

    if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        return { success: true, data };
    }

    return { success: false, error: 'Invalid credentials' };
}

/**
 * Register user
 */
async function register(email, firstName, lastName, password, password2) {
    const response = await fetch(`${API_BASE_URL}/account/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            first_name: firstName,
            last_name: lastName,
            password,
            password2
        })
    });

    if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        return { success: true, data };
    }

    const error = await response.json();
    return { success: false, error };
}

/**
 * Logout user
 */
function logout() {
    removeToken();
    window.location.href = '/';
}

/**
 * Get all rooms
 */
async function getRooms() {
    const response = await apiRequest('/room/');
    if (response && response.ok) {
        return await response.json();
    }
    return null;
}

/**
 * Create room
 */
async function createRoom(roomData) {
    const response = await apiRequest('/room/', {
        method: 'POST',
        body: JSON.stringify(roomData)
    });
    if (response && response.ok) {
        return await response.json();
    }
    return null;
}

/**
 * Get all customers
 */
async function getCustomers() {
    const response = await apiRequest('/customer/');
    if (response && response.ok) {
        return await response.json();
    }
    return null;
}

/**
 * Create customer
 */
async function createCustomer(customerData) {
    const response = await apiRequest('/customer/', {
        method: 'POST',
        body: JSON.stringify(customerData)
    });
    if (response && response.ok) {
        return await response.json();
    }
    return null;
}

/**
 * Get all bookings
 */
async function getBookings() {
    const response = await apiRequest('/booking/');
    if (response && response.ok) {
        return await response.json();
    }
    return null;
}

/**
 * Create booking
 */
async function createBooking(bookingData) {
    const response = await apiRequest('/booking/', {
        method: 'POST',
        body: JSON.stringify(bookingData)
    });
    if (response && response.ok) {
        return await response.json();
    }
    return null;
}

/**
 * Check in booking
 */
async function checkInBooking(bookingId) {
    const response = await apiRequest(`/booking/${bookingId}/checkin/`, {
        method: 'PATCH'
    });
    if (response && response.ok) {
        return await response.json();
    }
    return null;
}

/**
 * Check out booking
 */
async function checkOutBooking(bookingId) {
    const response = await apiRequest(`/booking/${bookingId}/checkout/`, {
        method: 'PATCH'
    });
    if (response && response.ok) {
        return await response.json();
    }
    return null;
}

/**
 * Get all payments
 */
async function getPayments() {
    const response = await apiRequest('/payment/');
    if (response && response.ok) {
        return await response.json();
    }
    return null;
}

/**
 * Create payment
 */
async function createPayment(paymentData) {
    const response = await apiRequest('/payment/', {
        method: 'POST',
        body: JSON.stringify(paymentData)
    });
    if (response && response.ok) {
        return await response.json();
    }
    return null;
}

/**
 * Format date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getToken,
        setToken,
        removeToken,
        isAuthenticated,
        apiRequest,
        login,
        register,
        logout,
        getRooms,
        createRoom,
        getCustomers,
        createCustomer,
        getBookings,
        createBooking,
        checkInBooking,
        checkOutBooking,
        getPayments,
        createPayment,
        formatDate,
        formatCurrency
    };
}

