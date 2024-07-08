import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
  CheckIcon,
} from "@heroicons/react/20/solid";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { addToCartAsync, selectItems } from "../../cart/cartSlice";
import { fetchCourseByIdAsync, selectCourseById } from "../CourseSlice";
import { useEffect, useState } from "react";
import { discountedPrice } from "../../../app/constants";
import { selectLoggedInUser } from "../../auth/authSlice";
import toast, { Toaster } from 'react-hot-toast';

const includedFeatures = [
  "Interactive Classes",
  "Study Progress Analysis",
  "Doubt Support",
  "Certificate of Completion",
];

const products = [
  {
    name: "Dr. Anuj Gupta",
    imageSrc:
      "https://i0.wp.com/www.xamnation.com/wp-content/uploads/2019/09/849-03901398en_Masterfile.jpg?fit=450%2C300&ssl=1",
  },
  {
    name: "Dr. Vikash Sharma",
    imageSrc:
      "https://t3.ftcdn.net/jpg/04/20/71/46/360_F_420714613_TByJPwnQ11PbvAByrDNA5Po9N77VxJGG.jpg",
  },
  {
    name: "Prof. Riya Sen",
    imageSrc:
      "https://i0.wp.com/www.edhacked.com/wp-content/uploads/2023/07/pexels-max-fischer-5212320.jpg?fit=1920%2C1280&ssl=1",
  },
  {
    name: "Prof. Pankaj Verma",
    imageSrc:
      "https://st4.depositphotos.com/1000975/25709/i/450/depositphotos_257098384-stock-photo-young-male-math-teacher-in.jpg",
  },
];

const features = [
  {
    name: "Course Duration",
    description: "22 Nov 2023 - 15 Jan 2024",
    icon: CloudArrowUpIcon,
  },
  {
    name: "Validity",
    description: "Till the Examination",
    icon: LockClosedIcon,
  },
  {
    name: "Online Lectures",
    description: "Live Classes and Recordings are facilitated",
    icon: ServerIcon,
  },
  {
    name: "Quizzes",
    description: "Chapter wise Quizzes",
    icon: ServerIcon,
  },
  {
    name: "Test Series",
    description: "Test with Solutions",
    icon: ServerIcon,
  },
  {
    name: "Subjects",
    description: "All subjects of the examination are covered",
    icon: ServerIcon,
  },
];

export default function CourseDetail() {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const course = useSelector(selectCourseById);
  const items = useSelector(selectItems);
  const user = useSelector(selectLoggedInUser);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false); // New state for enrollment status


  useEffect(()=>{
   if(course?.enrolledStudents.includes(user.id)){
    setEnrolled(true);
   }
  },[]);


  const handleSave = (e) => {
    if (items.findIndex((item) => item.course._id === course._id) < 0) {
      const newItem = { quantity: 1, course: course._id, user: user.id };
      dispatch(addToCartAsync(newItem));
    } else console.log("already added");
  };

  const handleEnroll = async () => {

   if(enrolled){
    navigate(`/study/course/${course._id}`);
    return;
   }


    if (course.price === 0) {
      setIsEnrolling(true);
      toast.loading("Enrolling you in the course...", { id: "enroll" });

      setTimeout(async () => { // Delay the API call by 3 seconds
        try {
          const response = await fetch(`http://localhost:8080/api/courses/enroll/${course._id}/${user.id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            toast.success("Successfully Enrolled", { id: "enroll" });
            setIsEnrolling(false);
            setEnrolled(true); // Set enrolled to true
          } else {
            throw new Error('Enrollment failed');
          }
        } catch (error) {
          toast.error(error.message, { id: "enroll" });
          setIsEnrolling(false);
        }
      }, 3000);
    } else {
      setIsEnrolling(true);
      toast.loading("Securely redirecting you to the payment page...", { id: "payment" });
      setTimeout(() => {
        navigate(`/payments/${course._id}`);
        toast.dismiss("payment");
      }, 2000);
    }
  };

  useEffect(() => {
    dispatch(fetchCourseByIdAsync(params.id));
  }, [dispatch, params.id]);

  return (
    <>
      {course && (
        <div>
          <Toaster />
          <div className="overflow-hidden pt-32 mr-2">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                <div className="lg:pr-8 lg:pt-4">
                  <div className="lg:max-w-lg">
                    <h2 className="text-base font-semibold leading-7 text-indigo-600">
                      Course Details
                    </h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                      {course.title}
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                      {course.description}
                    </p>
                    <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                      {features.map((feature) => (
                        <div
                          key={feature.name}
                          className="relative pl-9 flex flex-col"
                        >
                          <dt className="inline font-semibold text-gray-900">
                            <feature.icon
                              className="absolute left-1 top-1 h-5 w-5 text-indigo-600"
                              aria-hidden="true"
                            />
                            {feature.name}
                          </dt>{" "}
                          <dd className="inline">{feature.description}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
                <div className="flex flex-col border-2 border-gray-100 rounded-xl h-[35rem] gap-5">
                  <img
                    src={course.thumbnailUrl}
                    alt="Product screenshot"
                    className="max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 md:-ml-4 lg:-ml-0 w-md h-[30rem]"
                  />
                  <div className="w-full bg-yellow-500 font-bold text-white text-center p-2">
                    <p>24*7 Doubt Support</p>
                  </div>
                  <div className="flex justify-around p-2">
                    <button
                      className={`${
                        enrolled ? "bg-green-700 w-full" : "bg-blue-700"
                      } text-white rounded-md py-2 px-4 w-[10rem] font-bold hover:${
                        enrolled ? "bg-green-800" : "bg-blue-800"
                      } transition duration-200`}
                      onClick={handleEnroll}
                      disabled={isEnrolling}
                    >
                      {isEnrolling ? (
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                          {course.price === 0 ? "Enrolling..." : "Redirecting..."}
                        </div>
                      ) : enrolled ? (
                        "Explore"
                      ) : (
                        "Enroll Now"
                      )}
                    </button>
                   {!enrolled && <button
                      className={`${
                        enrolled ? "bg-green-300" : "bg-gray-300"
                      } text-black rounded-md py-2 px-4 w-[10rem] font-bold hover:${
                        enrolled ? "bg-green-400" : "bg-gray-400"
                      } transition duration-200`}
                      onClick={handleSave}
                    >
                       Save
                    </button>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Teachers Section */}
          <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10 lg:max-w-7xl lg:px-8">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Teachers
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {products.map((product) => (
                  <div
                  key={product.name}
                  className="relative flex flex-col border-2 border-gray-100 rounded-lg shadow-xl overflow-hidden group"
                >
                 <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-40">
                      <img
                        src={product.imageSrc}
                        alt={product.name}
                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                      />
                    </div>
                  <div className="flex-1 p-4 space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-gray-600">Subject Expert</p>
                  </div>
                  <div className="p-4 bg-gradient-to-t from-gray-900 to-blue-500">
                    <a
                      href="#"
                      className="group absolute inset-0"
                      aria-hidden="true"
                    ></a>
                    <p className="text-base font-bold tracking-tight text-white">
                      {product.name}
                    </p>
                    <p className="mt-2 text-sm font-medium text-white">
                      More Info <span aria-hidden="true">&rarr;</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {/* Features Section */}
        <div className=" pb-24 pt-5">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl sm:text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Simple no-tricks pricing
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Affordable Price Ranging with mindblowing Discount offers
                </p>
              </div>
              <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
                <div className="p-8 sm:p-10 lg:flex-auto">
                  <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                    Lifetime membership
                  </h3>
                  <p className="mt-6 text-base leading-7 text-gray-600">
                    {course.title} includes all the latest lectures, Test Series
                    for preparation of students, Study Analysis, Notes,
                    Previous Year Quizzes etc.
                  </p>
                  <div className="mt-10 flex items-center gap-x-4">
                    <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">
                      What’s included
                    </h4>
                    <div className="h-px flex-auto bg-gray-100" />
                  </div>
                  <ul
                    role="list"
                    className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6"
                  >
                    {includedFeatures.map((feature) => (
                      <li
                        key={feature}
                        className="flex gap-x-3 border-2 border-gray-200 rounded-lg p-2"
                      >
                        <CheckIcon
                          className="h-6 w-5 flex-none text-indigo-600"
                          aria-hidden="true"
                        />
                        <span className="text-sm font-semibold leading-6 text-gray-900">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="sm:p-10 lg:mt-0 lg:w-[28rem] lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center border-2 border-gray-200 rounded-r-3xl rounded-lg p-4 mx-auto mt-4">
                  <div className="bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                    <div className="mx-auto max-w-xs px-8">
                      <p className="text-base font-semibold text-gray-600">
                        Get this course in
                      </p>
                      <p className="mt-6 flex items-baseline justify-center gap-x-2">
                        <span className="text-5xl font-bold tracking-tight text-gray-900">
                          {course.price === 0 ? 'Free':discountedPrice(course)}
                        </span>
                        {course.price !== 0 && <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                          INR
                        </span>}
                      </p>
                      {course.price !== 0 &&<p className="mt-6 text-xs leading-5 text-gray-600">
                        [inclusive of all taxes]
                      </p>}
                      <div className="mt-10 flex justify-center">
                      <button
                      className={`${
                        enrolled ? "bg-green-700" : "bg-blue-700"
                      } text-white rounded-md py-2 px-4 w-[10rem] -mt-4 font-bold hover:${
                        enrolled ? "bg-green-800" : "bg-blue-800"
                      } transition duration-200`}
                      onClick={handleEnroll}
                      disabled={isEnrolling}
                    >
                      {isEnrolling ? (
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                          {course.price === 0 ? "Enrolling..." : "Redirecting..."}
                        </div>
                      ) : enrolled ? (
                        "Explore"
                      ) : (
                        "Enroll Now"
                      )}
                    </button>
                      </div>
                      <p className="mt-6 text-xs leading-5 text-gray-600">
                        Invoices and receipts available for easy company
                        reimbursement
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
      </div>
    )}
  </>
  );
}  