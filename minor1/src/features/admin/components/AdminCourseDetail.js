import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
} from "@heroicons/react/20/solid";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectItems } from "../../cart/cartSlice";
import { fetchCourseByIdAsync, selectCourseById } from "../CourseSlice";
import { useEffect } from "react";
import { CheckIcon } from '@heroicons/react/20/solid'
import { discountedPrice } from "../../../app/constants";

const includedFeatures = [
  'Interactive Classes',
  'Study Progress Analysis',
  'Doubt Support',
  'Certificate of Completion',
]

const products = [
  {
    name: 'Dr. Anuj Gupta',
    imageSrc: 'https://i0.wp.com/www.xamnation.com/wp-content/uploads/2019/09/849-03901398en_Masterfile.jpg?fit=450%2C300&ssl=1',
  },
  {
    name:'Dr. Vikash Sharma',
    imageSrc:'https://t3.ftcdn.net/jpg/04/20/71/46/360_F_420714613_TByJPwnQ11PbvAByrDNA5Po9N77VxJGG.jpg'
  },
  { name:'Prof. Riya Sen',
    imageSrc:'https://i0.wp.com/www.edhacked.com/wp-content/uploads/2023/07/pexels-max-fischer-5212320.jpg?fit=1920%2C1280&ssl=1'
  },
  {
   name:'Prof. Pankaj Verma',
   imageSrc:'https://st4.depositphotos.com/1000975/25709/i/450/depositphotos_257098384-stock-photo-young-male-math-teacher-in.jpg'
  }
  // More products...
]

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
    description: "Live Classes and Recordings are facilated",
    icon: ServerIcon,
  },
  {
    name: "Quizes",
    description: "Chapter wise Quizes",
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
  const course = useSelector(selectCourseById);

  useEffect(() => {
    dispatch(fetchCourseByIdAsync(params.id));
  }, [dispatch, course]);

  return (
    <>
      {course && 
        <div>
        <div className="overflow-hidden pt-32 mr-2 ">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 ">
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
                  src={course.thumbnail}
                  alt="Product screenshot"
                  className="max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 md:-ml-4 lg:-ml-0 w-md h-[30rem]"
                  
                />
                <div className=" w-full bg-yellow-500 font-bold text-white text-center">
                  <p>24*7 Doubt Support</p>
                </div>
                <div className="flex justify-around p-2">
                  <button className="bg-blue-700 text-white rounded-md p-4 w-[10rem] font-bold">
                    Enroll Now
                  </button>
                  <button className="bg-gray-300 text-black rounded-md  p-4 w-[10rem] font-bold z-[99]">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      

    {/* Teachers */}

    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4  sm:px-6 py-10 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Teachers</h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <img
                  src={product.imageSrc}
                  alt={product.imageAlt}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full "
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href={product.href}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  {/* Prices */}

  <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Simple no-tricks pricing</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
           Affordable Price Ranging with minblowing Discount offers
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">Lifetime membership</h3>
            <p className="mt-6 text-base leading-7 text-gray-600">
             Get all the benefits soon with one time payment
            </p>
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">What’s included</h4>
              <div className="h-px flex-auto bg-gray-100" />
            </div>
            <ul
              role="list"
              className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
            >
              {includedFeatures.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-gray-600">Pay once, own it forever</p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">₹{discountedPrice(course)}</span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">RUPEES</span>
                </p>
                <a
                  href="#"
                  className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get access
                </a>
                <p className="mt-6 text-xs leading-5 text-gray-600">
                  Invoices and receipts available for easy company reimbursement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


      </div>
        }
    </>
  );
}
