import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchLoggedInUserOrdersAsync,
  selectUserInfo,
  selectUserOrders,
  updateUserAsync,
} from "../userSlice";
import { useForm } from "react-hook-form";
import { selectLoggedInUser } from "../../auth/authSlice";
import { addToCartAsync, selectItems } from "../../cart/cartSlice";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { StarIcon } from "@heroicons/react/20/solid";
import { discountedPrice } from "../../../app/constants";
import { Link } from "react-router-dom";
import {
  selectAllCourses,
  selectCourseById,
} from "../../course-list/CourseSlice";

export default function UserProfile() {
  const dispatch = useDispatch();

  const user = useSelector(selectUserInfo);

  const orders = useSelector(selectUserOrders);

  console.log(orders);

  const course = useSelector(selectCourseById);
  const items = useSelector(selectItems);
  const courses = useSelector(selectAllCourses);

  useEffect(() => {
    dispatch(fetchLoggedInUserOrdersAsync(user.id));
  }, []);

  return (
    <>
      <div className="mt-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 bg-white">
        <div className=" px-4 py-2 sm:px-6">
          <h2 className=" my-5 text-3xl font-bold tracking-tight text-gray-900">
            Name : {user.name ? user.name : "New User"}
          </h2>
          <h3 className=" my-5 text-xl font-bold tracking-tight text-red-900">
            email address : {user.email}
          </h3>
          {user.role === "admin" && (
            <h3 className=" my-5 text-xl font-bold tracking-tight text-red-900">
              role : {user.role}
            </h3>
          )}
        </div>

        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
          <div className="lg:col-span-3 ">
            {/* Your Code */}
            <div>
              <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-0 sm:px-6 sm:py-0 lg:max-w-7xl lg:px-8">
                  <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-2 xl:gap-x-8">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="group relative border-solid border-2 border-gray-200 rounded-md "
                      >
                        <Link to={`/course-detail/${order.id}`}>
                          <div className="flow-root">
                            <ul
                              role="list"
                              className="-my-6 divide-y divide-gray-200"
                            >
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
                                          <a href={item.course.href}>
                                            {item.course.title}
                                          </a>
                                        </h3>
                                        <p className="ml-4">
                                          ${discountedPrice(item.course)}
                                        </p>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-500">
                                        {item.course.brand}
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <div className="flex"></div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </Link>

                        <div>
                          <hr className=" mt-2 p-2" />
                          <div className="flex justify-around p-2">
                            <button className="bg-blue-700 text-white rounded-md p-2 w-[7rem] font-bold">
                           Study
                            </button>
                          
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
