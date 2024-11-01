import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import Skeleton from 'react-loading-skeleton';

const SkeletonLoader = () => (
  <div className="p-10">
  <Skeleton height={50} width={200} />
  <Skeleton height={300} className="my-6" />
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <Skeleton height={200} />
    <Skeleton height={200} />
  </div>
  <Skeleton height={50} width={200} />
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array(3).fill().map((_, i) => (
      <Skeleton key={i} height={350} />
    ))}
  </div>
</div>
);

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector(selectUserInfo);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/users/purchased-courses/${user?.id}`);
        console.log(response.data);
        setCourses(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedCourses();
  }, [user?.id]);

  const handleContinueLearning = (course) => {
    navigate(`/home/learning-panel/${course._id}`, { state: { course } });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-20">
      <h1 className="text-4xl font-bold text-blue-700 mb-8 text-center">My Courses</h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(6).fill(0).map((_, index) => (
            <SkeletonLoader key={index} />
          ))}
        </div>
      ) : (
        courses.length === 0 ? (
          <p className="text-center text-gray-700">You have not purchased any courses yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => (
              <div key={course._id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 flex flex-col mb-5">
                <div className="min-h-72 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-72">
                  <img src={course.thumbnailUrl} alt={course?.name} className="h-full w-full" />
                </div>
                <div className="flex-grow flex flex-col justify-center items-center p-4">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">{course.name}</h2>
                  <p className="text-gray-700 text-center">{course.description}</p>
                </div>
                <div className="border-t border-gray-200 pt-4 flex flex-col gap-2 text-gray-600">
                  <div className="flex justify-between border-b pb-1 gap-10"><strong>Language:</strong> {course.language}</div>
                  <div className="flex justify-between border-b pb-1 gap-10"><strong>Duration:</strong> {course.duration} hours</div>
                  {/* <div className="flex justify-between border-b pb-1"><strong>Purchased On:</strong> {new Date(course.purchaseDate).toLocaleDateString()}</div> */}
                  <div className="flex justify-between border-b pb-1 gap-10"><strong>Videos:</strong> <span className="text-blue-500">{course?.videos.length}</span></div>
                </div>
                <button 
                  onClick={() => handleContinueLearning(course)}
                  className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                  Continue Learning
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default MyCourses;
