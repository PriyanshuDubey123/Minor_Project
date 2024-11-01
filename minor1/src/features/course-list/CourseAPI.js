
export function fetchAllCourses() {
  return new Promise(async (resolve) =>{
    const response  = await fetch('http://localhost:8080/courses')
    const data = await response.json()
    resolve({data});
  }
  );
}

export function fetchCoursesByFilters(filter,sort,pagination,userId) {

  let queryString =  `userId=${userId}&`;

  for(let key in filter){
    const categoryValues = filter[key]
    if(categoryValues.length>0){
    const lastCategoryValue = categoryValues[categoryValues.length-1];
    queryString += `${key}=${lastCategoryValue}&`
    }
  }

  for(let key in sort){
    queryString += `${key}=${sort[key]}&`
  }

  for(let key in pagination){
    queryString += `${key}=${pagination[key]}&`
  }



  return new Promise(async (resolve) =>{
    console.log(queryString);
    const response  = await fetch('http://localhost:8080/courses?'+queryString)
    const data = await response.json()
    const totalItems = await response.headers.get('X-Total-Count');
    resolve({data:{courses:data,totalItems:+totalItems}});
  }
  );
}
  
export function fetchCategories(){
  return new Promise(async (resolve)=>{
    const response = await fetch('http://localhost:8080/categories');
    const data = await response.json()
    resolve({data})
  })
};
export function fetchLanguages(){
  return new Promise(async (resolve)=>{
    const response = await fetch('http://localhost:8080/languages');
    const data = await response.json()
    resolve({data})
  })
};

export function fetchCourseById(id){
  return new Promise(async (resolve)=>{
    const response = await fetch('http://localhost:8080/courses/'+id);
    const data = await response.json()
    resolve({data})
  })
};

export function createCourse(product){
  return new Promise(async (resolve)=>{
    const response = await fetch('http://localhost:8080/courses/',{
      method:'POST',
      body:JSON.stringify(product),
      headers:{'content-type':'application/json'}
    });
    const data = await response.json()
    resolve({data})
  })
};

export function updateCourse(update){
  return new Promise(async (resolve)=>{
    const response = await fetch('http://localhost:8080/courses/'+update.id,{
      method:'PATCH',
      body:JSON.stringify(update),
      headers:{'content-type':'application/json'}
    });
    const data = await response.json()
    resolve({data})
  })
};