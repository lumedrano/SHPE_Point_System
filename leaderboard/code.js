function doGet(e) {
  var url = "https://docs.google.com/spreadsheets/d/1LG2u8rVcuWsowfGA1oD-qmG2HQEFjpaATh4rz5Ll8js/edit?gid=0#gid=0";
  var ss = SpreadsheetApp.openByUrl(url);
  var ws = ss.getSheetByName("Members");

  // Get all rows after headers
  var lastRow = ws.getLastRow();
  if (lastRow < 2) {
    throw new Error("No member data found.");
  }

  var dataRange = ws.getRange("A2:" + ws.getLastRow()).getValues();
  var headerRow = ws.getRange(1, 1, 1, ws.getLastColumn()).getValues()[0];

  // Find "Name" and "Total Points" column indexes
  var nameColIndex = headerRow.indexOf("Name");
  var totalPointsColIndex = headerRow.indexOf("Total Points");

  if (nameColIndex === -1 || totalPointsColIndex === -1) {
    throw new Error("Could not find 'Name' or 'Total Points' columns in Members sheet.");
  }

  // Build members list
  var members = dataRange.map(function(row) {
    return {
      name: row[nameColIndex] || "",
      points: row[totalPointsColIndex] || 0
    };
  }).filter(function(member) {
    return member.name; // remove blanks
  }).sort(function(a, b) {
    return b.points - a.points; // sort descending
  });

  // Send members to HTML
  var template = HtmlService.createTemplateFromFile("index");
  template.members = members;
  return template.evaluate()
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setTitle("Member Points Ranking")
    .setFaviconUrl("https://example.com/favicon.ico")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}
