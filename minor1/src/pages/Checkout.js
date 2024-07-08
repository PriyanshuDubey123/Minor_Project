import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { deleteItemFromCartAsync, selectItems, updateCartAsync } from "../features/cart/cartSlice";
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { selectLoggedInUser, updateUserAsync } from '../features/auth/authSlice';
import { createOrderAsync, selectCurrentOrder } from '../features/order/orderSlice';
import { selectUserInfo } from '../features/user/userSlice';
import { discountedPrice } from '../app/constants';



function Checkout() {

  const user = useSelector(selectUserInfo);

  const currentOrder = useSelector(selectCurrentOrder);

  const [open, setOpen] = useState(true);
  
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  
  const [paymentMethod, setPaymentMethod] = useState('cash');

 const handlePayment = (e)=>{
   console.log(e.target.value);
   setPaymentMethod(e.target.value)
 }

 const items = useSelector(selectItems);

 const totalAmount = items.reduce((amount,item)=>discountedPrice(item.course)*item.quantity+amount,0);
 const totalItems = items.reduce((quantity,item)=>item.quantity+quantity,0);

 const handleQuantity = (e,item) => {
     dispatch(updateCartAsync({id:item.id,quantity:+e.target.value}));
 }

const handleRemove = (itemId) =>{
 dispatch(deleteItemFromCartAsync(itemId));
}

const handleOrder = (e) =>{
    console.log(user);
  if( paymentMethod){
  const order = {items,totalAmount,totalItems,user:user?.id,paymentMethod, status:'pending'};
  dispatch(createOrderAsync(order));
  }
  else{
    alert('Enter Address and Payment Method')
  }
}

  return (
   <>
    {!items.length && <Navigate to='/' replace= {true} ></Navigate>}
    {currentOrder && currentOrder.paymentMethod === 'cash' && (<Navigate to={`/order-success/${currentOrder.id}`} replace= {true} ></Navigate>)}
    {currentOrder && currentOrder.paymentMethod === 'card' && (<Navigate to={`/stripe-checkout/`} replace= {true} ></Navigate>)}
   <div className=' mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>  
   <div className=' grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5'>
   <div className='lg:col-span-3 py-5'>
   <form className=' bg-white px-5 py-7 mt-5' noValidate 
   onSubmit={handleSubmit((data)=>{
    console.log(data);
//    dispatch(updateUserAsync({...user}));
   reset();
   })}>
   <div className="space-y-12">
   <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-2xl font-semibold leading-7 text-gray-900">Personal Information</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Full name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  {...register('name',{required:'name is required'})}
                  id="name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  {...register('email',{required:'email is required'})}
                  type="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                Phone
              </label>
              <div className="mt-2">
              <input
                  id="phone"
                  {...register('phone',{required:'Phone Number is required'})}
                  type="tel"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

        
         
        
          </div>
        </div>


        <div className="border-b border-gray-900/10">
         
        

          <div className="mt-10 space-y-10">
            
            <fieldset>
              <legend className="text-sm font-semibold leading-6 text-gray-900">Payment Methods</legend>
              <p className="mt-1 text-sm leading-6 text-gray-600">Choose One</p>
              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-x-3">
                  <input
                    onChange={handlePayment}
                    id="cash"
                    name="payments"
                    value="cash"
                    type="radio"
                    checked = {paymentMethod ===  "cash"}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label htmlFor="cash" className="block text-sm font-medium leading-6 text-gray-900">
                    Cash
                  </label>
                </div>
                <div className="flex items-center gap-x-3">
                  <input
                   onChange={handlePayment}
                    id="card"
                    name="payments"
                    value="card"
                    type="radio"
                    checked = {paymentMethod === "card"}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  <label htmlFor="card" className="block text-sm font-medium leading-6 text-gray-900">
                    Card Payment
                  </label>
                </div>
               
              </div>
            </fieldset>
          </div>
        </div>
      </div>

    </form>
    </div>
    <div className='lg:col-span-2'>
    <div className="mt-10 mx-auto max-w-4xl px-2 sm:px-2 lg:px-4 bg-white">
        <div className=" px-0 py-2 sm:px-0">
          <h2 className=" my-5 text-3xl font-bold tracking-tight text-gray-900">
            Cart
          </h2>
          <div className="flow-root">
            <ul role="list" className="-my-6 divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={item.course.thumbnail}
                      alt={item.course.title}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <a href={item.course.href}>{item.course.title}</a>
                        </h3>
                        <p className="ml-4">₹{discountedPrice(item.course)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.course.language}
                      </p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="text-gray-500">
                        <label
                          htmlFor="quantity"
                          className=" inline mr-5 text-sm font-medium leading-6 text-gray-900"
                        >
                          Qty
                        </label>
                        <select onChange={(e)=>handleQuantity(e,item)} value={item.quantity}>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>

                      <div className="flex">
                        <button onClick={(e)=>handleRemove(item.id)}
                          type="button"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 px-2 py-6 sm:px-2">
          <div className="flex justify-between my-2 text-base font-medium text-gray-900">
            <p>Subtotal</p>
            <p>₹{totalAmount}</p>
          </div>
          <div className="flex justify-between my-2 text-base font-medium text-gray-900">
            <p>Total Items in Cart</p>
            <p>{totalItems} items</p>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            Shipping and taxes calculated at checkout.
          </p>
          <div className="mt-6">
            <div
            onClick={handleOrder}
              className="flex cursor-pointer items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Order Now
            </div>
          </div>
          <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
            <p>
              or
              <Link to="/">
                <button
                  type="button"
                  className=" ml-2 font-medium text-indigo-600 hover:text-indigo-500"
                  onClick={() => setOpen(false)}
                >
                  Continue Shopping
                  <span aria-hidden="true"> &rarr;</span>
                </button>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
   </>
  )
}

export default Checkout