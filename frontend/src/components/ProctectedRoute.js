import { Navigate } from "react-router";

const ProctectedRoute = ({isAllowed, redirectPath= '/', children}) => {
    // if(!isAllowed && !redirectPath) {
    //     return <Navigate to='/register' replace/>;
    // }
    // return children; 
}

export default ProctectedRoute