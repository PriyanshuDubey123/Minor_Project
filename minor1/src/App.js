import React, { useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LandingPage from './pages/LandingPage';
import Login from './features/auth/components/Login';
import SignUp from './features/auth/components/SignUp';
import Protected from './features/auth/components/Protected';
import HomePage from './pages/HomePage';
import Logout from './features/auth/components/Logout';
import { PageNotFound } from './pages/404';
import { checkAuthAsync , selectLoggedInUser, setLoggedInUserToken } from './features/auth/authSlice';
import { fetchItemsByUserIdAsync } from './features/cart/cartSlice';
import { fetchLoggedInUserAsync, selectLoading } from './features/user/userSlice';
import CourseDetailPage from './pages/CourseDetailPage';
import ProtectedAdmin from './features/auth/components/ProtectedAdmin';
import AdminHomePage from './pages/AdminHomePage';
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
import ShowCourse from './pages/ShowCourse';
import CreatorPage from './pages/Creator/CreatorPage';
import CreatorAccount from './pages/Creator/CreatorAccount';
import MyCourses from './pages/MyLearnings/MyCourses';
import CourseList from './features/course-list/components/CourseList';
import LearningPanel from './pages/MyLearnings/LearningPanel';
import PaymentPage from './pages/MyLearnings/PaymentPage';
import PaymentReceipt from './pages/MyLearnings/PaymentReciept';
import UserTransactions from './pages/UserTransactions';
import Messages from './pages/Messages';
import Progress from './pages/Progress';
import TestSeries from './pages/TestSeries';
import ContactUs from './pages/ContactUs';
import axios from 'axios';
import AdminLogin from './features/auth/components/AdminLogin';
import { selectAdminLoginInfo, setAdminLoginInfo } from './features/admin/components/AdminAuthSlice';
import Friends from './pages/Friends';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/adminlogin',
    element: <AdminLogin />,
  },
  {
    path: '/home',
    element: (
      <Protected>
        <HomePage />
      </Protected>
    ),
    children: [
      { index: true, element: <CourseList /> },
      { path: 'study', element: <MyCourses /> },
      { path: 'learning-panel/:id', element: <LearningPanel /> },
      { path: 'transactions', element: <UserTransactions /> },
      { path: 'friends', element: <Friends /> },
      { path: 'messages', element: <Messages /> },
      { path: 'your-progress', element: <Progress /> },
      { path: 'test-series', element: <TestSeries /> },
      { path: 'contact-us', element: <ContactUs /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedAdmin>
        <AdminHomePage />
      </ProtectedAdmin>
    ),
  },
  {
    path: '/admin/course-form',
    element: (
      <ProtectedAdmin>
        <AdminCourseForm />
      </ProtectedAdmin>
    ),
  },
  {
    path: '/admin/course-form/edit/:id',
    element: (
      <ProtectedAdmin>
        <AdminCourseForm />
      </ProtectedAdmin>
    ),
  },
  {
    path: '/course-detail/:id',
    element: (
      <Protected>
        <CourseDetailPage />
      </Protected>
    ),
  },
  {
    path: '/admin-orders',
    element: (
      <ProtectedAdmin>
        <AdminOrdersPage />
      </ProtectedAdmin>
    ),
  },
  {
    path: '/orders',
    element: <UserOrdersPage />,
  },
  {
    path: '/cart',
    element: (
      <Protected>
        <Cart />
      </Protected>
    ),
  },
  {
    path: '/order-success/:id',
    element: <OrderSuccessPage />,
  },
  {
    path: '/checkout',
    element: (
      <Protected>
        <Checkout />
      </Protected>
    ),
  },
  {
    path: '/stripe-checkout',
    element: (
      <Protected>
        <StripeCheckOut />
      </Protected>
    ),
  },
  {
    path: '/profile',
    element: (
      <Protected>
        <UserProfilePage />
      </Protected>
    ),
  },
  {
    path: '/logout',
    element: <Logout />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/creator-account/add-course',
    element: <AddCourse />,
  },
  {
    path: '/creator/page',
    element: <CreatorPage />,
  },
  {
    path: '/course/:id',
    element: <ShowCourse />,
  },
  {
    path: '/creator-account',
    element: <CreatorAccount />,
  },
  {
    path: '/payments/:id',
    element: <PaymentPage />,
  },
  {
    path: '/payment/success/page',
    element: <PaymentReceipt />,
  },
  {
    path: '*',
    element: <PageNotFound />,
  },
]);

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);

  const admin = useSelector(selectAdminLoginInfo);

  const status = useSelector(selectLoading);

  console.log(user);


  useEffect(() => {
        
            const fetchProfile = async () => {
              try {
                const { data } = await axios.get('http://localhost:8080/auth/profile', { withCredentials: true });
                console.log(data);
                if (data?.userId || data?.adminId) {

                  if(data.userId && data.adminId){
                    dispatch(setAdminLoginInfo({id:data.adminId,email:data.adminEmail, name: data.adminName, role:"admin"}));
                    dispatch(fetchItemsByUserIdAsync(data.userId));
                    dispatch(fetchLoggedInUserAsync(data.userId));
                    dispatch(setLoggedInUserToken({id: data.userId, email:data.userEmail, name: data.username }))
                  }
                  else if(data.userId){
                    dispatch(fetchItemsByUserIdAsync(data.userId));
                    dispatch(fetchLoggedInUserAsync(data.userId));
                    dispatch(setLoggedInUserToken({id: data.userId, email:data.userEmail, name: data.username }))
                  }
                  else{
                    dispatch(setAdminLoginInfo({id:data.adminId,email:data.adminEmail, name: data.adminName, role:"admin"}));
                  }
                }
              } catch (err) {
                console.error("Error fetching profile:", err);
              }
            };
          
            
            fetchProfile();
            
           
  }, []);
  
  
  return (
    
    <div className="app">
      <RouterProvider router={router} />
    </div>
    
  );
}

export default App;
