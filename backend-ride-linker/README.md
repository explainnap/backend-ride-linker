
![Screenshot 2025-04-12 at 13 21 59](https://github.com/user-attachments/assets/e37e5c39-9a39-40f4-b1f0-ef8cbfb8c4c6)


# RideLinker Backend 🚴‍♂️

This is the Express.js backend API for the RideLinker application.  
It handles user authentication, group management, and ride tracking.

## 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT for authentication
- bcrypt for password hashing

## ⚙️ Getting Started

### 1. Clone the repository

bash
    git clone https://github.com/explainnap/backend-ride-linker
    cd backend-ride-linker

### 2. Install dependencies
npm install


### 3. Set up environment variables
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key



### 4. Seed the database
    npm run seed

### 5. Start the server
    npm run dev
    The server will run at:
    http://localhost:3000

### 🧩 API Endpoints

🔑 Auth
POST /auth/sign-up — Register new user
POST /auth/sign-in — Login user

🏘️ Groups
GET /groups — Get all groups
POST /groups/add — Add new group (requires token)
GET /groups/:groupId — Get group with rides
POST /groups/:groupId/add — Add ride to group (requires token)

🚲 Rides
PATCH /groups/rides/:rideId/complete — Mark ride as complete
PATCH /groups/rides/:rideId/incomplete — Mark ride as incomplete




### 🗂️ Folder Structure

backend-ride-linker/
  ├── controllers/         # Route controllers
  ├── db/                  # Database seeding
  ├── middleware/          # Middleware (e.g., verify token)
  ├── models/              # Mongoose models (User, Group, Ride)
  ├── .env                 # Environment variables
  ├── server.js            # Entry point
  └── package.json         # Project manifest


### 🧑‍💻 Usage Notes

The backend requires MongoDB to be running (local or cloud).

JWT tokens are required for protected routes.

Use tools like Postman or Insomnia to test API routes.

Don't forget to run the seed script to populate your database!


### ✅ Future Improvements (stretch goals)

🚀 User profile management

🚀 User commnets

🚀 Tests for routes and controllers

🚀 Better error handling and status codes


### 📃 License

This project is for learning and demo purposes.
