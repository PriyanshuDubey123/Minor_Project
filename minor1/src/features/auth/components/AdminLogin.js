import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginAdminAsync, selectAdminLoginInfo, selectError } from '../../admin/components/AdminAuthSlice';

const AdminLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(''); // State to store server-side errors
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(selectAdminLoginInfo);

  const loginError = useSelector(selectError);

  useEffect(() => {
    if (user && user?.role === "admin") {
      setLoading(false);
      navigate('/admin');
    }
    if (loginError) {
      setLoading(false);
      setFormError(loginError);
    }
  }, [user, loginError, navigate]);

  // Handle form submission
  const onSubmit = (data) => {
    setLoading(true);
    setFormError(''); // Clear any previous errors
    dispatch(loginAdminAsync({ ...data, admin: true }));
  };

  return (
    <>
      {user && user?.role === "admin" && <Navigate to="/admin" replace={true}></Navigate>}
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-8">Admin Login</h2>

          {/* Display Form Error */}
          {formError && <div className="text-red-500 text-sm mb-4 text-center">{formError}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium">Email</label>
              <input
                id="email"
                type="email"
                className={`mt-1 w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring focus:ring-blue-500`}
                placeholder="Enter your email"
                {...register("email", { 
                  required: "Email is required", 
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address"
                  } 
                })}
              />
              {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium">Password</label>
              <input
                id="password"
                type="password"
                className={`mt-1 w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring focus:ring-blue-500`}
                placeholder="Enter your password"
                {...register("password", { 
                  required: "Password is required", 
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  } 
                })}
              />
              {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full px-4 py-2 text-white ${loading ? 'bg-blue-300' : 'bg-blue-500'} rounded-lg font-semibold focus:outline-none focus:ring focus:ring-blue-300`}
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
