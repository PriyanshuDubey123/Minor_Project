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
  return new Promise(async (resolve,reject) =>{
   
    try{
      const response  = await fetch('http://localhost:8080/auth/login',{
        method:'POST',
        body: JSON.stringify(loginInfo),
        headers:{'content-type':'application/json'},
        credentials: 'include', 
      })
      if(response.ok){
        const data = await response.json()
        console.log(data);
        resolve({data});
      }
      else{
        const error = await response.text()
        reject(error);
      }
    }
    catch(err){
      reject(err);
    }
  }
  );
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


  