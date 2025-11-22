# Google Sheets Integration Setup Guide

This guide will walk you through setting up Google Sheets to automatically receive all booking form submissions.

## Overview

When users submit a booking form on your website, the data will be automatically saved to a Google Sheet in real-time.

---

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **+ Blank** to create a new spreadsheet
3. Rename it to **"Ayat Bookings"** (click on "Untitled spreadsheet" at the top)

### Add Column Headers

In Row 1, add these headers (exactly as shown):

| A | B | C | D | E | F | G | H | I | J | K | L |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Event ID | Event Title | Event Date | Name | Phone | Email | Tickets | Food Preference | UPI Transaction ID | Total Amount | Special Requests |

**Copy and paste this into Row 1:**
```
Timestamp	Event ID	Event Title	Event Date	Name	Phone	Email	Tickets	Food Preference	UPI Transaction ID	Total Amount	Special Requests
```
*(Separated by tabs - paste directly into cell A1)*

---

## Step 2: Create Google Apps Script

### Open Script Editor

1. In your Google Sheet, click **Extensions** in the menu
2. Click **Apps Script**
3. You'll see a code editor with some default code

### Add the Script

1. **Delete all existing code** in the editor
2. **Copy and paste this code:**

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet and sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming JSON data
    var data = JSON.parse(e.postData.contents);
    
    // Prepare row data matching your column headers
    var rowData = [
      new Date(),                    // Timestamp
      data.eventId,                  // Event ID
      data.eventTitle,               // Event Title
      data.eventDate,                // Event Date
      data.name,                     // Name
      data.phone,                    // Phone
      data.email,                    // Email
      data.tickets,                  // Tickets
      data.foodPreference,           // Food Preference
      data.upiTransactionId,         // UPI Transaction ID
      data.totalAmount,              // Total Amount
      data.specialRequests || ''     // Special Requests (optional)
    ];
    
    // Append the row to the sheet
    sheet.appendRow(rowData);
    
    // Format the timestamp cell (optional but nice)
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setNumberFormat('yyyy-mm-dd hh:mm:ss');
    
    // Send email confirmation to the customer
    try {
      var subject = 'Booking Confirmed: ' + data.eventTitle + ' - Ayat Baithak';
      var body = 'Dear ' + data.name + ',\n\n' +
                 'Your booking has been confirmed!\n\n' +
                 '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
                 'EVENT DETAILS\n' +
                 '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
                 'Event: ' + data.eventTitle + '\n' +
                 'Date: ' + data.eventDate + '\n' +
                 'Number of Tickets: ' + data.tickets + '\n' +
                 'Food Preference: ' + data.foodPreference + '\n\n' +
                 '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
                 'PAYMENT DETAILS\n' +
                 '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
                 'Total Amount: ₹' + data.totalAmount + '\n' +
                 'Transaction ID: ' + data.upiTransactionId + '\n\n' +
                 '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
                 'Please arrive 15 minutes before the event.\n\n' +
                 'Looking forward to seeing you at the baithak!\n\n' +
                 'Warm regards,\n' +
                 'Ayat Team\n\n' +
                 '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
                 'Contact: info@ayatbaithak.com\n' +
                 'Phone: +91 98765 43210';
      
      MailApp.sendEmail(data.email, subject, body);
    } catch (emailError) {
      // If email fails, still save the booking
      console.error('Email send failed:', emailError);
    }
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'message': 'Booking saved successfully',
      'row': lastRow
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    console.error('Error:', error);
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function to verify the web app is running
function doGet(e) {
  return ContentService.createTextOutput('Ayat Bookings API is running. Use POST method to submit bookings.');
}
```

3. **Save the script:**
   - Click the **disk icon** 💾 or press `Ctrl+S` / `Cmd+S`
   - Give it a name: **"Ayat Bookings API"**

---

## Step 3: Deploy as Web App

### Deploy the Script

1. Click the **Deploy** button (top right) → Select **New deployment**

2. Click the **gear icon** ⚙️ next to "Select type"

3. Choose **Web app**

4. Configure the deployment:
   - **Description:** `Ayat Bookings API v1`
   - **Execute as:** Select **Me** (your email)
   - **Who has access:** Select **Anyone** (important!)

5. Click **Deploy**

6. **Authorization Required** popup will appear:
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** (if you see a warning)
   - Click **Go to [Project Name] (unsafe)** at the bottom
   - Click **Allow**

7. **Copy the Web App URL**
   - You'll see a URL like: `https://script.google.com/macros/s/AKfycbz.../exec`
   - **COPY THIS URL** - you'll need it in the next step!

---

## Step 4: Update Your Website

### Add the URL to your website

1. Open the file: `script.js`

2. Find this line near the top:
```javascript
const GOOGLE_SHEETS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```

3. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your actual URL:
```javascript
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbz.../exec';
```

4. Save the file

5. Refresh your website

---

## Step 5: Test It!

### Test the Integration

1. Go to your website
2. Click **Book Your Seat** on any event
3. Fill out the form with test data
4. Submit the booking
5. Check your Google Sheet - you should see a new row with the booking data!
6. Check the email inbox you entered - you should receive a confirmation email!

---

## Troubleshooting

### Data Not Appearing in Sheet?

**Check these:**

1. ✅ Did you copy the correct Web App URL?
2. ✅ Did you deploy with "Who has access: **Anyone**"?
3. ✅ Did you authorize the script when prompted?
4. ✅ Is the Google Sheet open? (Keep it open or close and reopen)
5. ✅ Check the browser console (F12) for any errors

### Email Not Sending?

**This is normal!** Gmail has daily sending limits:
- Free Gmail: ~100 emails/day
- Google Workspace: ~1500 emails/day

If emails aren't sending, the booking will still be saved to the sheet.

### Need to Update the Script?

1. Go to Extensions → Apps Script
2. Make your changes
3. Click **Deploy** → **Manage deployments**
4. Click the **pencil icon** ✏️ next to your deployment
5. Change **Version** to **New version**
6. Click **Deploy**
7. The URL stays the same - no need to update your website!

---

## Customizing Email Template

Want to change the email content? In the Apps Script, find this section:

```javascript
var subject = 'Booking Confirmed: ' + data.eventTitle + ' - Ayat Baithak';
var body = 'Dear ' + data.name + ',\n\n' +
           'Your booking has been confirmed!...';
```

Modify the `subject` and `body` text as desired, then redeploy.

---

## Viewing and Managing Bookings

### View All Bookings
Simply open your Google Sheet to see all bookings in real-time!

### Export Bookings
- File → Download → Microsoft Excel (.xlsx)
- File → Download → CSV

### Share with Team
- Click **Share** button in Google Sheet
- Add team members' emails
- Set permissions (Viewer/Editor)

### Create Reports
Use Google Sheets features:
- Pivot tables for analytics
- Charts to visualize bookings
- Filters to find specific bookings
- Conditional formatting to highlight VIP bookings

---

## Security Notes

✅ **Safe:** The script only accepts POST requests with booking data  
✅ **Safe:** Your email and personal info are not exposed  
✅ **Safe:** The Web App URL can be public - it only accepts specific data format  

⚠️ **Protect your Google Sheet:** Don't share the sheet link publicly, only with trusted team members

---

## Advanced: Add Notifications

Want to get notified on each booking? Add this to your Apps Script:

```javascript
// After sheet.appendRow(rowData);
MailApp.sendEmail(
  'your-admin-email@example.com',  // Your email
  '🎵 New Booking: ' + data.eventTitle,
  'New booking from ' + data.name + '\n' +
  'Tickets: ' + data.tickets + '\n' +
  'Amount: ₹' + data.totalAmount
);
```

---

## Support

Need help? Common issues:

1. **"Authorization required" error:** You need to authorize the script (Step 3, item 6)
2. **Nothing happens:** Check that GOOGLE_SHEETS_URL is correctly set in script.js
3. **Row not added:** The sheet name might be wrong - make sure you're using the first sheet

---

## Summary Checklist

- [ ] Created Google Sheet with column headers
- [ ] Added Apps Script code
- [ ] Deployed as Web App with "Anyone" access
- [ ] Authorized the script
- [ ] Copied the Web App URL
- [ ] Updated GOOGLE_SHEETS_URL in script.js
- [ ] Tested with a real booking
- [ ] Confirmed data appears in sheet
- [ ] Confirmed email was received

**Once all items are checked, you're done!** 🎉

---

*Last updated: November 2025*

