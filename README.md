# InterBit

This is a comprehensive **AI Interview Platform** designed to help users prepare for technical interviews. It connects users with expert mentors and provides AI-driven interview experiences.

## Key Features

-   **User Management**: Secure authentication (Sign up, Login, Password Management) with role-based access (User, Mentor, Admin). Users can also update their profile details.
-   **Admin Dashboard**: Comprehensive dashboard for admins to manage users and mentors (including deletion), and view platform statistics.
-   **Mentor System**: Browse and connect with mentors across various specialties (e.g., AI/ML, Frontend, Data Science).
-   **Interview Scheduling**: Schedule interviews with mentors or AI.
-   **Interview Tracking**: Track interview status (Scheduled, Completed, Cancelled), duration, and feedback.
-   **Performance Metrics**: Store and view interview scores and detailed feedback.
-   **AI Integration**: AI-powered interview sessions and feedback generation.

## 📚 Detailed Documentation

*   [**Backend Overview**](./BACKEND_OVERVIEW.md): Detailed API and Database schema analysis.
*   [**Frontend Overview**](./FRONTEND_OVERVIEW.md): Page structure, component analysis, and filtering logic.
*   [**User-Mentor Flow**](./USER_MENTOR_FLOW.md): Step-by-step guide to the booking and mentor lifecycle.
*   [**App Flow & API Mapping**](./APP_FLOW_AND_API_MAPPING.md): Comprehensive table mapping user actions to API calls.

## Data Model

The application uses a relational database managed by Prisma with the following core entities:
-   **User**: The platform users (candidates).
-   **Mentor**: Experts available for conducting interviews.
-   **Interview**: The core session entity linking Users and Mentors, storing technical stack details, questions, scores, and feedback.

The project is divided into two main parts:

-   **Backend**: A Node.js/Express server handling API requests, authentication, and database interactions using Prisma.
-   **Frontend**: A Next.js application providing a modern, responsive user interface with AI capabilities.

## Tech Stack

### Backend
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database ORM**: Prisma
-   **Authentication**: JSON Web Tokens (JWT), bcrypt
-   **AI Integration**: Google AI SDK
-   **Other Tools**: Dotenv, CORS

### Frontend
-   **Framework**: Next.js 15 (React 19)
-   **Styling**: Tailwind CSS v4, Tailwind Merge, CLSX
-   **UI Components**: Radix UI, Lucide React, Sonner (Toast), Recharts
-   **Forms & Validation**: React Hook Form, Zod
-   **AI Integration**: Vapi AI Web
-   **Utilities**: Date-fns, Dayjs, Axios

## Features

-   **User Authentication & Profile**: Secure login, registration, and profile management (update username, email, password).
-   **Role-Based Access**:
    -   **User**: Book interviews, take AI interviews, view history.
    -   **Mentor**: specialized dashboard to manage requests, accept/reject bookings, mark completion.
    -   **Admin**: Dedicated admin dashboard for managing platform users and mentors.
-   **Interview Booking System**: complete flow (Mentor -> Time -> Confirm) with email notifications (stubbed).
-   **AI-Powered Interactions**: Integration with Vapi AI and Google AI for intelligent features.
-   **Responsive Design**: Modern UI built with Radix UI and Tailwind CSS.
-   **Data Management**: Efficient data handling with Prisma and React Query concepts.
-   **Dashboard/Charts**: Visual data representation using Recharts.

## Getting Started

### Prerequisites
-   Node.js (v20 or higher recommended)
-   npm or yarn
-   PostgreSQL (or your configured database for Prisma)

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    -   Create a `.env` file based on `.env.example` (if available) or ensure you have `DATABASE_URL`, `JWT_SECRET`, and AI API keys.
4.  Run database migrations:
    ```bash
    npx prisma migrate dev
    ```
5.  Start the server:
    ```bash
    npm start
    ```

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    -   Create a `.env.local` file with necessary API keys and backend URL.
4.  Run the development server:
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

-   **Backend**:
    -   `npm start`: Starts the backend server.
-   **Frontend**:
    -   `npm run dev`: Starts the Next.js development server.
    -   `npm run build`: Builds the application for production.
    -   `npm run start`: Starts the production server.
    -   `npm run lint`: Runs Biome check.
    -   `npm run format`: Formats code using Biome.
