# आयात | Ayat - Indian Classical Baithak

A beautiful, mobile-friendly website for managing events and invitations for Ayat - an Indian Classical music baithak series in Bangalore.

![Ayat Logo](images.jpeg)

## Features

✨ **Event Management**
- Display upcoming and past events
- Configurable events via JSON file
- Automatic seat availability tracking
- Event booking closes when seats are full

💰 **Payment Integration**
- UPI payment link integration
- Direct redirect to UPI apps (PhonePe, GPay, Paytm, etc.)
- Payment confirmation tracking

📝 **Booking System**
- Easy registration form
- Capture name, phone, email, number of tickets
- Food preference selection
- UPI transaction ID verification
- Real-time seat availability updates

📊 **Google Sheets Integration**
- Automatic saving of all bookings to Google Sheets
- Email confirmations sent automatically
- Real-time data sync
- Easy export and analytics
- **[Setup Guide](GOOGLE_SHEETS_SETUP.md)** - Complete step-by-step instructions

🎨 **Design**
- Indian classical aesthetic with burgundy and gold theme
- Mobile-responsive design
- Beautiful, elegant UI matching the logo
- Smooth animations and transitions

## File Structure

```
ayat/
├── index.html          # Main HTML page
├── styles.css          # Styling with Indian classical theme
├── script.js           # JavaScript for functionality
├── events.json         # Event configuration file
├── images.jpeg         # Ayat logo
└── README.md          # Documentation
```

## Setup Instructions

### 1. Local Development

To run the website locally:

```bash
# Navigate to the project directory
cd ayat

# Start a local web server
python3 -m http.server 8000

# Open in browser
# Visit: http://localhost:8000
```

Alternatively, you can use any other local server:
- Node.js: `npx http-server`
- PHP: `php -S localhost:8000`

### 2. GitHub Pages Deployment

To host the website on GitHub Pages:

1. **Create a GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Ayat Baithak website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ayat.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to "Pages" section
   - Under "Source", select "main" branch
   - Click "Save"
   - Your site will be available at: `https://YOUR_USERNAME.github.io/ayat/`

## Google Sheets Integration (Recommended)

To automatically save all bookings to Google Sheets and send email confirmations:

1. **Follow the detailed guide:** [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)
2. The setup takes about 10 minutes
3. Once configured, all form submissions will automatically:
   - Save to your Google Sheet in real-time
   - Send email confirmations to customers
   - Be accessible from anywhere

**Quick Summary:**
- Create a Google Sheet with booking columns
- Add a simple Google Apps Script (provided)
- Deploy as a web app
- Copy the URL to `script.js`

**Benefits:**
- ✅ No database hosting needed (completely free)
- ✅ Automatic email confirmations
- ✅ Easy data export and sharing
- ✅ Real-time updates
- ✅ Works perfectly with GitHub Pages

---

## Managing Events

### Adding/Editing Events

Edit the `events.json` file to manage events:

```json
{
  "events": [
    {
      "id": "unique-event-id",
      "title": "Event Title",
      "artist": "Artist Name",
      "date": "YYYY-MM-DD",
      "time": "7:00 PM",
      "venue": "Location, Bangalore",
      "description": "Event description...",
      "totalSeats": 50,
      "bookedSeats": 0,
      "ticketPrice": 800,
      "upiId": "your-upi@paytm",
      "merchantName": "Your Merchant Name",
      "status": "upcoming"
    }
  ]
}
```

### Event Configuration Fields

- **id**: Unique identifier for the event
- **title**: Event name
- **artist**: Performing artist(s)
- **date**: Event date (YYYY-MM-DD format)
- **time**: Event time
- **venue**: Location details
- **description**: Brief description of the event
- **totalSeats**: Maximum capacity
- **bookedSeats**: Initially 0 (managed automatically)
- **ticketPrice**: Price per ticket in INR
- **upiId**: Your UPI ID for payments
- **merchantName**: Business/organization name
- **status**: "upcoming" or "past"

### Payment Setup

Update the UPI payment details in `events.json`:
- Replace `ayatbaithak@paytm` with your UPI ID
- Update `merchantName` with your business name

## Managing Bookings

### View All Bookings (Admin)

Open browser console and run:
```javascript
ayatAdmin.viewBookings()
```

This will display all bookings stored in localStorage.

### Clear All Bookings (Testing)

Open browser console and run:
```javascript
ayatAdmin.clearBookings()
```

**Note**: This will delete all bookings. Use with caution!

### Export Bookings Data

To export bookings for records:
```javascript
// Copy bookings to clipboard
copy(localStorage.getItem('ayatBookings'))
```

Then paste into a text file or spreadsheet.

## Booking Flow

1. **User browses events** on the homepage
2. **Clicks "Book Your Seat"** for an event
3. **Step 1**: Makes payment via UPI
   - Clicks the UPI payment button
   - Redirected to UPI app
   - Completes payment
   - Notes the transaction ID
4. **Step 2**: Fills registration form
   - Name, phone, email
   - Number of tickets
   - Food preference
   - UPI transaction ID
5. **Confirmation**: Success message displayed
6. **Seat count** automatically updated

## Customization

### Colors

Edit CSS variables in `styles.css`:
```css
:root {
    --burgundy-dark: #4A1111;
    --burgundy: #6B1F1F;
    --burgundy-light: #8B2323;
    --gold: #D4AF37;
    --gold-light: #F0D98F;
    --cream: #FFF8DC;
}
```

### Fonts

Current fonts (from Google Fonts):
- **Cinzel**: Elegant serif for headings
- **Cormorant Garamond**: Classical serif for body text

### Contact Information

Update footer contact details in `index.html`:
```html
<p>Email: your-email@example.com</p>
<p>Phone: +91 XXXXX XXXXX</p>
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Technical Details

- **Frontend**: Pure HTML, CSS, JavaScript (no frameworks)
- **Storage**: localStorage for booking persistence
- **Payment**: UPI deep linking
- **Hosting**: Static hosting (GitHub Pages compatible)

## Important Notes

⚠️ **Data Persistence**: Bookings are stored in browser's localStorage. For production use, consider implementing a backend database.

⚠️ **Payment Verification**: The current system relies on users entering transaction IDs. For production, integrate payment gateway webhooks for automatic verification.

⚠️ **Email Notifications**: Currently shows a message about email confirmation. Implement actual email service (SendGrid, etc.) for production.

## Future Enhancements

Consider adding:
- Backend database (Firebase, Supabase)
- Automated email confirmations
- Payment gateway integration (Razorpay, Stripe)
- Admin dashboard
- QR code tickets
- Photo gallery from past events
- Testimonials section

## Support

For questions or issues, contact:
- Email: info@ayatbaithak.com
- Phone: +91 98765 43210

## License

© 2025 Ayat - Indian Classical Baithak. All rights reserved.

---

Made with ❤️ for Indian Classical Music lovers in Bangalore
