# Member Points & Check-In System - Luigi Medrano

This project is a Google Apps Script + Google Sheets web app that allows members to **check in at meetings** and view a **leaderboard of points**.
It is organized into two separate apps:

---

## `point_system/` (Meeting Check-In App)

### Purpose

The check-in app is designed for **meeting attendance tracking**.
Members enter their **EID** during a valid meeting time slot, and the script records their attendance in the spreadsheet.

### How it works

* **`doGet(e)`** → serves the HTML check-in form.
* **HTML form (`index.html`)** → provides a styled check-in page where members type their UT EID.
* **`submitForm()` (client-side JS)** → runs when the "Submit" button is clicked. Calls the server-side function using:

  ```javascript
  google.script.run.addToGoogleSheet(utEid);
  ```
* **`addToGoogleSheet(eid)`** → server-side entry point. Calls `userClicked()`.
* **`userClicked(eid)`**:

  * Reads the sheet header row to find the current meeting column (based on date & time).
  * Checks if the member’s EID exists in **column B**.
  * If within the valid meeting window, writes `1` into the matching cell to mark attendance.
  * Prevents double check-ins by only allowing one `1` per meeting.
* **Feedback** → success/warning popup is shown to the user, with confetti for successful check-ins 🎉.

### Notes

* Works as long as meeting headers in row 1 follow the format:

  ```
  MM/DD/YYYY hh:mm AM/PM - hh:mm AM/PM
  ```
* **NOTE**: Only one meeting per member per time range is supported. If there are **parallel meetings with identical times**, only the first matching column is used.

---

## `leaderboard/` (Points Leaderboard App)

### Purpose

The leaderboard app displays a **sorted list of members by total points**.
Points are assumed to be pre-calculated into **column N** of the Google Sheet (e.g., using formulas or updates from the check-in system).

### How it works

* **`doGet(e)`**:

  * Reads all names from **column A** and point totals from **column N**.
  * Sorts members by points (descending).
  * Passes this data into the HTML template.
* **HTML page (`index.html`)**:

  * Displays the leaderboard in a table with:

    * Rank
    * Name
    * Points
  * Includes a **search bar** to filter members by name.
  * Styled with UT Austin orange theme and animations.

### Notes

* Totals in **column N** must already be maintained (either by formulas in Sheets or by another script).
* This app is read-only for users (no point updates happen here).

---

## ✅ Summary

* **`point_system/` app** → Members check in during meetings (writes attendance to the sheet).
* **`leaderboard/` app** → Displays a ranked leaderboard of all members by total points (reads from the sheet).

Together, they form a complete **points + attendance tracking system** powered by Google Sheets.

---

## Flow Diagram

```
Member submits EID
        |
        v
  checkin/index.html
        |
        v
  google.script.run → addToGoogleSheet(eid)
        |
        v
     userClicked(eid)
        |
        v
  Spreadsheet Sheet1 (attendance marked)
        |
        v
Leaderboard script reads totals from column N
        |
        v
  leaderboard/index.html displays sorted points
```
