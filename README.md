# Drawkitect

Drawkitect is a full-stack, state-persistent digital whiteboard application that empowers users to create, manage, and seamlessly store hand-drawn style diagrams and notes. Designed with a modern, responsive interface and robust backend architecture, it delivers a smooth and reliable drawing experience.

## Features

- **Robust Authentication & Security:** 
  - Secure user authentication system using JWTs.
  - Frontend Axios interceptors automatically managing token injection for protected API requests.
  - Backend authorization middleware strictly enforcing Canvas ownership and access control protocols.

- **Dynamic Canvas Dashboard:** 
  - Comprehensive dashboard using React and Shadcn UI, allowing users to effortlessly view, filter (My Canvases, Shared, Home), and manage their whiteboard files.
  - Seamless CRUD operations, including asynchronous canvas deletion integrated with custom animated confirmation dialogs.

- **Advanced Whiteboard Engine:** 
  - Powered by `Rough.js` and `Perfect-Freehand` for an interactive whiteboard featuring brush strokes, lines, rectangles, circles, arrows, and text rendering.
  - Advanced canvas functionalities including an Eraser tool, Undo/Redo history stack, and a "Download as PNG" export feature.
  - Complex drawing state managed using React Context API (`BoardProvider` and `ToolboxProvider`) and `useReducer` to isolate and organize tool behaviors.

- **Intelligent State Persistence:** 
  - Robust data pipeline to persist complex graphical data to a MongoDB database. 
  - Custom deserialization algorithm that intercepts raw JSON from the database and dynamically rebuilds non-serializable browser objects (such as `Path2D` for freehand strokes and `rough.generator()` instances for shapes), guaranteeing pixel-perfect state restoration when users reopen their canvases.

- **Modern UI/UX Implementation:** 
  - Premium, highly responsive user interface using Tailwind CSS and pre-styled Shadcn components.
  - Framer Motion for micro-animations, smooth element transitions, and dropdown menus.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Shadcn UI, Framer Motion, Rough.js, Perfect-Freehand.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT).

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB URI for database connection

### Backend Setup
1. Navigate to the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Set up your `.env` file with `MONGO_URI` and `JWT_SECRET`
4. Start the server: `npm start`

### Frontend Setup
1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
