import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/user/userSlice';
import courseReducer from '../features/course-list/CourseSlice';
import cartReducer from '../features/cart/cartSlice';
import orderReducer from '../features/order/orderSlice';

export const store = configureStore({
    reducer: {
      auth: authReducer,
      user: userReducer,
      course: courseReducer,
      cart:cartReducer,
      order: orderReducer,
    },
  });