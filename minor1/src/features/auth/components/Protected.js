import React from 'react'
import { useSelector } from 'react-redux'
import {  selectLoggedInUser } from '../authSlice'
import { Navigate } from 'react-router-dom';
import { selectLoading, selectUserInfo } from '../../user/userSlice';

function Protected({children}) {
    const user = useSelector(selectUserInfo);
      const status = useSelector(selectLoading);
    
      console.log(status,user);

if(status !== "loading"  && status !== "initial"  &&  !user){
    return <Navigate to='/login' replace={true}></Navigate>
}

  return children
}

export default Protected