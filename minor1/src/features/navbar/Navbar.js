import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import moment from 'moment';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import { selectItems } from '../cart/cartSlice'
import { selectUserInfo } from '../user/userSlice'
import { initializeSocket, registerUser, subscribeToNotifications } from '../../utils/SocketManager'
import axios from 'axios'
import { Badge } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';


const image = 'https://i.pinimg.com/736x/f2/d6/7d/f2d67d8b0b75a420095546ab6036614d.jpg'

const navigation = [
  { name: 'Explore', link: '/home'},
]
const userNavigation = [
  { name: 'My Profile', link: '/profile' ,req:false},
  { name: 'Become Creator', link:'/creator/page',isCreator:false, req:true},
  { name: 'Manage Creator Account', link:`/creator-account`,isCreator:true,req:true},
  { name: 'Sign out', link: '/logout' ,req:false},
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Navbar({children}) {


const user = useSelector(selectUserInfo);
const savedItems = useSelector(selectItems);

const [notifications,setNotifications] = useState([]);
const [unreadNotifications, setUnreadNotifications] = useState(0);

const location = useLocation();

const fetchNotifications = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/notifications/${user?.id}`);
    setNotifications(response.data.reverse());
    setUnreadNotifications(response.data.filter((notification) => notification.status === "unread").length);
    console.log(unreadNotifications)
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};



const addNotification = (newNotification) => {
  setNotifications((prev) => [newNotification, ...prev]);
  setUnreadNotifications((prev) => prev + 1);
};

useEffect(()=>{
initializeSocket();
registerUser(user?.id)

fetchNotifications();

subscribeToNotifications(user?.id, (notification) => {
  console.log("Received notification:", notification);
  addNotification(notification);
  playNotificationSound();
});

},[user, user?.id,location.pathname])

const playNotificationSound = () => {
  const audio = new Audio("/assets/sound.wav");
  audio.play().catch((error) => console.log("Play sound error:", error));
};

const [isDropdownOpen, setIsDropdownOpen] = useState(false);

const markNotificationsAsRead = async()=>{
  try{
      await axios.put(`http://localhost:8080/api/notifications/markAllAsSeen/${user.id}`);

  }catch(error){
    console.error("Error marking notifications as read:", error);
  } 
}

const toggleDropdown = () => {

   if(unreadNotifications && !isDropdownOpen){
    markNotificationsAsRead();
   }

  setIsDropdownOpen(!isDropdownOpen);
};


const handleDeleteNotification = async (id) => {
  try {
    await axios.delete(`http://localhost:8080/api/notifications/${id}`);
    setNotifications((prev) => prev.filter((notif) => notif._id !== id));
    setUnreadNotifications(notifications.filter((notif)=>notif.status === "unread" && notif._id !== id).length);
  } catch (error) {
    console.error('Error deleting notification:', error);
  }
};

const handleClearAllNotifications = async () => {
  try {
    await axios.delete(`http://localhost:8080/api/notifications/deleteAll/${user.id}`);
    setNotifications([]);
    setUnreadNotifications(0);
  } catch (error) {
    console.error('Error clearing notifications:', error);
  }
};

const [shouldAnimate, setShouldAnimate] = useState(unreadNotifications > 0);

useEffect(() => {
  if (unreadNotifications > 0) {
    setShouldAnimate(true);
    const timer = setTimeout(() => {
      setShouldAnimate(false);
    }, 3000); // Stop animation after 3 seconds

    return () => clearTimeout(timer); // Clean up timer on unmount
  }
}, [unreadNotifications]);

  return (
    <>
 
    {user&&<div className="min-h-full">
      <Disclosure as="nav" className="bg-white fixed right-0 left-0 top-0 z-[9999] border-b-4">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Link to='/'>
                    <img
                      className="h-[4rem] w-[4rem]"
                      src={image}
                      alt="Your Company"
                      />
                      </Link>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-">
                      {navigation.map((item) => 
                         ( <Link
                          key={item.name}
                          to={item.link}
                          className={classNames(
                            item.current
                              ? 'bg-gray-900 text-white'
                              : 'text-black  hover:bg-gray-700 hover:text-white',
                            'rounded-md px-3 py-2 text-md font-bold'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name}
                        </Link>) 
                      )}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                  
                  <Link to="/cart">
                    <button
                      type="button"
                      className="relative rounded-full p-2  focus:outline-none focus:ring-2  focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="absolute -inset-1.5" />
                      <BookmarksIcon className=" h-10 w-10 mr-3" aria-hidden="true" />
                    </button>
                    </Link>
                    {savedItems && savedItems.length>0 && <span className="inline-flex items-center rounded-md mb-5 z-10 -ml-7 mr-2 bg-red-500 px-2 py-[0.2rem] text-xs font-bold text-white ring-1 ring-inset ring-red-600/10">{savedItems.length}</span>}

                     {/* notification */}

                     <div className="relative px-5">
  <Badge
    badgeContent={unreadNotifications > 0 ? unreadNotifications : null}
    color="error"
    classes={{
      badge: shouldAnimate
        ? 'bg-red-400 text-white shadow-md rounded-full animate-bounce'
        : 'bg-red-400 text-white shadow-md rounded-full',
    }}
  >
    {/* Increased Bell Icon Size and Ensured Click Event for Toggling Dropdown */}
    <div 
      onClick={toggleDropdown} 
      className="cursor-pointer flex items-center justify-center"
    >
      <NotificationsActiveIcon
        className="h-16 w-16 text-black hover:text-indigo-700 transition-transform transform hover:scale-110"
      />
    </div>
  </Badge>

  {/* Dropdown with transition logic */}
  {isDropdownOpen && (
    <div className="absolute right-0 mt-2 w-96 max-h-[calc(100vh-80px)] bg-gray-100 shadow-2xl rounded-xl border border-gray-300 overflow-y-auto transition-all duration-300 ease-in-out">
      <div className="sticky top-0 p-4 flex justify-between items-center border-b bg-purple-700  shadow-md">
        <span className="font-semibold text-white">Notifications</span>
        <button
          onClick={handleClearAllNotifications}
          className="text-sm text-white hover:underline"
        >
          Clear All
        </button>
      </div>
      {notifications.length > 0 ? (
        notifications.map((notif, index) => (
          <div
            key={index}
            className={`flex justify-between items-start p-4 border-b ${
              notif.status === 'unread' ? 'bg-indigo-50 shadow-sm' : 'bg-white'
            } hover:bg-indigo-100 transition-colors duration-150`}
          >
            <div className="flex-grow">
              <p className="text-sm font-medium text-gray-900">
                {notif.content}
                {moment().diff(moment(notif.timestamp), 'minutes') <= 5 &&
                  notif.status === 'unread' && (
                    <span className="ml-2 px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded-full animate-pulse">
                      New
                    </span>
                  )}
              </p>
              <p className="text-xs text-gray-500">
                {moment(notif.timestamp).fromNow()}
              </p>
            </div>
            <button
              onClick={() => handleDeleteNotification(notif._id)}
              className="ml-3 text-gray-500 hover:text-red-600 transition-colors"
            >
              <DeleteIcon className="h-5 w-5" />
            </button>
          </div>
        ))
      ) : (
        <p className="p-4 text-center text-sm text-gray-500">
          No new notifications
        </p>
      )}
    </div>
  )}
</div>








                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 text-white gap-5 pl-2">
                          <p className=' font-semibold '>{user.name}</p>
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        
                          {userNavigation.map((item) => (
                            (item.isCreator===user.creator || !item.req)&&
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <Link
                                  to = {item.link}
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  {item.name}
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
              <div className="border-t border-gray-700 pb-3 pt-4">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">{user.name}</div>
                    <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  {userNavigation.map((item) => (
                    (item.isCreator===user.creator || !item.req)&&
                    <Link to={item.link}>
                    <Disclosure.Button
                      key={item.name}
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                      {item.name}
                    </Disclosure.Button>
                      </Link>
                  ))}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <main>
        <div className="mx-auto max-w-7xl pl-1 py-6">{children}</div>
      </main>
    </div>}
  </>
  )
}

export default Navbar