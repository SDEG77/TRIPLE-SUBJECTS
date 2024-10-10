# Our Project for Jesboy & the Other Two

> This is a project that uses Express and Mongo DB.
> Please like and subscribe mothertrucker.

|                  MEMBERS                    |
|:-------------------------------------------:|
|      **```[ Backend Developers ]```**       |
|          **Sigrae Derf Gabriel**            | 
|             **Romark Bayan**                |
|  **```[ Frontend Developers & UI/UX ]```**  |
|           **John Anthony Pesco**            |
|           **Ace Cornico Padilla**           |
|       **```[ Fulltank Developer ]```**      |
|          **John Michael Jonatas**           |

---
---
---

# FRONTENDS (TODOS)

- [ ] **FRONTEND FINISHED**

---

## Misc.
- [ ] **MISC FINSIHED**
- [ ] Give all hover effects a transition

---

## Landing Page
- [ ] **PAGE FINISHED**
> ***HEADER***
- [ ] Fix the close function for the yellow notification at the top of the page. **(The notif closes when you click any part of the div, which is wrong)**
- [ ] Give the "Login", "Get Started", and "Client" buttons hover effects
- [ ] Give the "Ark Vision" an href to the #home section
- [ ] Give all hrefs an active effect if clicked or window is currently viewing the section
- [ ] **FINISHED ALL TASKS**

> ***HOME SECTION***
- [ ] Give the "Signup for Free" & "Learn more Ark Vision" hover effects
- [ ] **FINISHED ALL TASKS**
  
> ***SERVICE SECTION***
- [ ] Give the "BOOK NOW" button a hover effect
- [ ] Link the "BOOK NOW" buttons to the intended page
- [ ] **FINISHED ALL TASKS**

> ***PRICING SECTION*** 
- [ ] Give the "AVAIL NOW" button a hover effect
- [ ] Give a hover effect for the Digital Packages divs
- [ ] Make the "UNLI, SHOT GET ENHANCED PHOTO" better UX wise
- [ ] Fix capitalization on the pricing names 
- [ ] Link the "AVAIL NOW" buttons to the intended page
- [ ] **FINISHED ALL TASKS**

> ***CONTACT US SECTION*** 
- [ ] Make the map an iframe for the actual location
- [ ] Turn the message input into a textarea input. Remove the resize function of the textarea
- [ ] Give submit button a hover effect 
- [ ] **FINISHED ALL TASKS**

> ***FOOTER***
- [ ] Balance the components so there is no more empty space 
- [ ] **FINISHED ALL TASKS**

---
## REGISTER PAGE
- [ ] **PAGE FINISHED**

> ***REGISTER MODAL***
- [ ] Improve the UX of this page
- [ ] Make the "login" anchor much easier to see
- [ ] Give focus effect for all inputs
- [ ] Decrease font size of inputted text
- [ ] Give the submit button a hover effect
- [ ] Make the submit button bigger
- [ ] **FINISHED ALL TASKS**

---
## LOGIN PAGE
- [ ] **PAGE FINISHED**

> ***LOGIN MODAL***
- [ ] Improve the UX of this page
- [ ] Make all of the links easier to read
- [ ] Give focus effect for all inputs
- [ ] Give the submit button a hover effect
- [ ] Make the submit button bigger
- [ ] **FINISHED ALL TASKS**

---
## FORGOT PASSWORD PAGE
- [ ] Improve the UX of this page
- [ ] Make all of the links easier to read
- [ ] Give focus effect for all inputs
- [ ] Give the submit button a hover effect
- [ ] Add more padding to submit button
- [ ] **FINISHED ALL TASKS**

---

## BOOKING PAGE
- [ ] Style the radio & checkbox button
- [ ] Fix the active state of the nav bar (currently active is ALBUM, which is wrong)
- [ ] Make the date icon white. The icon is blending in with the BG
- [ ] Give "Select All" & "Deselect All" their own styling when active
- [ ] Make "CLEAR ALL" button more easier to find
- [ ] Give "Book Now" & "Submit Receipt" hover effects
- [ ] **FINISHED ALL TASKS**

---

## PROFILE PAGE
- [ ] Fix the sidebar div: the email is overflowing out of the box
- [ ] Give "Edit Profile" & "Save Changes" hover effect
- [ ] **FINISHED ALL TASKS**

---

## GALLERY PAGE
- [ ] **FINISHED ALL TASKS**

---

## ADMIN PAGE
- [ ] Provide the missing images for the img tags
- [ ] Give the delete and cancel buttons their own confirmation modal "Are you sure you want to blah blah blah"
- [ ] Make hamburger icon bigger
- [ ] Fix the margin for the "Logout" button in Photo Management Page
- [ ] **FINISHED ALL TASKS**

---
---
---

# BACKENDS (TODOS)
- [ ] ***BACKEND FINISHED***

---

## Misc.
- [ ] Make the guest middleware
- [ ] Make the client middleware
- [ ] Make the admin middleware
- [ ] **MISC FINISHED**

---

## Landing Page
- [ ] **LANDING PAGE FINISHED**

> ***HEADER***
- [ ] Make the register notif disappear once logged in
- [ ] **HEADER FINISHED**

> ***CONTACT US SECTION***
- [ ] Make the form submission functional
- [ ] **CONTACT US FINISHED**

---
## Register Page

- [X] Register Function
- [X] Unique Email Rule
- [X] Hashed Password
- [X] Redirect to login page after signup
- [X] Make error message if email is taken
- [X] **REGISTER PAGE FINISHED**

---

## **Login Page**
- [X] Login Function
- [X] Make error message if wrong credentials
- [ ] Remember me function
- [ ] Create session one logged in
- [ ] **LOGIN PAGE FINISHED**

---

## **Forgot Password Page**
- [ ] Fix the new password page's linking of Tailwind
- [ ] Send verification email
- [ ] Give a waiting function to the verification page after email sent (300 seconds)
- [ ] After receiving confirmation, redirect to change password page
- [ ] Change password function
- [ ] **FORGOT PASSWORD PAGE FINISHED**

---
## ADMIN PAGE
- 
Admin Dashboard Management
--------------------------
-[ ] Dashboard Overview
  -[ ] Implement a dashboard to view booking statistics, such as total bookings and most  popular packages.
  -[ ] Fetch and display confirmed bookings with detailed booking information, including client details, selected services, add-ons, and payment status.

User Management
---------------
-[ ] Implement CRUD operations for client accounts.
  -[ ] Add, edit, delete, and retrieve user profiles.
 

Booking Management
------------------
-[ ] Implement CRUD operations for bookings.
  -[ ] Create, view, update, and delete bookings from the admin panel.
  -[ ] Set up a notification system for new bookings and updates to existing bookings.
  -[ ] Develop logic for handling booking statuses (e.g., pending, confirmed, completed, canceled).
  -[ ] Allow admins to approve or cancel bookings as necessary.

Photo Management
----------------
-[ ] Enable file upload for gallery photos linked to user bookings.
  -[ ] Organize uploaded photos according to specific bookings for easy retrieval.
  -[ ] Provide functionality to delete photos from users’ galleries.

Service Management
------------------
-[ ] Implement CRUD functions for managing services.
  -[ ] Add, edit, delete, and retrieve information about available services.

Package Management
------------------
-[ ] Implement CRUD functions for packages.
  -[ ] Allow the admin to create, update, delete, and view packages offered in the booking system.

Add-Ons Management
------------------
-[ ] Implement CRUD operations for add-ons (e.g., extra time, additional packages).
  -[ ] Associate add-ons with specific bookings and adjust booking totals accordingly.

Payment Verification
--------------------
-[ ] Enable functionality to verify GCash payment receipts uploaded by users.
  -[ ] Create an admin interface to mark payments as verified or rejected.
  -[ ] Automatically confirm bookings upon successful payment verification.

Reporting and Analytics
-----------------------
-[ ] Implement a dashboard section for viewing booking statistics, such as total bookings and most popular packages.
  -[ ] Set up report generation for analyzing booking trends and revenue tracking.
  -[ ] Provide options for exporting booking and payment data for financial record-keeping.

Security and Access Control
---------------------------

  -[ ] Ensure logging of all key activities (e.g., booking approvals, payment verifications, user management actions).


---
---
---
| FINISHED TASKS |
|:---:|
|Make a page for the email verification (FRONT/FORGOT)|
|Make a page for the change old password (FRONT/FORGOT)|

~~***very good, binasa mo lahat!***~~