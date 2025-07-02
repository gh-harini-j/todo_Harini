import React from 'react'; // Import the React library for building UI components
import ReactDOM from 'react-dom/client'; // Import ReactDOM for rendering the app to the DOM
import App from './App'; // Import the main App component
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter for routing support
import { AuthProvider } from './AuthContext'; // Import AuthProvider for authentication context
import './index.css'; // Import global CSS styles

ReactDOM.createRoot(document.getElementById('root')).render(
  // Create a root and render the app inside the element with id 'root'
  <React.StrictMode>
    {/* Enable additional checks and warnings in development mode */}
    <BrowserRouter>
      {/* Provide routing context to the App component */}
      <AuthProvider>
        {/* Provide authentication context to the App component */}
        <App />
        {/* Render the main App component */}
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
