// AYAT BAITHAK - GOOGLE APPS SCRIPT CODE
// Copy and paste this entire file into your Google Apps Script editor
// Instructions: See GOOGLE_SHEETS_SETUP.md

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

