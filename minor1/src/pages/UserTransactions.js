import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { selectUserInfo } from '../features/user/userSlice';
import { selectToggle } from '../features/ToggleSlice';

const UserTransactions = () => {
    const user = useSelector(selectUserInfo);
    const userId = user?.id;
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/users/transactions/${userId}`);
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            } finally {
                setIsLoading(false); // Set loading to false after data is fetched
            }
        };

        if (userId) {
            fetchTransactions();
        }
    }, [userId]);

const selecttoggle = useSelector(selectToggle);

    return (
        <div className={`mx-auto px-4 sm:px-6 lg:px-8 w-full py-10 mt-10 style={{ maxWidth: '1200px' } ${!selecttoggle ? "w-[calc(100vw-20.6rem)]" : "w-[calc(100vw-6.4rem)]"} `}>
            <h2 className="text-3xl font-bold mb-8 text-center">Your Transactions</h2>
            <div className="overflow-x-auto shadow-lg rounded-lg bg-gradient-to-r from-blue-100 to-blue-200">
                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                        <tr>
                            <th className="w-1/6 py-3 px-4 text-left">Image</th>
                            <th className="w-1/6 py-3 px-4 text-left">Course Name</th>
                            <th className="w-2/6 py-3 px-4 text-left">Description</th>
                            <th className="w-1/6 py-3 px-4 text-left">Amount</th>
                            <th className="w-1/6 py-3 px-4 text-left">Order ID</th>
                            <th className="w-1/6 py-3 px-4 text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            // Skeleton Loading State
                            Array.from({ length: 5 }).map((_, index) => (
                                <tr key={index} className="odd:bg-white even:bg-gray-100 border-b animate-pulse">
                                    <td className="py-3 px-4">
                                        <div className="w-24 h-16 bg-gray-200 rounded-md shadow-md"></div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                    </td>
                                </tr>
                            ))
                        ) : transactions.length > 0 ? (
                            // Transactions Data
                            transactions.map((transaction) => (
                                <tr key={transaction?._id} className="odd:bg-white even:bg-gray-100 border-b transition duration-300 ease-in-out hover:bg-gray-200">
                                    <td className="py-3 px-4">
                                        <div className="w-24 h-16 overflow-hidden rounded-md shadow-md">
                                            <img 
                                                src={transaction?.courseId?.thumbnailUrl || 'https://img.freepik.com/free-vector/online-certification-illustration_23-2148575636.jpg?size=338&ext=jpg&ga=GA1.1.1546980028.1719792000&semt=ais_user'} 
                                                alt={transaction?.courseId?.name} 
                                                className="w-full h-full" 
                                            />
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 font-semibold">{transaction?.courseId?.name || 'Course'}</td>
                                    <td className="py-3 px-4 text-gray-600">{transaction?.courseId?.description || 'Description'}</td>
                                    <td className="py-3 px-4 font-semibold">{transaction?.amount > 0 ? transaction?.amount : "FREE"} {transaction?.amount > 0 ? transaction?.currency : null}</td>
                                    <td className="py-3 px-4 text-gray-600">{transaction?.order_id}</td>
                                    <td className="py-3 px-4 text-gray-600">{new Date(transaction?.createdAt).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            // No transactions found message
                            <tr>
                                <td colSpan="6" className="text-center py-4">No transactions found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTransactions;
