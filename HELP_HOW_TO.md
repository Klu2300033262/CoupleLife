# How to Get Your Credentials (Guide)

Follow these steps to set up the necessary connections for CoupleLife OS.

## 1. MySQL Setup (Local)

If you have MySQL installed on your computer:

1.  **Open your MySQL Terminal** or a tool like Workbench.
2.  **Check Credentials**:
    - **Host**: `localhost`
    - **User**: Usually `root`
    - **Password**: Whatever you set during installation.
3.  **Create the Database**: Run this command to create the project database:
    ```sql
    CREATE DATABASE couplelife_os;
    ```
4.  **Update `.env`**: Put these values into your `server/.env` file.

---

## 2. Firebase Credentials (Client)

This is needed for the Frontend (Chat, Login UI).

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **"Add Project"** and name it "CoupleLife OS".
3.  Once the project is ready, click the **Web icon (`</>`)** to add an app.
4.  Register the app (you don't need "Firebase Hosting" for now).
5.  You will see a `firebaseConfig` object. Copy those values into `client/.env.local`:
    - `apiKey` → `NEXT_PUBLIC_FIREBASE_API_KEY`
    - `authDomain` → `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
    - ...and so on.

---

## 3. Firebase Admin SDK (Backend)

This is needed for the Server to verify users and send push notifications.

1.  In the Firebase Console, click the **Gear Icon (Project Settings)** in the top left.
2.  Go to the **Service Accounts** tab.
3.  Click **"Generate new private key"**.
4.  A `.json` file will download. Open it and copy the following into `server/.env`:
    - `project_id` → `FIREBASE_PROJECT_ID`
    - `client_email` → `FIREBASE_CLIENT_EMAIL`
    - `private_key` → `FIREBASE_PRIVATE_KEY` (Keep the quotes around it!)

---

## 🛠️ Still having trouble?

If you don't have MySQL installed yet, I recommend downloading [XAMPP](https://www.apachefriends.org/index.html) (comes with MySQL) or [MySQL Installer](https://dev.mysql.com/downloads/installer/).

If you want a **cloud database**, you can use [PlanetScale](https://planetscale.com/) or [Railway](https://railway.app/) for MySQL.
