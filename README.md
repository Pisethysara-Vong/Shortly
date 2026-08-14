# Shortly: A Full-Stack URL Shortener
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/Pisethysara-Vong/Shortly)

Shortly is a modern, full-stack URL shortener application built with Next.js and TypeScript. It allows users to create, manage, and track their short links through a clean and intuitive interface. The application supports both standard user accounts and a dedicated admin role for system-wide monitoring.

## Features

- **Secure Authentication**: Sign up and log in with email/password or Google OAuth.
- **URL Management**: Create short links from long URLs, with optional expiration dates.
- **User Dashboard**: View, copy, and delete your personal shortened URLs.
- **Click Tracking**: Monitor the total click count for each of your links.
- **Admin Panel**: A read-only dashboard for administrators to view all URLs across the platform.
- **User-Specific Filtering**: Admins can filter the system-wide URL list by the creator's email address.
- **Responsive UI**: A clean and modern interface built with shadcn/ui and Tailwind CSS that works on all devices.
- **Automatic Token Refresh**: Seamless session management using Axios interceptors to handle JWT refresh logic without interrupting the user experience.

## Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui, Radix UI, Lucide React
- **State Management**: Zustand, React Context
- **Authentication**: `@react-oauth/google`, JWT (client-side handling)
- **API Communication**: Axios

## Project Structure

The repository is organized to separate concerns and improve maintainability.

```
/
├── app/                  # Next.js App Router pages and layouts
├── components/           # Reusable React components (UI, Auth, Admin, User)
├── context/              # React Context providers (e.g., AuthContext)
├── hooks/                # Custom React hooks for business logic
├── lib/                  # Utility functions and helpers
├── services/             # API layer with Axios instance and endpoint definitions
├── stores/               # Zustand stores for global state management
└── types/                # TypeScript type definitions for API and shared models
```

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v20 or later)
- npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/pisethysara-vong/shortly.git
    cd shortly
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the necessary environment variables. You can use the example below as a template.

    ```env
    # The base URL of your backend API
    NEXT_PUBLIC_API_URL=http://localhost:4444/api

    # The public-facing base URL for the shortened links (the URL of the redirector service)
    NEXT_PUBLIC_BASE_URL=http://localhost:4444

    # Your Google Cloud project's OAuth 2.0 Client ID for Google login
    NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```

    Open [http://localhost:4000](http://localhost:4000) with your browser to see the result.

## Available Scripts

In the project directory, you can run:

-   `npm run dev`: Runs the app in development mode.
-   `npm run build`: Builds the app for production.
-   `npm run start`: Starts a production server.
-   `npm run lint`: Runs ESLint to analyze the code for potential errors.
