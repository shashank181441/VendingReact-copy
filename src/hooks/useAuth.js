import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Replace with your logic to fetch user info and check if they're logged in
    const accessToken = localStorage.getItem('accessToken');
    
    if (accessToken) {
      // Assume fetchUserFromToken is a function that fetches user data using the token
      const userInfo = fetchUserFromToken(accessToken);
      setIsAuthenticated(true);
      setUser(userInfo);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  return { isAuthenticated, user };
};

const fetchUserFromToken = (token) => {
  // Implement logic to decode token or fetch user details
  // For this example, let's assume the user info is decoded from the token
  return {
    isAdmin: true,  // Change based on actual user role data
    name: 'Admin User',
    // Other user details
  };
};
