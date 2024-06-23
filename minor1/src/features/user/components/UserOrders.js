import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLoggedInUserOrdersAsync, selectUserInfo } from '../userSlice';
import { selectUserOrders } from '../userSlice';
import { discountedPrice } from '../../../app/constants';

export default function UserOrders() {
  
 const user = useSelector(selectUserInfo);
  const dispatch = useDispatch();

  const orders = useSelector(selectUserOrders);

  useEffect(()=>{
    dispatch(fetchLoggedInUserOrdersAsync(user.id));
  },[])

  return (
    <div>

      {orders && orders.map((order)=> (
        <div>

      <div className="mt-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 bg-white">
        <div className=" px-4 py-2 sm:px-6">
          <h2 className=" my-5 text-3xl font-bold tracking-tight text-gray-900">
            Order # {order.id}
          </h2>
          <h3 className=" my-5 text-xl font-bold tracking-tight text-red-900">
            Order Status : {order.status}
          </h3>
          <div className="flow-root">
            <ul role="list" className="-my-6 divide-y divide-gray-200">
              {order.items.map((item) => (
                <li key={item.course.id} className="flex py-6">
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
                        <p className="ml-4">${discountedPrice(item.course)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.course.brand}
                      </p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="text-gray-500">
                        <label
                          htmlFor="quantity"
                          className=" inline mr-5 text-sm font-medium leading-6 text-gray-900"
                        >
                          Qty : {item.course.quantity}
                        </label>
                      </div>

                      <div className="flex">
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
          <div className="flex justify-between my-2 text-base font-medium text-gray-900">
            <p>Subtotal</p>
            <p>${order.totalAmount}</p>
          </div>
          <div className="flex justify-between my-2 text-base font-medium text-gray-900">
            <p>Total Items</p>
            <p>{order.totalItems} items</p>
          </div>

          <p className='mt-0.5 text-sm text-gray-500'>
          Shipping Address :
        </p>
         
       

        </div>
      </div>

        </div>

      ))}
  
    </div>
  );
}
