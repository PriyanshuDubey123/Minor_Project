import { useSelector, useDispatch } from "react-redux";
import { deleteItemFromCartAsync, selectCartLoaded, selectItems, updateCartAsync } from "./cartSlice";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Link, Navigate } from "react-router-dom";
import { discountedPrice } from "../../app/constants";



export default function Cart() {
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();


  const items = useSelector(selectItems);
  console.log("items "+items);

  const totalAmount = items.reduce((amount,item)=>discountedPrice(item.course)*item.quantity+amount,0);
  const totalItems = items.reduce((quantity,item)=>item.quantity+quantity,0);

  const handleQuantity = (e,item) => {
      dispatch(updateCartAsync({id:item.id,quantity:+e.target.value}));
  }

const handleRemove = (itemId) =>{
  dispatch(deleteItemFromCartAsync(itemId));
}

  return (
    <>
    {!items.length &&  <Navigate to='/home' replace= {true} ></Navigate>}
      <div className="mt-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 bg-white">
        <div className=" px-4 py-2 sm:px-6">
          <h2 className=" my-5 text-3xl font-bold tracking-tight text-gray-900">
           Saved Courses
          </h2>
          <div className="flow-root">
            <ul role="list" className="-my-6 divide-y divide-gray-200">
              {items.map((item) => (
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

        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
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
            <Link
              to="/checkout"
              href="#"
              className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Checkout
            </Link>
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
                  Continue Exploring
                  <span aria-hidden="true"> &rarr;</span>
                </button>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
