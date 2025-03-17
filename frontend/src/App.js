import './App.css';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router";
import Dashboard, {loader as dashboardLoader} from './Dashboard';
import Register, {registerAction} from './components/Register';
import Login, { loginAction } from './components/Login';
import ForgotPassword, { forgotAction } from './components/ForgotPassword';
import ResetPassword, { resetAction, loader as ResetLoader } from './components/ResetPassword';
import OtpVerify, { verifyAction } from './components/OtpVerify';
import Error from './components/Error';


function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' errorElement={ <Error/> }>
            <Route 
              index 
              element={ <Dashboard/> }
              loader={ dashboardLoader }
            />
            <Route 
              path="register" 
              element={ <Register /> }
              action =  {registerAction}
            />
            <Route 
              path="verification" 
              element={ <OtpVerify/> }
              action = { verifyAction }
            />
            <Route 
              path="login" 
              element={ <Login/> }
              action ={ loginAction }
            />
            <Route 
              path="forgotpassword" 
              element={ <ForgotPassword/> }
              action= { forgotAction }
            />
            <Route 
              path="resetpassword/:reset" 
              element={ <ResetPassword/> }
              loader={ ResetLoader }
            />
        </Route>
    )
  )
  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
