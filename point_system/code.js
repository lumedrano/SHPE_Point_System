function doGet(e) {
  return HtmlService.createHtmlOutputFromFile("index");
}

function addToGoogleSheet(eid, meetingId) {
  eid = ("" + eid).trim().toLowerCase();
  meetingId = ("" + meetingId).trim().toUpperCase();

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var membersSheet = ss.getSheetByName("Members");
  var meetingsSheet = ss.getSheetByName("Meetings");

  var membersData = membersSheet.getDataRange().getValues();
  var meetingsData = meetingsSheet.getDataRange().getValues();

  // Skip header row when finding member
  var memberRowIndex = -1;
  for (var i = 1; i < membersData.length; i++) {
    var cell = membersData[i][0];
    if ((cell + "").toLowerCase() === eid) {
      memberRowIndex = i;
      break;
    }
  }
  if (memberRowIndex === -1) return "⚠️ EID not found.";

  // Find meeting row
  var meetingRow = meetingsData.find(row => (row[0] + "").toUpperCase() === meetingId);
  if (!meetingRow) return "⚠️ Meeting ID not found.";

  // Extract meeting info
  var [id, dateObj, startObj, endObj, points] = meetingRow;

  var timeZone = Session.getScriptTimeZone();
  var todayStr = Utilities.formatDate(new Date(), timeZone, "MM/dd/yyyy");
  var meetingDateStr = Utilities.formatDate(new Date(dateObj), timeZone, "MM/dd/yyyy");
  var currentTime = Utilities.formatDate(new Date(), timeZone, "HH:mm");
  var startTime = Utilities.formatDate(new Date(startObj), timeZone, "HH:mm");
  var endTime = Utilities.formatDate(new Date(endObj), timeZone, "HH:mm");

  if (todayStr !== meetingDateStr) return "⚠️ Meeting is not today.";
  if (currentTime < startTime || currentTime > endTime) return "⚠️ Meeting is not currently open.";

  // Find meeting column in Members sheet
  var headerRow = membersData[0];
  var meetingColIndex = headerRow.findIndex(col => (col + "").toUpperCase() === meetingId);
  if (meetingColIndex === -1) return "⚠️ Meeting column not found.";

  // Check if points already claimed
  var currentPoints = membersSheet.getRange(memberRowIndex + 1, meetingColIndex + 1).getValue() || 0;
  if (currentPoints > 0) return "⚠️ Points already claimed for this meeting.";

  // Add points
  membersSheet.getRange(memberRowIndex + 1, meetingColIndex + 1).setValue(Number(points));

  return `✔️ Success! ${points} points added for ${eid} in meeting ${meetingId}.`;
}

// Debug test
function test() {
  var result = addToGoogleSheet("testid", "GM01");
  Logger.log(result);
}


//NOTE: may need to add a thread lock to ensure no two or more threads override each other missing people's points


