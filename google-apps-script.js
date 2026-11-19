/**
 * =========================================================================
 * ASHA TENSILE STRUCTURES - CONTACT FORM TO GOOGLE SHEETS HANDLER
 * =========================================================================
 * 
 * INSTRUCTIONS:
 * 1. Open Google Sheets (create a new sheet e.g. "Asha Tensile Leads").
 * 2. In the menu, go to: Extensions > Apps Script.
 * 3. Delete any code in the editor and paste this ENTIRE file into Code.gs.
 * 4. Click the "Save" (disk) icon.
 * 5. Click "Deploy" > "New deployment".
 * 6. Click the gear icon next to "Select type" and choose "Web app".
 * 7. Fill in the deployment details:
 *    - Description: "Contact Form Webhook"
 *    - Execute as: "Me (your email address)"
 *    - Who has access: "Anyone" (IMPORTANT: select "Anyone", do NOT choose "Only myself")
 * 8. Click "Deploy" and Authorize access if prompted.
 * 9. Copy the generated "Web app URL" (it looks like:
 *    https://script.google.com/macros/s/AKfycbx.../exec)
 * 10. Open contactUs.html and replace "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL"
 *     with your copied Web app URL.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 10 seconds for concurrent submissions to complete
  try {
    lock.waitLock(10000);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      message: "Server busy, lock timeout."
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Auto-create and format header row if sheet is completely empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Full Name",
        "Mobile Number",
        "Email Address",
        "Company",
        "Subject",
        "Message",
        "WhatsApp Type",
        "Source Page"
      ]);

      // Style header row: teal background with bold white text
      var headerRange = sheet.getRange(1, 1, 1, 9);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#007f75");
      headerRange.setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }

    // Parse incoming data (supports both JSON payload and standard parameters)
    var data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseError) {
        data = e.parameter || {};
      }
    } else {
      data = e.parameter || {};
    }

    // Extract fields
    var timestamp = data.timestamp || Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy, hh:mm:ss a");
    var name = data.name || data.UserName || "";
    var phone = data.phone || data.PhoneNo || "";
    var email = data.email || data.Email || "";
    var company = data.company || data.Company || "N/A";
    var subject = data.subject || data.Subject || "";
    var message = data.message || data.MessageBox || "";
    var whatsappType = data.whatsappType || "Standard";
    var pageUrl = data.pageUrl || "";

    // Append new lead row to Google Sheet
    sheet.appendRow([
      timestamp,
      name,
      phone,
      email,
      company,
      subject,
      message,
      whatsappType,
      pageUrl
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      result: "success",
      row: sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Test GET endpoint in browser
function doGet(e) {
  return ContentService.createTextOutput("Asha Tensile Structures Google Sheet Webhook is ACTIVE and ready to receive form submissions.")
    .setMimeType(ContentService.MimeType.TEXT);
}
