import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import {  useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
 // Assuming you have a logo image file

function PaymentReceipt() {

    const searchParams = new URLSearchParams(window.location.search);
    const order_id = searchParams.get('order_id');
    const [loading,setLoading] = useState(true);

    const navigate = useNavigate();

   const logo = 'https://i.pinimg.com/736x/f2/d6/7d/f2d67d8b0b75a420095546ab6036614d.jpg'

    // Dummy data for testing
    
    const [receiptContent, setReceiptContent] = useState('');
    useEffect(() => {
        
        let  url = `http://localhost:8080/api/cashfree/order/status/?orderId=${order_id}`;
        
        
        
        const fetchData = async()=>{
            try{
              const response = await axios.get(url);
              if(response.data.Unpaid){
            setLoading(false);}
            else{
              setReceiptContent(response.data);
              console.log(receiptContent);
            }
            }catch(err){
                console.log(err);
            }
        }
        fetchData();
    }, []);


    const handleDownload = () => {
        // Create a div element with the receipt content and styles
        const receiptDiv = document.createElement('div');
        receiptDiv.innerHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Receipt</title>
        </head>
        <body style="margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f3f4f6;">
            <div style="max-width: 1000px; padding: 20px; background-color: white; border-radius: 8px; box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center; margin-bottom: 15px;">
                    <img src="{logo}" width="100" alt="Logo" style="margin-bottom: 15px;" />
                    <h1 style="color: #333; font-size: 1.2rem; font-weight: 600; margin-bottom: 15px;" class="text-3xl font-bold mb-4">VSAL</h1>
                    <h2 style="color: #333; font-size: 1.2rem; font-weight: 600; margin-bottom: 15px;" class="text-2xl font-semibold mb-4">Payment Receipt</h2>
                </div>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left; background-color: #f3f4f6; font-weight: 600;" class="border px-4 py-2">Item</th>
                            <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left; background-color: #f3f4f6; font-weight: 600;" class="border px-4 py-2">Currency</th>
                            <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left; background-color: #f3f4f6; font-weight: 600;" class="border px-4 py-2">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;" class="border px-4 py-2">${receiptContent?.item}</td>
                            <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;" class="border px-4 py-2">${receiptContent?.currency}</td>
                            <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;" class="border px-4 py-2">${receiptContent?.amount}</td>
                        </tr>
                    </tbody>
                </table>
                <div style="margin-bottom: 15px;">
                    <p style="color: #555; margin-bottom: 8px; display: flex; justify-content: space-between;" class="flex justify-between"><span style="font-weight: 600;">Username:</span> ${receiptContent?.name}</p>
                    <p style="color: #555; margin-bottom: 8px; display: flex; justify-content: space-between;" class="flex justify-between"><span style="font-weight: 600;">Email:</span> ${receiptContent?.email}</p>
                    <p style="color: #555; margin-bottom: 8px; display: flex; justify-content: space-between;" class="flex justify-between"><span style="font-weight: 600;">Payment Method:</span> ${receiptContent?.paymentMethod}</p>
                </div>
                <div style="margin-bottom: 15px;">
                    <p style="color: #555; margin-bottom: 8px; display: flex; justify-content: space-between;" class="flex justify-between"><span style="font-weight: 600;">Taxes:</span> ${receiptContent?.tax}</p>
                    <p style="color: #555; margin-bottom: 8px; display: flex; justify-content: space-between;" class="flex justify-between"><span style="font-weight: 600;">Total:</span> ${receiptContent?.amount}</p>
                </div>
            </div>
        </body>
        </html>
        
        `;
    
        // Convert the receipt div to PDF
        const doc = new jsPDF('p', 'pt', 'letter');
        doc.html(receiptDiv, {
            callback: function (pdf) {
                pdf.save('payment_receipt.pdf');
            }
        });
    };
    
    

    const calculateTotal = (items, taxes) => {
        const subtotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
        return subtotal + parseInt(taxes, 10);
    };

    return (
        <>
        {(receiptContent && loading) &&
        <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
            <div className="max-w-md mx-auto bg-white p-8 rounded shadow-md w-full">
              <div className='flex flex-col items-center '>
                <img src={logo} width={100} alt="Logo" className=" rounded-full" />
                <h2 className="text-3xl font-bold mb-4">Study Mate</h2>
                <h2 className="text-2xl font-semibold mb-4">Payment Receipt</h2>
              </div>
                <table className="w-full mb-4">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Item</th>
                            <th className="border px-4 py-2">Currency</th>
                            <th className="border px-4 py-2">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                            <tr >
                                <td className="border px-4 py-2 font-semibold">{receiptContent?.item}</td>
                                <td className="border px-4 py-2 font-semibold">{receiptContent?.currency}</td>
                                <td className="border px-4 py-2 font-semibold">₹{receiptContent?.amount}</td>
                            </tr>
                    </tbody>
                </table>
                <div className="mb-4">
                    <p className=' flex justify-between font-semibold'><span className="font-semibold">Username:</span> {receiptContent?.name}</p>
                    <p className=' flex justify-between font-semibold'><span className="font-semibold">Email:</span> {receiptContent?.email}</p>
                    <p className=' flex justify-between font-semibold'><span className="font-semibold">Payment Method:</span> {receiptContent?.paymentMethod}</p>
                </div>
                <div className="mb-4">
                    <p className=' flex justify-between font-semibold'><span className="font-semibold">Taxes:</span> ₹{receiptContent?.tax}</p>
                    <p className=' flex justify-between font-semibold'><span className="font-semibold">Total:</span> ₹{receiptContent?.amount}</p>
                </div>
                <div className="mt-8 w-full flex items-center justify-between gap-2">
                    <button onClick={handleDownload} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
                        Download Receipt (PDF)
                    </button>
                    <button className="bg-green-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded" onClick={() => navigate("/home")}>
                        Continue to Website
                    </button>
                </div>
            </div>
        </div>}
        {!receiptContent && !loading &&
        <>
         <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
                <h1 className="text-3xl text-red-600 font-semibold mb-4">Payment Cancelled</h1>
                <p className="text-gray-700 mb-8 font-semibold">Your payment has been cancelled. If you have any questions, please contact support.</p>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded" onClick={() => navigate("/")}>
                    Continue to Website
                </button>
            </div>
        </div>
        </>

        }
        </>
    );
}

export default PaymentReceipt;
