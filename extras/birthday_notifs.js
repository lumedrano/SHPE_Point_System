function sendBirthdayEmails() {
  var url = "https://docs.google.com/spreadsheets/d/1JfUX1qeuYkq_kT93fFSvJ0HGW0knAC19qgzAZd-lNLc/edit#gid=0";
  var ss = SpreadsheetApp.openByUrl(url);
  var ws = ss.getSheetByName("Sheet1");

  var today = new Date();
  var formattedToday = formatMonthDay(today); // Format today's date to "MM-dd"
  
  // Get the data in columns A, C, and I
  var dataRange = ws.getRange(2, 1, ws.getLastRow() - 1, 9).getValues();
  
  for (var i = 0; i < dataRange.length; i++) {
    var name = dataRange[i][0]; // Column A
    var email = dataRange[i][2]; // Column C
    var birthday = dataRange[i][8]; // Column I
    
    if (birthday && formatMonthDay(new Date(birthday)) === formattedToday) {
      var subject = "Happy Birthday from UT SHPE!";
      var body = "🎉🎂 Dear " + name + ",\n\n" +
           "Wishing you an absolutely amazing birthday filled with joy, laughter, and lots of cake! 🎈🥳 " +
           "We're so lucky to have you in our SHPE familia. 💙🎉\n\n" +
           "Keep shining and enjoy your special day to the fullest! ✨🎉\n\n" +
           "Best wishes,\nUT SHPE 🚀";

      
      MailApp.sendEmail(email, subject, body);
    }
  }
}

function formatMonthDay(date) {
  var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero
  var day = date.getDate().toString().padStart(2, '0'); // Add leading zero
  return month + "-" + day;
}