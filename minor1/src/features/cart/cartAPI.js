export function addToCart(item) {
  console.log(item);
  return new Promise(async (resolve) =>{
    const response  = await fetch('https://minor-backend-50m4.onrender.com/cart',{
      method:'POST',
      body: JSON.stringify(item),
      headers:{'content-type':'application/json'}
    })
    const data = await response.json()
    resolve({data});
  }
  );

  
}

export function fetchItemsByUserId(userid) {
  return new Promise(async (resolve) =>{
    const response  = await fetch('https://minor-backend-50m4.onrender.com/cart?user='+userid)
    const data = await response.json()
    resolve({data});
  }
  );
}
  
export function updateCart(update) {
  return new Promise(async (resolve) =>{
    const response  = await fetch('https://minor-backend-50m4.onrender.com/cart/'+update.id,{
      method:'PATCH',
      body: JSON.stringify(update),
      headers:{'content-type':'application/json'}
    })
    const data = await response.json()
    resolve({data});
  }
  );
}
  
export function deleteItemFromCart(itemId) {
  return new Promise(async (resolve) =>{
    const response  = await fetch('https://minor-backend-50m4.onrender.com/cart/'+itemId,{
      method:'DELETE',
      headers:{'content-type':'application/json'}
    })
    const data = await response.json()
    resolve({data:{id:itemId}});
  }
  );
}

export function resetCart(userId){
  return new Promise(async (resolve)=>{
const response = await fetchItemsByUserId(userId);
const items = response.data;

for(let item of items){
  await deleteItemFromCart(item.id);
}
resolve({message:'success'});
  });
}