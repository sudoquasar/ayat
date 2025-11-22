// Global variables
let eventsData = [];
let currentEvent = null;

// Google Sheets Integration
// IMPORTANT: Replace this URL with your Google Apps Script web app URL
// Instructions: See README.md for setup steps
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxya3_kUxJMTO_tG3LDEBp3Uh9Ic-VdccO3E5k1MTKRhAhrOTOKnmBfqkIloPo9_zCrkA/exec';

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    await loadEvents();
    displayEvents();
});

// Load events from JSON file
async function loadEvents() {
    try {
        const response = await fetch('events.json');
        const data = await response.json();
        eventsData = data.events;
        
        // Load bookings from localStorage and update seats
        updateSeatsFromLocalStorage();
    } catch (error) {
        console.error('Error loading events:', error);
        showError('Unable to load events. Please refresh the page.');
    }
}

// Update booked seats from localStorage
function updateSeatsFromLocalStorage() {
    const bookings = getBookings();
    eventsData.forEach(event => {
        const eventBookings = bookings.filter(b => b.eventId === event.id);
        const totalBookedSeats = eventBookings.reduce((sum, b) => sum + parseInt(b.tickets), 0);
        event.bookedSeats = totalBookedSeats;
    });
}

// Display events on the page
function displayEvents() {
    const upcomingContainer = document.getElementById('upcomingEvents');
    const pastContainer = document.getElementById('pastEvents');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcomingEvents = eventsData.filter(e => {
        const eventDate = new Date(e.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const pastEvents = eventsData.filter(e => {
        const eventDate = new Date(e.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate < today;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (upcomingEvents.length === 0) {
        upcomingContainer.innerHTML = '<div class="empty-state">No upcoming events at the moment. Check back soon!</div>';
    } else {
        upcomingContainer.innerHTML = upcomingEvents.map(event => createEventCard(event, false)).join('');
    }
    
    if (pastEvents.length === 0) {
        pastContainer.innerHTML = '<div class="empty-state">No past events to display.</div>';
    } else {
        pastContainer.innerHTML = pastEvents.map(event => createEventCard(event, true)).join('');
    }
}

// Create event card HTML
function createEventCard(event, isPast) {
    const availableSeats = event.totalSeats - event.bookedSeats;
    const isFull = availableSeats <= 0;
    const formattedDate = formatDate(event.date);
    
    return `
        <div class="event-card ${isPast ? 'past' : ''}">
            <h3 class="event-title">${event.title}</h3>
            <div class="event-artist">${event.artist}</div>
            <div class="event-details">
                <div class="event-detail">
                    <span class="event-detail-icon">📅</span>
                    <span>${formattedDate}</span>
                </div>
                <div class="event-detail">
                    <span class="event-detail-icon">🕐</span>
                    <span>${event.time}</span>
                </div>
                <div class="event-detail">
                    <span class="event-detail-icon">📍</span>
                    <span>${event.venue}</span>
                </div>
                <div class="event-detail">
                    <span class="event-detail-icon">💰</span>
                    <span>₹${event.ticketPrice} per person</span>
                </div>
            </div>
            <p class="event-description">${event.description}</p>
            ${!isPast ? `
                <div class="seats-info ${isFull ? 'full' : ''}">
                    <div class="seats-available">
                        ${isFull ? 
                            '<span class="seats-full">SOLD OUT</span>' : 
                            `<strong>${availableSeats}</strong> seats available out of ${event.totalSeats}`
                        }
                    </div>
                </div>
                <button 
                    class="book-button" 
                    onclick="openBookingModal('${event.id}')"
                    ${isFull ? 'disabled' : ''}
                >
                    ${isFull ? 'Sold Out' : 'Book Your Seat'}
                </button>
            ` : ''}
        </div>
    `;
}

// Format date to readable string
function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

// Open booking modal
function openBookingModal(eventId) {
    currentEvent = eventsData.find(e => e.id === eventId);
    if (!currentEvent) return;
    
    const modal = document.getElementById('bookingModal');
    const modalBody = document.getElementById('modalBody');
    
    const availableSeats = currentEvent.totalSeats - currentEvent.bookedSeats;
    const amount = currentEvent.ticketPrice;
    
    // Generate UPI payment link
    const upiLink = generateUPILink(currentEvent, amount);
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <h2>${currentEvent.title}</h2>
            <p>${formatDate(currentEvent.date)} at ${currentEvent.time}</p>
        </div>
        <div class="modal-body">
            <div class="payment-section">
                <h3>Step 1: Make Payment via UPI</h3>
                <p><strong>Amount per ticket:</strong> ₹${currentEvent.ticketPrice}</p>
                <p style="margin-top: 10px; font-size: 0.95rem;">Click the button below to pay via UPI. After completing payment, return here to fill the registration form.</p>
                <a href="${upiLink}" class="upi-button">Pay ₹${amount} via UPI</a>
                <p style="margin-top: 15px; font-size: 0.9rem; color: #666;">
                    Note: Payment will open in your UPI app. Save the transaction ID shown after payment.
                </p>
            </div>
            
            <form id="bookingForm" onsubmit="submitBooking(event)">
                <h3 style="font-family: 'Cinzel', serif; color: var(--burgundy-dark); margin-bottom: 20px; text-align: center;">
                    Step 2: Complete Registration
                </h3>
                
                <div class="form-group">
                    <label for="name">Full Name *</label>
                    <input type="text" id="name" name="name" required>
                </div>
                
                <div class="form-group">
                    <label for="phone">Phone Number *</label>
                    <input type="tel" id="phone" name="phone" pattern="[0-9]{10}" placeholder="10 digit mobile number" required>
                </div>
                
                <div class="form-group">
                    <label for="email">Email Address *</label>
                    <input type="email" id="email" name="email" required>
                </div>
                
                <div class="form-group">
                    <label for="tickets">Number of Tickets *</label>
                    <input type="number" id="tickets" name="tickets" min="1" max="${Math.min(availableSeats, 10)}" value="1" required onchange="updateTotalAmount()">
                    <p style="font-size: 0.9rem; color: #666; margin-top: 5px;">Maximum ${Math.min(availableSeats, 10)} tickets per booking</p>
                </div>
                
                <div class="form-group">
                    <label for="foodPreference">Food Preference *</label>
                    <select id="foodPreference" name="foodPreference" required>
                        <option value="">Select your preference</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="non-vegetarian">Non-Vegetarian</option>
                        <option value="vegan">Vegan</option>
                        <option value="none">No Food Required</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="upiTransactionId">UPI Transaction ID / Reference Number *</label>
                    <input type="text" id="upiTransactionId" name="upiTransactionId" placeholder="e.g., 123456789012" required>
                    <p style="font-size: 0.9rem; color: #666; margin-top: 5px;">Enter the transaction ID from your UPI payment confirmation</p>
                </div>
                
                <div class="form-group">
                    <label for="specialRequests">Special Requests (Optional)</label>
                    <textarea id="specialRequests" name="specialRequests" rows="3" placeholder="Any special requirements or notes..."></textarea>
                </div>
                
                <div style="background: var(--cream); padding: 15px; border-radius: 10px; margin-bottom: 20px; text-align: center; border: 2px solid var(--gold);">
                    <p style="font-size: 1.2rem; color: var(--burgundy-dark);"><strong>Total Amount:</strong> ₹<span id="totalAmount">${amount}</span></p>
                </div>
                
                <button type="submit" class="submit-button">Complete Booking</button>
            </form>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Close modal when clicking on X
    document.querySelector('.close-modal').onclick = () => {
        modal.style.display = 'none';
    };
    
    // Close modal when clicking outside
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Update total amount based on number of tickets
function updateTotalAmount() {
    const tickets = document.getElementById('tickets').value;
    const totalAmount = currentEvent.ticketPrice * tickets;
    document.getElementById('totalAmount').textContent = totalAmount;
}

// Generate UPI payment link
function generateUPILink(event, amount) {
    const upiId = event.upiId;
    const merchantName = encodeURIComponent(event.merchantName);
    const eventName = encodeURIComponent(event.title);
    
    // UPI payment URL format
    return `upi://pay?pa=${upiId}&pn=${merchantName}&tn=${eventName}&am=${amount}&cu=INR`;
}

// Submit booking form
function submitBooking(e) {
    e.preventDefault();
    
    const formData = {
        eventId: currentEvent.id,
        eventTitle: currentEvent.title,
        eventDate: currentEvent.date,
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        tickets: parseInt(document.getElementById('tickets').value),
        foodPreference: document.getElementById('foodPreference').value,
        upiTransactionId: document.getElementById('upiTransactionId').value,
        specialRequests: document.getElementById('specialRequests').value,
        bookingDate: new Date().toISOString(),
        totalAmount: currentEvent.ticketPrice * parseInt(document.getElementById('tickets').value)
    };
    
    // Check if seats are still available
    const availableSeats = currentEvent.totalSeats - currentEvent.bookedSeats;
    if (formData.tickets > availableSeats) {
        alert(`Sorry, only ${availableSeats} seats are available.`);
        return;
    }
    
    // Show loading state
    const submitButton = document.querySelector('#bookingForm button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Saving to Google Sheets...';
    submitButton.disabled = true;
    
    // Send to Google Sheets first
    sendToGoogleSheets(formData)
        .then(() => {
            console.log('Successfully saved to Google Sheets');
            // Save booking to localStorage (as backup)
            saveBooking(formData);
            
            // Update booked seats
            currentEvent.bookedSeats += formData.tickets;
            
            // Show success message
            showSuccessMessage(formData);
            
            // Refresh events display
            displayEvents();
        })
        .catch((error) => {
            console.error('Error saving to Google Sheets:', error);
            // Still save locally even if Google Sheets fails
            saveBooking(formData);
            currentEvent.bookedSeats += formData.tickets;
            showSuccessMessage(formData);
            displayEvents();
        })
        .finally(() => {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        });
}

// Send booking data to Google Sheets
async function sendToGoogleSheets(data) {
    // Check if Google Sheets URL is configured
    if (!GOOGLE_SHEETS_URL || GOOGLE_SHEETS_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        console.warn('Google Sheets URL not configured. Skipping Google Sheets sync.');
        return Promise.resolve(); // Continue without error
    }
    
    try {
        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        // Note: no-cors mode doesn't allow reading the response
        // We assume success if no error is thrown
        console.log('Data sent to Google Sheets');
        return Promise.resolve();
    } catch (error) {
        console.error('Failed to send to Google Sheets:', error);
        throw error;
    }
}

// Save booking to localStorage
function saveBooking(booking) {
    const bookings = getBookings();
    bookings.push(booking);
    localStorage.setItem('ayatBookings', JSON.stringify(bookings));
}

// Get bookings from localStorage
function getBookings() {
    const bookings = localStorage.getItem('ayatBookings');
    return bookings ? JSON.parse(bookings) : [];
}

// Show success message
function showSuccessMessage(booking) {
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="success-message">
            <h3>🎉 Booking Confirmed!</h3>
            <p><strong>Thank you, ${booking.name}!</strong></p>
            <p>Your booking for <strong>${booking.eventTitle}</strong> has been confirmed.</p>
            <p><strong>Number of Tickets:</strong> ${booking.tickets}</p>
            <p><strong>Total Amount Paid:</strong> ₹${booking.totalAmount}</p>
            <p><strong>Transaction ID:</strong> ${booking.upiTransactionId}</p>
            <p style="margin-top: 20px;">You will receive a confirmation email at <strong>${booking.email}</strong> shortly.</p>
            <p style="margin-top: 15px; font-size: 0.95rem; color: #666;">
                Please arrive 15 minutes before the event. Looking forward to seeing you at the baithak!
            </p>
            <button class="submit-button" onclick="closeModal()" style="margin-top: 20px;">Close</button>
        </div>
    `;
}

// Close modal
function closeModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

// Show error message
function showError(message) {
    const upcomingContainer = document.getElementById('upcomingEvents');
    upcomingContainer.innerHTML = `<div class="empty-state" style="color: #cc0000;">${message}</div>`;
}

// Admin function to view all bookings (for testing/management)
function viewAllBookings() {
    const bookings = getBookings();
    console.log('All Bookings:', bookings);
    return bookings;
}

// Admin function to clear all bookings (for testing)
function clearAllBookings() {
    if (confirm('Are you sure you want to clear all bookings? This cannot be undone.')) {
        localStorage.removeItem('ayatBookings');
        location.reload();
    }
}

// Make admin functions available in console
window.ayatAdmin = {
    viewBookings: viewAllBookings,
    clearBookings: clearAllBookings
};

console.log('Ayat Baithak Website Loaded');
console.log('Admin commands available: ayatAdmin.viewBookings() and ayatAdmin.clearBookings()');

