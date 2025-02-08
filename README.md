# Offline Demo App

## **Getting Started**

This app allows you to manage a list of users with functionalities to add, edit, delete, and view user details using an SQLite database.

### **Installation**

To get started, run the following command in your terminal:

```bash
npm install
npx expo start
```

Follow the instructions displayed on the terminal to launch the app on your emulator, device, or web browser.

---

## **App Functionalities**

### **1. User Management Features**

- **View Users:**

  - Displays a list of users fetched from the SQLite database.
  - User cards show essential information, including name, email, and role.

- **Add User:**

  - Form-based input for creating a new user.
  - Validations for mandatory fields like Name, Email, Password, and Role.
  - Automatically assigns creation and update timestamps along with a random user ID.

- **Edit User:**

  - Edit user details directly on the user card.
  - Switches to "Save" mode after editing.
  - Validates fields before submission.

- **Delete User:**
  - Remove user entries from the database.

### **2. Offline Storage with SQLite Database**

- The app uses SQLite to store and manage user data.
- Supports CRUD operations such as:
  - Create: Add user details to the database.
  - Read: Fetch all users and display them.
  - Update: Modify user information.
  - Delete: Remove user records.

### **Database Schema**

The `users` table contains the following fields:

- **id:** Unique identifier for the user (auto-generated)
- **email:** User's email address
- **password:** User's password
- **name:** User's name
- **role:** User role (`customer` or `admin`)
- **avatar:** User avatar (optional)
- **creationAt:** Record creation timestamp
- **updatedAt:** Record last update timestamp

---

## **Usage Instructions**

1. **Start the App:** Run the app using `npx expo start`.
2. **View Users:** Navigate to the user list.
3. **Add User:** Click the "Add User" button and fill out the form.
4. **Edit User:** Tap the "Edit" button on any user card, make changes, and save.
5. **Delete User:** Tap the "Delete" button to remove a user.

---

## **Development Notes**

- **Database Integration:**
  - Uses Expo SQLite for offline data storage.
- **Data Handling:**
  - Proper error handling for database operations.
- **State Management:**
  - Redux is used for managing app state.
- **Optimized UI:**
  - FlatList is utilized for efficient user list rendering.
- **Validation:**
  - Form fields are validated for required inputs during user addition and editing.
