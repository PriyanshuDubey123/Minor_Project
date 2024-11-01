import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { fetchLoggedInUserAsync, selectUserInfo } from '../../features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../utils/Modal';

const CreatorPage = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUserInfo);
  const [showModal, setShowModal] = useState(false);
  // Ensure user data is available
  if (!user || !user?.id) {
    return <div>Loading...</div>;
  }

  // if(user.creator){
  //   navigate(`/creator-account/${user?.id}`);
  // }

  const initialValues = {
    name: '',
    email: '',
    bio: '',
    instagram: '',
    youtube: '',
    linkedin: '',
    twitter: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    bio: Yup.string().required('Bio is required'),
    instagram: Yup.string().url('Invalid URL format'),
    youtube: Yup.string().url('Invalid URL format'),
    linkedin: Yup.string().url('Invalid URL format'),
    twitter: Yup.string().url('Invalid URL format'),
  });

  const onSubmit = async (values) => {
    try {
      await axios.post(`http://localhost:8080/api/creator/become-creator/${user?.id}`, values);
      toast.success('You are now a creator!');
     dispatch(fetchLoggedInUserAsync(user?.id))
     setShowModal(true);
    } catch (error) {
      console.error(error);
      alert('Failed to become a creator. Please try again.');
    }
  };

  return (
    <>
     {showModal && <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        description={`Redirecting to your's Creator Account`}
        url={`http://localhost:3000/creator-account`}
      />}
    <div className="flex justify-center items-center p-4 sm:p-10 bg-gray-100 min-h-screen">
      <div className="w-full max-w-4xl bg-white p-6 border  shadow-md grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col justify-center items-center">
          <img src='https://t4.ftcdn.net/jpg/01/71/45/69/360_F_171456960_4w6b2j7eQNTkX3AUPZ4PI4DhMCHB7oe2.jpg' alt="Become a Creator" className="w-full h-auto rounded-lg" />
          <h2 className="text-3xl font-semibold mt-4 text-center">Become a Creator</h2>
        </div>
        <div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            <Form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700">Name</label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className="w-full mt-2 p-2 border border-gray-300 rounded"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700">Email</label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="w-full mt-2 p-2 border border-gray-300 rounded"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label htmlFor="bio" className="block text-gray-700">Bio</label>
                <Field
                  as="textarea"
                  id="bio"
                  name="bio"
                  className="w-full mt-2 p-2 border border-gray-300 rounded"
                />
                <ErrorMessage name="bio" component="div" className="text-red-500 text-sm" />
              </div>
              <h3 className="text-lg font-semibold">Social Links (optional)</h3>
              <div>
                <label htmlFor="instagram" className="block text-gray-700">Instagram</label>
                <Field
                  type="text"
                  id="instagram"
                  name="instagram"
                  className="w-full mt-2 p-2 border border-gray-300 rounded"
                />
                <ErrorMessage name="instagram" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label htmlFor="youtube" className="block text-gray-700">YouTube</label>
                <Field
                  type="text"
                  id="youtube"
                  name="youtube"
                  className="w-full mt-2 p-2 border border-gray-300 rounded"
                />
                <ErrorMessage name="youtube" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label htmlFor="linkedin" className="block text-gray-700">LinkedIn</label>
                <Field
                  type="text"
                  id="linkedin"
                  name="linkedin"
                  className="w-full mt-2 p-2 border border-gray-300 rounded"
                />
                <ErrorMessage name="linkedin" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label htmlFor="twitter" className="block text-gray-700">Twitter</label>
                <Field
                  type="text"
                  id="twitter"
                  name="twitter"
                  className="w-full mt-2 p-2 border border-gray-300 rounded"
                />
                <ErrorMessage name="twitter" component="div" className="text-red-500 text-sm" />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Become a Creator
              </button>
            </Form>
          </Formik>
        </div>
      </div>
      <Toaster />
    </div>
    </>
  );
};

export default CreatorPage;
