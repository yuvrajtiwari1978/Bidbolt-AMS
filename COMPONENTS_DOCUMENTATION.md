# COMPONENTS DOCUMENTATION

## Backend Overview
The backend is built using **Express.js**, providing a RESTful API for the application. It connects to a **MongoDB** database using **Mongoose**.

### Dependencies
- **axios**: For making HTTP requests.
- **bcryptjs**: For hashing passwords.
- **cors**: To enable Cross-Origin Resource Sharing.
- **dotenv**: For loading environment variables.
- **express**: The web framework for building the API.
- **express-validator**: For validating request data.
- **helmet**: For securing HTTP headers.
- **jsonwebtoken**: For handling JSON Web Tokens.
- **mongoose**: For MongoDB object modeling.
- **morgan**: For logging HTTP requests.

### Middleware
- **CORS**: Configured to allow requests from specific origins.
- **Helmet**: Enhances security by setting various HTTP headers.
- **Morgan**: Logs HTTP requests for monitoring.

### Routes
- **User Routes**: Manage user-related operations (CRUD).
- **Authentication Routes**: Handle user registration, login, and profile retrieval.
- **Auction Routes**: Manage auction-related operations.

### Database Connection
The application connects to MongoDB using the following configuration:
```javascript
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auctionapp';
```
It handles connection events and retries on failure.

## Frontend Overview
The frontend is built using **React** with **TypeScript** and utilizes **Vite** as the build tool.

### Dependencies
- **@splinetool/react-spline**: For 3D rendering.
- **@stripe/react-stripe-js**: For integrating Stripe payments.
- **axios**: For making HTTP requests.
- **react**: The core library for building user interfaces.
- **react-dom**: For DOM rendering.
- **react-router-dom**: For routing.
- **tailwindcss**: For styling.

### Components
- **App**: The main application component.
- **Pages**: Various pages like Home, Profile, Auction Detail, etc.
- **Layout**: Common layout components for consistent UI.

### Styling and Build Process
The application uses **Tailwind CSS** for styling and is built using **Vite**, which provides fast development and build times.
