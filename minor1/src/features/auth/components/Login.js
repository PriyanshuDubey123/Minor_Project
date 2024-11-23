
import { useSelector, useDispatch } from 'react-redux';
import {
  loginUserAsync,
  selectError,
  selectLoggedInUser,
} from '../authSlice';

import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { fetchItemsByUserIdAsync } from '../../cart/cartSlice';
import { fetchLoggedInUserAsync } from '../../user/userSlice';

export default function Login() {
 
  const dispatch = useDispatch();
  
  const error = useSelector(selectError);

  const user = useSelector(selectLoggedInUser);


  if(user){
    
      dispatch(fetchItemsByUserIdAsync(user.id));
      dispatch(fetchLoggedInUserAsync(user.id));
    
  }

   const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  console.log(errors);

  return (
    <>
    {user && <Navigate to="/home" replace={true}></Navigate>}
    <div className="flex min-h-screen items-center justify-center  px-6 py-12 lg:px-8">
  <div className="w-full max-w-md space-y-8 bg-white p-10 shadow-md shadow-black">
    <div>
      <img
        className="mx-auto h-14 w-14 rounded-full"
        src="https://i.pinimg.com/736x/f2/d6/7d/f2d67d8b0b75a420095546ab6036614d.jpg"
        alt="Logo"
      />
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Sign in to your account
      </h2>
     
    </div>
    <form
      noValidate
      onSubmit={handleSubmit((data) => {
        dispatch(
          loginUserAsync({ email: data.email, password: data.password })
        );
      })}
      className="mt-8 space-y-6 bg-white p-6 rounded-lg shadow-sm shadow-black"
    >
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
                message: "Email is not valid",
              },
            })}
            type="email"
            className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="text-sm">
            <Link
              to="/forgot-password"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot password?
            </Link>
          </div>
        </div>
        <div className="mt-1">
          <input
            id="password"
            {...register("password", { required: "Password is required" })}
            type="password"
            className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error || error.message}</p>}
      </div>

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Sign in
        </button>
      </div>
    </form>
    <p className="mt-6 text-center text-sm text-gray-600">
      Not a member?{" "}
      <Link
        to="/signup"
        className="font-medium text-indigo-600 hover:text-indigo-500"
      >
        Create an Account
      </Link>
    </p>
  </div>
</div>

    </>
  );
}
