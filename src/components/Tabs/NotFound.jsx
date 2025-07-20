import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  };

  const textCenterStyle = {
    textAlign: 'center',
  };

  const headingStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  };

  const messageStyle = {
    fontSize: '1.25rem',
    color: '#4b5563',
    marginBottom: '1rem',
  };

  const linkStyle = {
    color: '#3b82f6',
    textDecoration: 'underline',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <div style={textCenterStyle}>
        <h1 style={headingStyle}>404</h1>
        <p style={messageStyle}>Oops! Page not found</p>
        <a href="/" style={linkStyle}>Return to Home</a>
      </div>
    </div>
  );
};

export default NotFound;
