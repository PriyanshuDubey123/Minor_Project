import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
import { selectAdminLoginInfo, selectLoading } from '../../admin/components/AdminAuthSlice';


function ProtectedAdmin({children}) {
    const adminInfo = useSelector(selectAdminLoginInfo);

const status = useSelector(selectLoading);


if(status !== "loading" && status !== "initial"  && !adminInfo){
    return <Navigate to='/adminlogin' replace={true}></Navigate>
  }
  if(adminInfo && adminInfo.role !== 'admin'){
  return <Navigate to='/' replace={true}></Navigate>
}

  return children
}

export default ProtectedAdmin