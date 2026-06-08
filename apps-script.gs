/**
 * The Independent Edge - Application Webhook
 * Receives POST from the Apply page form and writes to Google Sheets.
 *
 * COLUMN ORDER (must match the payload keys from the website):
 * A: Timestamp
 * B: Name
 * C: Email
 * D: Phone (formatted as text)
 * E: Total Score
 * F: Fit Category
 * G: Q1 Score
 * H: Q2 Score
 * I: Q3 Score
 * J: Q4 Score
 * K: Q5 Score
 * L: Experience Level
 * M: Conversation Confidence
 * N: Pressure Avoidance
 * O: Action Orientation
 * P: Commitment Level
 * Q: Core Problem
 * R: Recommended Path
 * S: Status
 * T: Landing Page
 * U: Last Article Viewed
 * V: Current Page
 * W: Referrer
 * X: UTM Source
 * Y: UTM Medium
 * Z: UTM Campaign
 * AA: UTM Content
 * AB: UTM Term
 * AC: Device Type
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Format phone as text to prevent +91 triggering #ERROR!
    var phone = String(data.phone || '');
    if (phone && phone.charAt(0) !== "'") {
      phone = "'" + phone;
    }

    var row = [
      data.timestamp || new Date().toISOString(),
      data.name || '',
      data.email || '',
      phone,
      data.totalScore || 0,
      data.fitCategory || '',
      data.q1Score || 0,
      data.q2Score || 0,
      data.q3Score || 0,
      data.q4Score || 0,
      data.q5Score || 0,
      data.experienceLevel || '',
      data.conversationConfidence || '',
      data.pressureAvoidance || '',
      data.actionOrientation || '',
      data.commitmentLevel || '',
      data.coreProblem || '',
      data.recommendedPath || '',
      data.status || '',
      data.landingPage || '',
      data.lastArticleViewed || '',
      data.currentPage || '',
      data.referrer || '',
      data.utmSource || '',
      data.utmMedium || '',
      data.utmCampaign || '',
      data.utmContent || '',
      data.utmTerm || '',
      data.deviceType || ''
    ];

    sheet.appendRow(row);

    // Format phone column D as plain text for the new row
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 4).setNumberFormat('@');

    return ContentService
      .createTextOutput(JSON.stringify({status: 'ok', row: lastRow}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
