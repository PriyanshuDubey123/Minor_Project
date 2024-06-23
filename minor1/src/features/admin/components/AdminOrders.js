import { useEffect, useState } from "react";
import { ITEMS_PER_PAGE, discountedPrice } from "../../../app/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrdersAsync,
  selectOrders,
  selectTotalOrders,
  updateOrderAsync,
} from "../../order/orderSlice";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  EyeIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Pagination from "../../common/Pagination";

function AdminOrders() {
  const totalOrders = useSelector(selectTotalOrders);
  console.log(totalOrders);

  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({});

  const orders = useSelector(selectOrders);

  const handlePage = (page) => {
    setPage(page);
  };

  useEffect(() => {
    const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
    dispatch(fetchAllOrdersAsync({ sort, pagination }));
  }, [dispatch, page, sort]);

  const [editableOrderId, seteditableOrderId] = useState(-1);

  const handleShow = (order) => {};
  const handleEdit = (order) => {
    seteditableOrderId(order.id);
  };

  const handleUpdate = (e, order) => {
    const newOrder = { ...order };
    newOrder.status = e.target.value;
    dispatch(updateOrderAsync(newOrder));
    seteditableOrderId(-1);
  };

  const handleSort = (sortOption) => {
    const sort = { _sort: sortOption.sort, _order: sortOption.order };
    setSort(sort);
  };

  const chooseColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-purple-200 text-purple-600";
      case "dispatched":
        return "bg-yellow-200 text-yellow-600";
      case "delivered":
        return "bg-green-200 text-green-600";
      case "cancelled":
        return "bg-red-200 text-red-600";
      default:
        return "bg-purple-200 text-purple-600";
    }
  };

  return (
    <>
      <div className="overflow-x-auto mt-10 p-10">
        <div className="bg-gray-100 flex items-center justify-center bg-gray-100 font-sans overflow-hidden">
          <div className="w-full">
            <div className="bg-white shadow-md rounded my-6">
              <table className="min-w-max w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal cursor-pointer">
                    <th
                      className="py-3 px-6 text-left"
                      onClick={(e) =>
                        handleSort({
                          sort: "id",
                          order: sort._order === "desc" ? "asc" : "desc",
                        })
                      }
                    >
                      Order#{" "}
                      {sort._sort === "id" &&
                        (sort._order === "asc" ? (
                          <ArrowUpIcon className="h-4 w-4 inline" />
                        ) : (
                          <ArrowDownIcon className="h-4 w-4 inline" />
                        ))}
                    </th>
                    <th className="py-3 px-6 text-left">Items</th>
                    <th
                      className="py-3 px-6 text-center"
                      onClick={(e) =>
                        handleSort({
                          sort: "totalAmount",
                          order: sort._order === "desc" ? "asc" : "desc",
                        })
                      }
                    >
                      Total Amount{" "}
                      {sort._sort === "totalAmount" &&
                        (sort._order === "asc" ? (
                          <ArrowUpIcon className="h-4 w-4 inline" />
                        ) : (
                          <ArrowDownIcon className="h-4 w-4 inline" />
                        ))}
                    </th>
                    <th className="py-3 px-6 text-center">Status</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {orders.map((order) => (
                    <tr className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="mr-2"></div>
                          <span className="font-medium">{order.id}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-left">
                        {order.items.map((item) => (
                          <div className="flex items-center">
                            <div className="mr-2">
                              <img
                                className="w-6 h-6 rounded-full"
                                src={item.course.thumbnail}
                              />
                            </div>
                            <span>
                              {item.course.title} - #{item.course.quantity} - 
                              ₹{discountedPrice(item.course)}
                            </span>
                          </div>
                        ))}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex items-center justify-center">
                        ₹{order.totalAmount}
                        </div>
                      </td>
                     
                      <td className="py-3 px-6 text-center">
                        {order.id !== editableOrderId ? (
                          <span
                            className={` ${chooseColor(
                              order.status
                            )} py-1 px-3 rounded-full text-xs`}
                          >
                            {order.status}
                          </span>
                        ) : (
                          <select
                            onChange={(e) => handleUpdate(e, order)}
                            value="Choose Status"
                          >
                            <option>Select Status</option>
                            <option value="pending">Pending</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        )}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex item-center justify-center">
                          <div className="w-6 mr-4 transform hover:text-purple-500 hover:scale-110">
                            <EyeIcon
                              className="h-8 w-8"
                              onClick={(e) => handleShow(order)}
                            />
                          </div>
                          <div className="w-6 mr-2 transform hover:text-purple-500 hover:scale-110">
                            <PencilIcon
                              className="h-8 w-8"
                              onClick={(e) => handleEdit(order)}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Pagination
          page={page}
          setPage={setPage}
          handlePage={handlePage}
          totalItems={totalOrders}
        ></Pagination>
      </div>
    </>
  );
}

export default AdminOrders;
