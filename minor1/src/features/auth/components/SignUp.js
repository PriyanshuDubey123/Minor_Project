import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { selectLoggedInUser, createUserAsync, selectError } from "../authSlice";
import { Link, Navigate } from "react-router-dom";
import { fetchItemsByUserIdAsync } from "../../cart/cartSlice";
import { fetchLoggedInUserAsync } from "../../user/userSlice";
import { useState } from "react";

export default function SignUp() {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const user = useSelector(selectLoggedInUser);


  
  if(user){
    
    dispatch(fetchItemsByUserIdAsync(user.id));
    dispatch(fetchLoggedInUserAsync(user.id));
  
}


  const onSubmit = async (data) => {
    console.log(data);
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("username", data.username);
    formData.append("role", "user");

    if (data.profilePicture.length > 0) {
      formData.append("profilePicture", data.profilePicture[0]);
    }
console.log(formData)
    // dispatch the action
    dispatch(createUserAsync(formData));
  };


  const error = useSelector(selectError);



  const [profilePicture, setProfilePicture] = useState(null);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  return (
    <>
      {user && <Navigate to="/home" replace={true} />}
      <div className="flex min-h-screen items-center justify-center px-6 py-12 lg:px-8">
      <div className="w-full max-w-xl space-y-8 bg-white p-10 shadow-xl">
        <div className="text-center">
          <img
            className="mx-auto h-16 w-16 rounded-full border-4 border-indigo-500 p-1 shadow-lg"
            src="https://i.pinimg.com/736x/f2/d6/7d/f2d67d8b0b75a420095546ab6036614d.jpg"
            alt="Company Logo"
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create a New Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              log in to your account
            </Link>
          </p>
        </div>

        <form
          noValidate
          className="mt-8 space-y-6 bg-white shadow-lg p-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Email Address */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="mt-1 relative">
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
                    message: "Please enter a valid email",
                  },
                })}
                className="block w-full rounded-md border-2 border-gray-300  p-2  shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              />
              
            </div>
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              {...register("username", { required: "Username is required" })}
              className="block w-full rounded-md border-2 border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                    message: "Password must be at least 8 characters, including uppercase, lowercase, and a number",
                  },
                })}
                className="block w-full rounded-md border-2 border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              />
             
            </div>
            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value, formValues) => value === formValues.password || "Passwords do not match",
              })}
              className="block w-full rounded-md border-2 border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Profile Picture */}
          <div>
            <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            <div className="mt-1">
              <input
                id="profilePicture"
                {...register("profilePicture")}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="block w-full rounded-md border-2 border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            {profilePicture && (
              <div className="mt-2">
                <img
                  src={profilePicture}
                  alt="Profile Preview"
                  className="w-20 h-20 object-cover rounded-full border-2 border-gray-300 shadow-md"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Sign Up
            </button>
          </div>
        </form>

        {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
      </div>
    </div>
    </>
  );
}
