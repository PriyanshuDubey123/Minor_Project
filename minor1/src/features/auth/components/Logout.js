import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectLoggedInUser, signOutAsync } from "../authSlice";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../user/userSlice";
import { selectAdminLoginInfo, signOutAdminAsync } from "../../admin/components/AdminAuthSlice";

function Logout(){

const location = useLocation();

const queryParams = new URLSearchParams(location.search);


const isAdmin = queryParams.get('admin') === 'true';


const navigate = useNavigate();

const dispatch = useDispatch();
const user = useSelector(selectLoggedInUser);
const admin = useSelector(selectAdminLoginInfo);
    useEffect(()=>{
        if(admin && isAdmin){
     dispatch(signOutAdminAsync('admin'));
     navigate('/adminlogin', {replace:true});
        }
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