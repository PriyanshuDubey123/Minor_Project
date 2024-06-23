import React, { useEffect } from 'react'

import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import Login from './features/auth/components/Login';
import SignUp from './features/auth/components/SignUp';
import Protected from './features/auth/components/Protected';
import HomePage from './pages/HomePage';
import Logout from './features/auth/components/Logout';
import { PageNotFound } from './pages/404';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { checkAuthAsync, selectLoggedInUser, selectUserChecked } from './features/auth/authSlice';
import { fetchItemsByUserIdAsync } from './features/cart/cartSlice';
import { fetchLoggedInUserAsync } from './features/user/userSlice';
import CourseDetail from './features/course-list/components/CourseDetail';
import CourseDetailPage from './pages/CourseDetailPage';
import ProtectedAdmin from './features/auth/components/ProtectedAdmin';
import AdminHomePage from './pages/AdminHomePage';
import AlertTemplate from "react-alert-template-basic";
import AdminCourseForm from './features/admin/components/AdminCourseForm';
import AdminOrdersPage from './pages/AdminOrdersPage';
import Cart from './features/cart/Cart';
import Checkout from './pages/Checkout';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import UserOrdersPage from './pages/UserOrdersPage';
import StripeCheckOut from './pages/StripeCheckOut';
import UserProfilePage from './pages/UserProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AddCourse from './pages/AddCourse';

const router = createBrowserRouter([
  {
    path:'/',
    element: (
    <LandingPage/>)
  },
  {
    path:'/login',
    element: (<Login/>)
  },
  {
    path:'/signup',
    element: (<SignUp/>)
  },
  {
    path:'/home',
    element: (
      <Protected>
        <HomePage/>
      </Protected>)
        
  },
  {
    path:'/admin',
    element: (
      <ProtectedAdmin>
        <AdminHomePage/>
      </ProtectedAdmin>)
        
  },
  {
    path:'/admin/course-form',
    element: (
      <ProtectedAdmin>
        <AdminCourseForm/>
      </ProtectedAdmin>)
        
  },
  {
    path: "/admin/course-form/edit/:id",
    element: (<ProtectedAdmin>
      <AdminCourseForm/>
    </ProtectedAdmin>)
  },
  {
    path:'/course-detail/:id',
    element: (
      <Protected>
        <CourseDetailPage/>
      </Protected>)
        
  },
  {
    path:'/admin-orders',
    element: (
      <ProtectedAdmin>

        <AdminOrdersPage/>
      </ProtectedAdmin>
      )
        
  },
  {
    path: "/orders",
    element: (
      <UserOrdersPage/>
    )
  },
  {
    path:'/cart',
    element: (
      <Protected>
     <Cart/>
      </Protected>
      )
        
  },
  {
    path: "/order-success/:id",
    element: (
      <OrderSuccessPage/>
    )
  },
  {
    path:'/checkout',
    element: (
      <Protected>
     <Checkout/>
      </Protected>
      )
        
  },
  {
    path:'/stripe-checkout',
    element: (
      <Protected>
     <StripeCheckOut/>
      </Protected>
      )
        
  },
  {
    path:'/profile',
    element: (
      <Protected>
     <UserProfilePage/>
      </Protected>
      )
        
  },
  {
    path:'/logout',
    element: (<Logout/>)
  },
    {
    path: "/forgot-password",
    element: (
      <ForgotPasswordPage/>
    )
  },
    {
    path: "/home/add-course",
    element: (
      <AddCourse/>
    )
  },
  {
    path:'*',
    element:(<PageNotFound/>)
  }
]);

function App() {
  const dispatch = useDispatch();
const user = useSelector(selectLoggedInUser);

useEffect(()=>{
  if(user){
dispatch(fetchItemsByUserIdAsync(user.id))
dispatch(fetchLoggedInUserAsync(user.id))
}
},[dispatch,user])

  return (
    <div className='app'>
      

     <RouterProvider router={router}/>
  
    </div>
  )
}

export default App