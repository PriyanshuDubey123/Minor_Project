import axios from "axios";

export function createUser(userData) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('http://localhost:8080/auth/signup', {
        method: 'POST',
        body: userData, // assuming userData is already a FormData object
        credentials: 'include', 
      });

    
       if(response.ok){
      const data = await response.json();
      resolve({ data });}
      else{
        const error = await response.json()
        reject(error?.message);
      }
    } catch (error) {
      reject(error);
    }
  });
}


export function loginUser(loginInfo) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        body: JSON.stringify(loginInfo),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      // Check if the response is ok (status 2xx)
      if (response.ok) {
        const data = await response.json(); // Parse the response data
        resolve({ data });
      } else {
        // If the response is not ok, parse the error response and reject
        const error = await response.json(); // Parse the error message as JSON
        console.log('Login failed:', error);
        reject(error.message || 'An unknown error occurred'); // Reject with the error message or a fallback
      }
    } catch (err) {
      // Catch any network or unexpected errors and reject
      console.error('Request error:', err);
      reject('Network error or server not reachable');
    }
  });
}



export async function signOut(role = "user") {
  try {
    const response = await axios.post("http://localhost:8080/auth/signout",{role},{ withCredentials: true });

    if (response.status === 200) {
      return { success: true, message: "Successfully signed out" };
    } else {
      return { success: false, message: "Failed to sign out" };
    }
  } catch (error) {
    console.error("Sign out error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred during sign out",
    };
  }
}


  