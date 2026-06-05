# SocialPost — Mini Social Post Application

A full-stack social media application built with React.js, Node.js/Express, and MongoDB. Users can create accounts, share posts (text/images), browse a public feed, and interact through likes and comments.

## 🚀 Features

- **Authentication** — Signup & Login with JWT-based sessions
- **Create Posts** — Share text, images, or both
- **Public Feed** — Browse all posts in chronological order
- **Like & Comment** — Interact with posts from other users
- **Pagination** — Efficient "Load More" pagination
- **Responsive Design** — Optimized for mobile and desktop
- **Modern UI** — Clean design inspired by TaskPlanet Social Feed

## 🛠️ Tech Stack

| Layer      | Technology             |
|------------|------------------------|
| Frontend   | React.js + Material UI |
| Backend    | Node.js + Express      |
| Database   | MongoDB (Mongoose)     |
| Auth       | JWT (jsonwebtoken)     |
| File Upload| Multer                 |
| HTTP Client| Axios                  |

## 📁 Project Structure

```
├── backend/
│   ├── middleware/
│   │   └── auth.js            # JWT verification middleware
│   ├── models/
│   │   ├── User.js            # User schema (username, email, password)
│   │   └── Post.js            # Post schema (text, image, likes, comments)
│   ├── routes/
│   │   ├── auth.js            # Signup, Login, Get User endpoints
│   │   └── posts.js           # CRUD, Like, Comment endpoints
│   ├── uploads/               # Uploaded images directory
│   ├── server.js              # Express server entry point
│   ├── .env                   # Environment variables
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js      # Top navigation bar
│   │   │   ├── CreatePost.js  # Post creation form
│   │   │   └── PostCard.js    # Individual post card
│   │   ├── context/
│   │   │   └── AuthContext.js # Auth state management
│   │   ├── pages/
│   │   │   ├── Login.js       # Login page
│   │   │   ├── Signup.js      # Signup page
│   │   │   └── Feed.js        # Main social feed
│   │   ├── api.js             # Axios instance with interceptors
│   │   ├── App.js             # Routes & MUI theme
│   │   ├── index.js           # React entry point
│   │   └── index.css          # Global styles & animations
│   └── package.json
│
└── README.md
```

## ⚙️ Setup & Installation

### Prerequisites

- Node.js 16+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/social-post-app.git
cd social-post-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/socialapp?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Optionally create a `.env` file for API URL:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm start
```

The app will be available at `http://localhost:3000`.

## 📡 API Endpoints

### Auth
| Method | Endpoint          | Description        | Auth  |
|--------|-------------------|--------------------|-------|
| POST   | `/api/auth/signup` | Create new account | No    |
| POST   | `/api/auth/login`  | Login              | No    |
| GET    | `/api/auth/me`     | Get current user   | Yes   |

### Posts
| Method | Endpoint                 | Description          | Auth  |
|--------|--------------------------|----------------------|-------|
| GET    | `/api/posts`             | Get all posts (feed) | No    |
| GET    | `/api/posts/:id`         | Get single post      | No    |
| POST   | `/api/posts`             | Create new post      | Yes   |
| PUT    | `/api/posts/:id/like`    | Toggle like          | Yes   |
| POST   | `/api/posts/:id/comment` | Add a comment        | Yes   |
| DELETE | `/api/posts/:id`         | Delete own post      | Yes   |

## 🗃️ MongoDB Collections

Only **two collections** are used:

1. **users** — Stores user accounts (username, email, hashed password)
2. **posts** — Stores posts (text, image, likes[], comments[])

## 🌐 Deployment

### Frontend (Vercel/Netlify)

1. Push `frontend/` to a GitHub repo
2. Connect to Vercel/Netlify
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Add environment variable: `REACT_APP_API_URL=https://your-backend.onrender.com/api`

### Backend (Render)

1. Push `backend/` to a GitHub repo
2. Create a new Web Service on Render
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add environment variables: `MONGODB_URI`, `JWT_SECRET`, `PORT`

### Database (MongoDB Atlas)

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Whitelist IP `0.0.0.0/0` for access
4. Use the connection string in your backend `.env`

## 📸 Screenshots

| Login Page | Social Feed |
|:---:|:---:|
| Gradient background with glassmorphism card | Create post, feed cards, like & comment |

## 📝 License

This project was built as part of the **3W Full Stack Internship Assignment**.
