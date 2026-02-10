# SplitMint Server

Backend API for the SplitMint expense sharing application. Built with Node.js, Express, and Prisma (SQLite).

## Prerequisites

-   Node.js (v18+)
-   npm

## Installation

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

## Configuration

1.  Create a `.env` file in the `server` directory (or use the existing one):
    ```env
    PORT=3000
    DATABASE_URL="file:./dev.db"
    JWT_SECRET="your_secret_key_here"
    NVIDIA_API_KEY="your_nvidia_api_key_here"
    ```
    *Note: `NVIDIA_API_KEY` is required for the MintSense AI Chatbot.*

## Database Setup

1.  Generate Prisma client:
    ```bash
    npx prisma generate
    ```
2.  Push schema to database (creates `dev.db`):
    ```bash
    npx prisma db push
    ```

## Running the Server

-   Start the development server:
    ```bash
    npm start
    ```
    The server will run at `http://localhost:3000`.

## API Endpoints

-   `POST /api/auth/register` - Create account
-   `POST /api/auth/login` - Login
-   `GET /api/groups` - List groups
-   `POST /api/groups` - Create group
-   `POST /api/chat` - AI Chat (Streaming)
