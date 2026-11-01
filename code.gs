const SHEET_NAME = "oips docs";

function doPost(e) {

  try {

    const username = String(
      e.parameter.instagramUsername || ""
    ).trim();

    const amount = Number(
      e.parameter.requestedAmount
    );

    if (!/^[a-zA-Z0-9._]{1,30}$/.test(username)) {
      throw new Error("Invalid username");
    }

    if (!Number.isInteger(amount) || amount < 1 || amount > 100000) {
      throw new Error("Invalid amount");
    }

    const files = DriveApp.getFilesByName(SHEET_NAME);

    let spreadsheet;

    if (files.hasNext()) {

      spreadsheet = SpreadsheetApp.openById(
        files.next().getId()
      );

    } else {

      spreadsheet = SpreadsheetApp.create(SHEET_NAME);

    }

    let sheet = spreadsheet.getSheetByName("Requests");

    if (!sheet) {

      sheet = spreadsheet.insertSheet("Requests");

      sheet.appendRow([
        "Timestamp",
        "Instagram Username",
        "Requested Followers"
      ]);

    }

    sheet.appendRow([
      new Date(),
      username,
      amount
    ]);

    return ContentService
      .createTextOutput("Success")
      .setMimeType(ContentService.MimeType.TEXT);

  }

  catch (error) {

    return ContentService
      .createTextOutput("Error: " + error.message)
      .setMimeType(ContentService.MimeType.TEXT);

  }

}