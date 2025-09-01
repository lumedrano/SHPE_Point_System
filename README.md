# Member Points & Check-In System - Luigi Medrano

This project is a Google Apps Script + Google Sheets web app that allows
members to **check in at meetings** and view a **leaderboard of
points**.\
It is organized into two separate apps:

---

## `point_system/` (Meeting Check-In App)

### Purpose

The check-in app is designed for **meeting attendance tracking**.\
Members enter their **EID** and **Meeting ID** during a valid meeting
time slot, and the script records their attendance and awards points in
the spreadsheet.

### How it works

-   **`doGet(e)`** → serves the HTML check-in form.  

-   **HTML form (`index.html`)** → provides a styled check-in page where
    members type their UT EID and Meeting ID.  

-   **`submitForm()` (client-side JS)** → runs when the "Submit" button
    is clicked, calling the server-side script via:

    ```javascript
    google.script.run.addToGoogleSheet(utEid, meetingId);
    ```

-   **`addToGoogleSheet(eid, meetingId)`** (server-side):

    -   Validates that the **EID** exists in the `Members` sheet.  
    -   Validates that the **Meeting ID** exists in the `Meetings`
        sheet.  
    -   Ensures the current date & time fall within the meeting's
        scheduled window.  
    -   Finds the corresponding meeting column in the `Members` sheet.  
    -   Prevents duplicate check-ins (points only awarded once per
        meeting).  
    -   Updates the member's record with the correct **points value**
        for that meeting.

-   **Feedback** → Returns a success or warning message to the user.

### Notes

-   The `Meetings` sheet stores:  
    **Meeting ID | Date | Start Time | End Time | Points**  
-   The `Members` sheet stores:  
    **EID | Name | [Meeting columns...] | Total Points**  
-   Meeting IDs are used as column headers in the `Members` sheet.  
-   `Total Points` are automatically accumulated based on meeting
    points.

---

## `leaderboard/` (Points Leaderboard App)

### Purpose

The leaderboard app displays a **sorted list of members by total
points**.\
It pulls the data directly from the `Total Points` column of the
`Members` sheet.

### How it works

-   **`doGet(e)`**:
    -   Reads the **Name** and **Total Points** columns from the
        `Members` sheet.  
    -   Sorts members by points (descending).  
    -   Passes this data into the HTML template.  
-   **HTML page (`index.html`)**:
    -   Displays the leaderboard in a styled table showing:
        -   **Rank**
        -   **Name**
        -   **Total Points**  
    -   Includes a **search bar** to filter members by name.  
    -   Styled with UT Austin orange theme and animations.

### Notes

-   The leaderboard is **read-only** — it does not update points.  
-   All point updates come from the check-in system.

---

## Summary

-   **`point_system/` app** → Members check in with EID + Meeting ID
    (attendance + points recorded).  
-   **`leaderboard/` app** → Displays a ranked leaderboard of all
    members (reads `Total Points` from `Members` sheet).

Together, they form a complete **points + attendance tracking system**
powered by Google Sheets.

---

## Deployment

To make the check-in app and leaderboard available to members:

1. Open your Apps Script project (`point_system` or `leaderboard`).  
2. Click **Deploy > New deployment**.  
3. Select **Web app** as the deployment type.  
4. Under **Execute as**, choose:  
   - **Me (organization's email address)**  
   This ensures the script runs with your account’s access.  
5. Under **Who has access**, choose:  
   - **Anyone**  
   This allows all members to use the web app.  
6. Click **Deploy** and authorize the permissions if prompted.  
7. After deployment, copy the **Web App URL** provided.  
   - This URL is the link you’ll share with members for check-in or for viewing the leaderboard.

---

## Flow Diagram

```
Member submits EID + Meeting ID
        |
        v
  checkin/index.html
        |
        v
  google.script.run → addToGoogleSheet(eid, meetingId)
        |
        v
   addToGoogleSheet validates:
     - EID in Members
     - Meeting ID in Meetings
     - Meeting date & time match
        |
        v
  Members sheet updated:
     - Meeting column points added
     - Total Points recalculated
        |
        v
Leaderboard script reads Name + Total Points
        |
        v
  leaderboard/index.html displays sorted ranking
```
