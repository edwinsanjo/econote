
# College Notes Sharing App

A full-stack application for sharing college resources like notes, question papers, and more.

## Features

-   **User Authentication**: Register/Login with College & Branch details.
-   **Resource Upload**: Upload PDF/Docs with metadata (Subject, Sem, Type).
-   **Access Control**: Private resources are only visible to students of the same college.
-   **Search & Filter**: Find resources by subject, semester, type.
-   **Reviews & Ratings**: Rate and review resources.

## Tech Stack

-   **Frontend**: Next.js 15, Tailwind CSS, TypeScript.
-   **Backend**: Node.js, Express, MongoDB, TypeScript.

## Setup Instructions

### Backend

1.  Navigate to `backend` folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create `.env` file (or use existing):
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/notes-app
    JWT_SECRET=your_jwt_secret
    ```
4.  Start the server:
    ```bash
    npm run dev
    ```

### Frontend

1.  Navigate to `frontend` folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create `.env.local` file:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000/api
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

## Usage

1.  Register a new account with your College Name.
2.  Upload a resource. Mark it as 'Private' to restrict it to your college.
3.  Browse resources on the home page.
4.  Click on a resource to view details, download, or leave a review.
