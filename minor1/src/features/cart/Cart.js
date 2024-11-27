import { useSelector, useDispatch } from "react-redux";
import { deleteItemFromCartAsync, selectItems, updateCartAsync } from "./cartSlice";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { discountedPrice } from "../../app/constants";
import DeleteIcon from '@mui/icons-material/Delete';

export default function Cart() {
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();

  const items = useSelector(selectItems);
  console.log("items " + items);

  const totalAmount = Array.isArray(items) ? items?.reduce((amount, item) => discountedPrice(item.course) * item.quantity + amount, 0) :0;
  const totalItems = Array.isArray(items) ? items?.reduce((quantity, item) => item.quantity + quantity, 0):0;


  const handleRemove = (itemId) => {
    dispatch(deleteItemFromCartAsync(itemId));
  }

  const handleDeleteClick = (e, itemId) => {
    // e.stopPropagation();
    e.preventDefault();
    handleRemove(itemId);
  };

  return (
    <>
      {!items.length && <Navigate to='/home' replace={true}></Navigate>}
      <div className="mt-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-blue-50 rounded-t-lg">
          <h2 className="my-5 text-3xl font-bold tracking-tight text-gray-900">
            Saved Courses
          </h2>
          <div className="flow-root">
            <ul role="list" className="-my-6 divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.course?._id} className="flex p-6 hover:bg-blue-200 mt-5">
                  <Link to={`/course-detail/${item.course._id}`} className="flex flex-1">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item?.course?.thumbnailUrl}
                        alt={item.course?.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <a href={item.course?.href} className="hover:underline">{item.course?.name}</a>
                          </h3>
                          <p className="ml-4">₹{discountedPrice(item.course)}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.course?.language}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="ml-4 flex items-center justify-end">
                    <button
                      onClick={(e) => handleDeleteClick(e, item.id)}
                      className="text-red-600"
                    >
                      <DeleteIcon className="hover:bg-white hover:rounded-full" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-6 sm:px-6 bg-gray-50 rounded-b-lg">
          <div className="flex justify-between my-2 text-base font-medium text-gray-900">
            <p>Subtotal</p>
            <p>₹{totalAmount}</p>
          </div>
          <div className="flex justify-between my-2 text-base font-medium text-gray-900">
            <p>Total Saved Items</p>
            <p>{totalItems} items</p>
          </div>
          <div className="mt-6">
            <Link
              to="/home/study"
              className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Continue Learning
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
