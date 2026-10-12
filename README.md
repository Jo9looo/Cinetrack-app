# 🎬 CineTrack — Movie Discovery & Personal Watchlist

**CineTrack** is a full-stack movie discovery and personal watchlist management web application built for a college assignment on REST API implementation, multi-tier system communication, relational database management, and external API integration.

---

## 🏛️ System Architecture

```text
┌─────────────────────────────────┐
│     React 19 Frontend (Vite)    │
│  Tailwind CSS + React Router 7  │
└────────────────┬────────────────┘
                 │ HTTP / JSON (Axios)
                 ▼
┌─────────────────────────────────┐          ┌──────────────────────┐
│    Express.js REST API Server   │ ───────► │  TMDB External API   │
│       TypeScript + Node.js      │          │ (The Movie Database) │
└────────────────┬────────────────┘          └──────────────────────┘
                 │ Parameterized SQL
                 ▼ (mysql2 connection pool)
┌─────────────────────────────────┐
│   MySQL / MariaDB Database      │
│   (Database: cinetrack_db)      │
│     Table: watchlist            │
└─────────────────────────────────┘
```

### Communication Flow:
1. **Client Request**: The React frontend sends HTTP requests to the Express backend (e.g., `GET /api/movies/trending` or `POST /api/watchlist`).
2. **Backend Intermediary**: The Express backend acts as a secure reverse proxy:
   - For **movie data**, the backend securely appends the `TMDB_API_KEY` and calls the TMDB API, transforming the raw data into clean client contracts. **The frontend never sees or exposes the TMDB API key.**
   - For **watchlist data**, the backend performs CRUD queries against MySQL using parameterized statements.
3. **Database Persistence**: MySQL permanently stores user watchlist items with status tags (`Want to Watch`, `Watching`, `Watched`) and computes live summary statistics.
4. **JSON Response**: Consistent response payloads are returned to the client using standardized JSON envelopes.

---

## 💻 Technology Stack

| Layer | Technologies Used | Description |
|---|---|---|
| **Frontend** | React 19, Vite, TypeScript | Single Page Application (SPA) architecture |
| **Styling** | Tailwind CSS v4, Lucide Icons | Responsive dark theme with rose accents |
| **Routing** | React Router v7 | Client-side routing with clean URLs |
| **HTTP Client** | Axios | REST communication with backend API |
| **Backend** | Node.js, Express.js 4/5, TypeScript | RESTful API server |
| **Validation** | Zod | Request body & query parameter schema validation |
| **Database** | MySQL / MariaDB via `mysql2` | Relational database with connection pooling |
| **External API**| TMDB API v3 | Official movie metadata provider |

---

## 📁 Project Folder Structure

```text
cinetrack/
├── backend/
│   ├── database/
│   │   └── schema.sql             # SQL schema for cinetrack_db and watchlist table
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts              # MySQL connection pool configuration
│   │   │   └── env.ts             # Environment variable validation
│   │   ├── controllers/
│   │   │   ├── movie.controller.ts     # Handles /api/movies endpoints
│   │   │   └── watchlist.controller.ts # Handles /api/watchlist endpoints
│   │   ├── middlewares/
│   │   │   ├── errorHandler.ts    # Centralized error handler & status codes
│   │   │   └── validateRequest.ts # Zod schema validation middleware
│   │   ├── routes/
│   │   │   ├── index.ts           # Top-level API router
│   │   │   ├── movie.routes.ts    # Movie routing
│   │   │   └── watchlist.routes.ts# Watchlist routing
│   │   ├── services/
│   │   │   ├── tmdb.service.ts    # TMDB API communication service
│   │   │   └── watchlist.service.ts # Parameterized SQL query service
│   │   ├── types/                 # TypeScript interfaces
│   │   ├── validators/            # Zod validation schemas
│   │   └── index.ts               # Express application entrypoint
│   ├── .env.example               # Backend environment template
│   ├── .env                       # Local backend environment
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/            # Reusable UI components (MovieCard, StatsCard, etc.)
│   │   ├── context/               # React WatchlistContext for global state sync
│   │   ├── hooks/                 # Custom hooks (useDebounce, etc.)
│   │   ├── pages/                 # DiscoverPage, SearchPage, MovieDetailsPage, WatchlistPage
│   │   ├── services/              # API clients (movieService, watchlistService)
│   │   ├── types/                 # Frontend TypeScript interfaces
│   │   ├── App.tsx                # App router & layout shell
│   │   ├── index.css              # Tailwind CSS styles & typography
│   │   └── main.tsx               # React root entrypoint
│   ├── .env.example               # Frontend environment template
│   ├── .env                       # Local frontend environment
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── cinetrack_postman_collection.json # Ready-to-import Postman test collection
└── README.md                      # Comprehensive project documentation
```

---

## 🚀 Step-by-Step Setup Instructions

### 1. Prerequisites
- **Node.js** (v18+ recommended) and **npm**
- **MySQL** or **MariaDB** (via XAMPP, Laragon, Docker, or native MySQL Server)

---

### 2. Database Setup

1. Start your MySQL service (e.g., in the XAMPP Control Panel, click **Start** next to MySQL).
2. Open phpMyAdmin (`http://localhost/phpmyadmin`) or MySQL CLI:
   ```bash
   mysql -u root -p
   ```
3. Run the schema script located in `backend/database/schema.sql`:
   ```sql
   CREATE DATABASE IF NOT EXISTS cinetrack_db
     CHARACTER SET utf8mb4
     COLLATE utf8mb4_unicode_ci;

   USE cinetrack_db;

   CREATE TABLE IF NOT EXISTS watchlist (
     id INT AUTO_INCREMENT PRIMARY KEY,
     tmdb_id INT NOT NULL,
     title VARCHAR(255) NOT NULL,
     poster_path VARCHAR(255) DEFAULT NULL,
     release_date VARCHAR(50) DEFAULT NULL,
     rating DECIMAL(3, 1) DEFAULT NULL,
     status ENUM('Want to Watch', 'Watching', 'Watched') NOT NULL DEFAULT 'Want to Watch',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     CONSTRAINT unique_tmdb_movie UNIQUE (tmdb_id)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
   ```

---

### 3. Backend Configuration & Start

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `backend/.env`:
   ```env
   PORT=5000
   NODE_ENV=development

   # Database settings (Standard XAMPP default is root with no password)
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=cinetrack_db

   # TMDB API Key (Free key from https://www.themoviedb.org/settings/api)
   TMDB_API_KEY=your_actual_tmdb_api_key_here

   FRONTEND_URL=http://localhost:5173
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend will start on **`http://localhost:5000`** and log:
   `[Database] Connected successfully to MySQL database "cinetrack_db" on localhost:3306`

---

### 4. Frontend Configuration & Start

1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Verify `frontend/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to **`http://localhost:5173`**.

---

## 📡 REST API Reference

All responses follow a consistent envelope:
```json
{
  "success": true,
  "message": "Descriptive status message",
  "data": { ... }
}
```

### Movie Endpoints (TMDB Proxy)

| Method | Endpoint | Description | Query / Params | Status Code |
|---|---|---|---|---|
| `GET` | `/api/movies/popular` | Retrieve popular movies | `?page=1` | `200 OK` |
| `GET` | `/api/movies/trending` | Retrieve daily trending movies | None | `200 OK` |
| `GET` | `/api/movies/search` | Search movies by title | `?q=Inception` | `200 OK` / `400 Bad Request` |
| `GET` | `/api/movies/:tmdbId` | Retrieve detailed movie info | `:tmdbId` (e.g. `27205`) | `200 OK` / `404 Not Found` |

### Watchlist Endpoints (MySQL CRUD)

| Method | Endpoint | Description | Request Body | Status Code |
|---|---|---|---|---|
| `GET` | `/api/watchlist` | Retrieve all saved movies | None (optional `?status=`) | `200 OK` |
| `GET` | `/api/watchlist/stats` | Retrieve live calculated stats | None | `200 OK` |
| `GET` | `/api/watchlist/check/:tmdbId` | Check if movie is saved | `:tmdbId` | `200 OK` |
| `POST` | `/api/watchlist` | Add movie to watchlist | JSON (see below) | `201 Created` / `409 Conflict` |
| `PATCH`| `/api/watchlist/:id` | Update viewing status | `{"status": "Watched"}` | `200 OK` / `404 Not Found` |
| `DELETE`| `/api/watchlist/:id` | Remove movie from watchlist | None | `200 OK` / `404 Not Found` |

#### Sample `POST /api/watchlist` Body:
```json
{
  "tmdbId": 27205,
  "title": "Inception",
  "posterPath": "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
  "releaseDate": "2010-07-15",
  "rating": 8.4,
  "status": "Want to Watch"
}
```

#### Sample `GET /api/watchlist/stats` Response:
```json
{
  "success": true,
  "message": "Watchlist statistics retrieved successfully",
  "data": {
    "total": 2,
    "wantToWatch": 1,
    "watching": 0,
    "watched": 1
  }
}
```

---

## 🧪 Testing with Postman or Thunder Client

A pre-configured Postman collection is included in the project root:
📁 **`cinetrack_postman_collection.json`**

### How to use:
1. Open **Postman** (or VS Code's **Thunder Client**).
2. Click **Import** and select `cinetrack_postman_collection.json`.
3. The collection is already pre-configured with the `{{baseUrl}}` variable pointing to `http://localhost:5000/api`.
4. Run the requests sequentially to verify health checks, TMDB proxying, movie details, database insertions, duplicate rejections (409), status updates, and deletions.

---

## 🎓 College Assignment: Key Technical Decisions Explained

When presenting this project to your lecturers and peers, highlight the following design decisions:

1. **Why use Express as a Backend Proxy for TMDB?**
   - **API Key Security**: If the React frontend called TMDB directly, anyone could inspect network traffic and steal your private API key.
   - **Cross-Origin Resource Sharing (CORS)**: The backend eliminates browser CORS restrictions and provides a consistent interface.
   - **Contract Standardization**: TMDB returns nested and verbose fields; our backend formats them into clean, predictable contracts (`MovieSummary` and `MovieDetail`).

2. **Database Integrity & SQL Injection Prevention**:
   - Every database query uses **parameterized placeholders (`?`)** via `mysql2/promise.execute()`. User inputs are never directly concatenated into SQL strings.
   - A SQL constraint `CONSTRAINT unique_tmdb_movie UNIQUE (tmdb_id)` guarantees database-level prevention of duplicate movie additions.

3. **Live Database Aggregation**:
   - The watch statistics are **never hardcoded** or calculated purely in frontend state.
   - They are queried directly from the MySQL database using `SELECT status, COUNT(*) AS count FROM watchlist GROUP BY status`.

4. **Frontend Architecture & UX**:
   - **Debouncing**: `useDebounce` hook buffers search queries for 400ms, preventing wasteful API calls while typing.
   - **Global State Synchronization**: `WatchlistContext` ensures that adding or changing a movie's status immediately updates the navbar badge, statistics counters, and card buttons across all routes.
