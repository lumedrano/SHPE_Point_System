function doGet(e) {
 var url = "YOUR GOOGLE SHEET URL";
 var ss = SpreadsheetApp.openByUrl(url);
 var ws = ss.getSheetByName("Sheet1");


 // Get the last row with data in the "A" column
 var lastRow = ws.getLastRow();
  var dataRange = ws.getRange("A2:N" + lastRow).getValues();


 // Create an array of objects with name and points, then sort it
 var members = dataRange.map(function(row) {
   return { name: row[0], points: row[13] || 0 }; // Assuming points are in the 14th column (N)
 }).filter(function(member) {
   return member.name; // Filter out any empty names
 }).sort(function(a, b) {
   return b.points - a.points; // Sort by points descending
 });


 // Pass the sorted members data to the HTML template
 var template = HtmlService.createTemplateFromFile("index");
 template.members = members;  // Assign the sorted members array to the template
 return template.evaluate()
   .addMetaTag('viewport', 'width=device-width, initial-scale=1')
   .setTitle("Member Points Ranking")
   .setFaviconUrl("https://example.com/favicon.ico")
   .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
   .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}


function updatePoints(name, pointsToAdd) {
 var url = "ENTER_BASE_URL"; // Replace with your Google Sheet URL
 var ss = SpreadsheetApp.openByUrl(url);
 var ws = ss.getSheetByName("Sheet1");// gets the main sheet where all points are stored


 // Get the current data
 var lastRow = ws.getLastRow();
 var dataRange = ws.getRange("A2:N" + lastRow).getValues();
  // Find the row by name and update points
 for (var i = 0; i < dataRange.length; i++) {
   if (dataRange[i][0].toLowerCase() === name.toLowerCase()) {
     var currentPoints = dataRange[i][13] || 0;
     ws.getRange(i + 2, 15).setValue(currentPoints + pointsToAdd);
     break;
   }
 }
  // Re-sort the sheet by points
 ws.getRange("A2:N" + lastRow).sort({column: 14, ascending: false});
}
