
export function createUser(userData) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('http://localhost:8080/auth/signup', {
        method: 'POST',
        body: userData, // assuming userData is already a FormData object
      });
      const data = await response.json();
      resolve({ data });
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
        headers:{'content-type':'application/json'}
      })
      if(response.ok){
        const data = await response.json()
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


export function signOut() {
  return new Promise(async (resolve) =>{
   resolve({data: 'suceess'});
  }
  );
}

  