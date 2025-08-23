function doGet(e) {
  Logger.log(e);
  return HtmlService.createHtmlOutputFromFile("index");
}

function userClicked(eid) {
  var currentTime = new Date(); 
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ws = ss.getSheetByName("Sheet1");

  var headerRow = ws.getRange(1, 1, 1, ws.getLastColumn()).getValues()[0];
  var currentDate = formatDate(currentTime);

  var columnIndex = -1;
  var eventStartTime = null;
  var eventEndTime = null;

  for (var i = 0; i < headerRow.length; i++) {
    var header = headerRow[i].toString(); 
    var headerDateParts = header.match(/(\d{2}\/\d{2}\/\d{4}) (\d{1,2}:\d{2} [APM]{2}) - (\d{1,2}:\d{2} [APM]{2})/);

    if (headerDateParts) {
      var headerDate = new Date(headerDateParts[1] + " " + headerDateParts[2]);
      var headerEndDate = new Date(headerDateParts[1] + " " + headerDateParts[3]);

      if (headerDate.toDateString() === currentTime.toDateString()) {
        if (currentTime >= headerDate && currentTime <= headerEndDate) {
          columnIndex = i;
          eventStartTime = headerDate;
          eventEndTime = headerEndDate;
          break; 
        }
      }
    }
  }

  if (columnIndex === -1) {
    return "Check-in is only allowed on specific meeting dates or within valid time ranges.";
  }

  var lowercaseEid = eid.toLowerCase();

  var eidColumn = ws.getRange("B:B").getValues();
  var eids = eidColumn.flat().filter(Boolean).map(function (eid) {
    return eid.toString().toLowerCase();
  });

  var rowIndex = eids.indexOf(lowercaseEid);

  if (rowIndex !== -1) {
    var points = ws.getRange(rowIndex + 1, columnIndex + 1).getValue();
    if (points == 1) {
      return "Points already added for this member.";
    } else {
      var cell = ws.getRange(rowIndex + 1, columnIndex + 1);
      cell.setValue(1);
      cell.setNumberFormat("0");

      return "Success: Points added successfully for member with EID: " + eid;
    }
  } else {
    return "Member with EID not found.";
  }
}

function formatDate(date) {
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var year = date.getFullYear();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return month + "/" + day + "/" + year + " " + hours + ":" + minutes + " " + ampm;
}

function addToGoogleSheet(eid) {
  var response = userClicked(eid);
  return response;
}
