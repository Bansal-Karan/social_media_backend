# 📱 Social Media Backend

A **Node.js + Express** backend API for a social media platform with user authentication, content creation, and interactive social features (likes, comments, follow system).

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Bansal-Karan/social_media_backend.git
cd social_media_backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and set the following variables:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=social_media_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret_key
```

Or copy from the provided `.env.example`:

```bash
cp .env.example .env
```

### 4. Set Up PostgreSQL Database

Ensure PostgreSQL is running and run:

```bash
npm run setup:db
```

This will create the required tables using the `sql/schema.sql` file.

---

## 🧪 How to Run

### Development mode (with auto-restart):

```bash
npm run dev
```

### Production mode:

```bash
npm start
```

---

## 🔧 Available npm Scripts

| Command                 | Description                                  |
|------------------------|----------------------------------------------|
| `npm start`            | Start app in production mode                 |
| `npm run dev`          | Start app with **nodemon** (development)     |
| `npm run start:verbose`| Start with verbose logging                   |
| `npm run start:critical`| Start with only critical error logging      |
| `npm run setup:db`     | Run the SQL setup script to create tables    |

---

## 📁 Project Structure

```
social_media_backend/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
├── sql/schema.sql
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 📢 API Endpoints

All API routes are prefixed with `/api`.

- **Auth**: `/api/auth/register`, `/api/auth/login`
- **Posts**: `/api/posts`, `/api/posts/my`, `/api/posts/user/:id`
- **Likes**: `/api/likes/:post_id`, etc.
- **Comments**: `/api/comments/:postId`
- **Follow**: `/api/users/:id/follow`

📌 Full details available in `docs/api-collection.json`.

---

## ✅ Features Implemented

- ✅ JWT-based user registration & login
- ✅ Create, view, update, delete posts
- ✅ Like / Unlike posts
- ✅ Comment on posts
- ✅ Follow / Unfollow users
- ✅ Get followers & following users
- ✅ Clean error handling & logging
- ✅ Modular code structure

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Logging**: Custom logger
- **Validation**: Joi
- **Tooling**: Nodemon, Dotenv

---

## 🧑‍💻 Author

**Karan Bansal**  
[GitHub](https://github.com/Bansal-Karan)

---