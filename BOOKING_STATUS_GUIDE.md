# Booking Status System Guide

## Overview

The new booking status system allows you to control event bookings through simple flags in `events.json`, removing the need to track individual seat numbers.

---

## Booking Status Options

### 1. **`"open"`** - Booking Available
```json
"bookingStatus": "open",
"availabilityMessage": "Very few seats available"
```
- ✅ Shows "Book Your Seat" button
- ✅ Button is clickable
- ✅ Displays custom availability message
- **Use when**: Event is ready for bookings

---

### 2. **`"coming_soon"`** - Booking Opens Soon
```json
"bookingStatus": "coming_soon",
"availabilityMessage": "Booking opens soon"
```
- 🔒 Shows "Booking Opens Soon" button
- 🔒 Button is disabled (grey)
- 📢 Builds anticipation
- **Use when**: Event announced but bookings not yet open

---

### 3. **`"closed"`** or **`"sold_out"`** - Booking Closed
```json
"bookingStatus": "closed",
"availabilityMessage": "Sold out"
```
- ❌ Shows "Sold Out" button
- ❌ Button is disabled (red)
- 🚫 Prevents new bookings
- **Use when**: Event is full or bookings closed

---

### 4. **`"completed"`** - Event Completed
```json
"bookingStatus": "completed",
"availabilityMessage": "Event completed"
```
- ⏹️ Shows "Event Completed" button
- ⏹️ Button is disabled (red)
- 🏁 For past events
- **Use when**: Event has already happened

---

## Event Structure

### Complete Example:

```json
{
  "id": "event-001",
  "title": "Raga Yaman Evening",
  "artist": "Pt. Rajesh Kumar (Sitar) & Ustad Ahmed Khan (Tabla)",
  "date": "2025-12-15",
  "time": "7:00 PM",
  "venue": "HSR Layout, Bangalore",
  "description": "An enchanting evening featuring...",
  "ticketPrice": 800,
  "upiId": "ayatbaithak@paytm",
  "merchantName": "Ayat Baithak",
  "status": "upcoming",
  "bookingStatus": "open",
  "availabilityMessage": "Very few seats available"
}
```

### Required Fields:
- ✅ `id` - Unique identifier
- ✅ `title` - Event name
- ✅ `artist` - Performer name(s)
- ✅ `date` - Format: YYYY-MM-DD
- ✅ `time` - Event time
- ✅ `venue` - Location
- ✅ `description` - Event details
- ✅ `ticketPrice` - Price per ticket
- ✅ `upiId` - Payment UPI ID
- ✅ `merchantName` - Payment merchant name
- ✅ `status` - "upcoming" or "past"
- ✅ `bookingStatus` - Controls booking button
- ✅ `availabilityMessage` - Shown to users

---

## Removed Fields

The following fields are **NO LONGER USED**:
- ❌ `totalSeats` - Removed
- ❌ `bookedSeats` - Removed

You don't need to track seat counts anymore!

---

## Custom Availability Messages

You can customize the `availabilityMessage` for any situation:

### Creative Examples:

**For High Demand:**
```json
"availabilityMessage": "Very few seats available"
"availabilityMessage": "Limited seats remaining"
"availabilityMessage": "Almost sold out!"
```

**For Coming Soon:**
```json
"availabilityMessage": "Booking opens December 1st"
"availabilityMessage": "Stay tuned for booking details"
```

**For Sold Out:**
```json
"availabilityMessage": "Sold out"
"availabilityMessage": "Fully booked"
"availabilityMessage": "Waitlist only"
```

**For Special Cases:**
```json
"availabilityMessage": "Members only booking"
"availabilityMessage": "Early bird booking open"
"availabilityMessage": "Register your interest"
```

---

## How to Update Event Status

### Scenario 1: Opening Bookings
**Before:**
```json
"bookingStatus": "coming_soon",
"availabilityMessage": "Booking opens soon"
```

**After:**
```json
"bookingStatus": "open",
"availabilityMessage": "Very few seats available"
```

### Scenario 2: Event is Full
**Before:**
```json
"bookingStatus": "open",
"availabilityMessage": "Very few seats available"
```

**After:**
```json
"bookingStatus": "closed",
"availabilityMessage": "Sold out"
```

### Scenario 3: Event Happened
**Before:**
```json
"status": "upcoming",
"bookingStatus": "closed"
```

**After:**
```json
"status": "past",
"bookingStatus": "completed",
"availabilityMessage": "Event completed"
```

---

## Quick Reference Table

| Status | Button Text | Button Color | Clickable | When to Use |
|--------|-------------|--------------|-----------|-------------|
| `open` | Book Your Seat | Burgundy/Gold | ✅ Yes | Ready for bookings |
| `coming_soon` | Booking Opens Soon | Grey | ❌ No | Announced, not open yet |
| `closed` | Sold Out | Red | ❌ No | Full or closed |
| `sold_out` | Sold Out | Red | ❌ No | Completely full |
| `completed` | Event Completed | Red | ❌ No | Past event |

---

## Benefits of New System

✨ **Simple**: Just change the status flag
⚡ **Flexible**: Use any custom message
🎯 **Accurate**: No seat counting errors
📱 **User-Friendly**: Clear status messaging
🔧 **Easy Maintenance**: One field to update

---

## Tips

1. **Be Honest**: If seats are available, say so. Build trust!
2. **Create Urgency**: "Very few seats" encourages quick booking
3. **Be Clear**: Tell users exactly when bookings open
4. **Update Regularly**: Change status as situations evolve
5. **Test Changes**: View site locally before pushing to GitHub

---

## Deploying Changes

After editing `events.json`:

```bash
cd /Users/akumar103/Documents/ayat
git add events.json
git commit -m "Update event booking status"
git push origin main
```

Wait 1-2 minutes for GitHub Pages to rebuild, then refresh your site!

---

## Questions?

Check `events.json` for live examples of all status types in action.

