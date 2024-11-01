import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/user/userSlice';
import courseReducer from '../features/course-list/CourseSlice';
import cartReducer from '../features/cart/cartSlice';
import orderReducer from '../features/order/orderSlice';
import ToggleReducer from '../features/ToggleSlice';
import AdminAuthReducer from '../features/admin/components/AdminAuthSlice';

export const store = configureStore({
    reducer: {
      auth: authReducer,
      adminAuth: AdminAuthReducer,
      user: userReducer,
      course: courseReducer,
      cart:cartReducer,
      order: orderReducer,
      toggle:ToggleReducer
    },
  });