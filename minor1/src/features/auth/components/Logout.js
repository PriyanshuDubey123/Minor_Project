import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectLoggedInUser, signOutAsync } from "../authSlice";
import { Navigate } from "react-router-dom";
import { logout } from "../../user/userSlice";
import { selectAdminLoginInfo } from "../../admin/components/AdminAuthSlice";

function Logout(){
const dispatch = useDispatch();
const user = useSelector(selectLoggedInUser);
const admin = useSelector(selectAdminLoginInfo);
    useEffect(()=>{
        if(admin)
     dispatch(signOutAsync('admin'));
    else
     dispatch(signOutAsync());
     dispatch(logout())
    })

    return (
        <>
        {!user && <Navigate to='/' replace={true}></Navigate>}
        </>
    );
}
export default Logout;