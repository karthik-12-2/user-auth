import axios from 'axios';
import { Link, useActionData, useNavigate, Form } from 'react-router';
import { showToast } from '../slice/ToastSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

export async function loginAction({request}) {
    const formdata = await request.formData();
    const Email = formdata.get('Email');
    const Password = formdata.get('Password');

    if(!Email || !Password){
        return {error: 'Must fill all of the Fields!', status: 400};
    }

    try {
        const response = await axios.post('http://localhost:4000/api/auth/login', { Email, Password } );
        if(response.data === "Success"){
            return {message: response.data, status: 200, Email: Email};
        }else {
            return {error: response.data, status: 400};
        }
    }catch(err) {
        return {error: 'Server Error', status: 500};
    }
}

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const actionData = useActionData();

    useEffect(() => {
       async function verify(){
            if(actionData){
                if(actionData.error){
                    dispatch(showToast({id: Date.now(), isOpen:true, message:`Invalid credentails`, color:'red'}));
                } else {
                    dispatch(showToast({id: Date.now(), isOpen:true, message:`Login ${actionData.message}`, color:'green'}));
                    try{
                        const token = sessionStorage.getItem("JWTToken");
                        if(token !== null){
                            await axios.post('http://localhost:4000/api/auth/token-verify', { token } );
                        } else if( token === null ) {
                            const response = await axios.post('http://localhost:4000/api/auth/generate-token',  {Email: actionData.Email}  );
                            sessionStorage.setItem("JWTToken", response.data);
                        }
                        setTimeout(() => {
                            navigate('/')
                        }, 500);

                    } catch(err) {
                        dispatch(showToast({id: Date.now(),isOpen:true, message:`Invalid credentails`, color:'red'}))
                    }
                }
            }
       }
       verify()
    }, [actionData, dispatch, navigate])

  return (
    <div className='register'>
        <h1>Sign in</h1>
        <Form className='form' method='post'>
            <label 
                htmlFor="Email"
            >
                Email 
            </label> <br />
            <input 
                type="email" 
                id='Email' 
                name='Email' 
            />  <br />
            
            <label 
                htmlFor="Password" 
            >
                Password 
            </label> <br />
            <input 
                type="password" 
                id='Password' 
                name='Password' 
                minLength='8'  //TODO
            /> <br />

            <button type="submit">Login</button> <br />
        </Form>
        <div className="linkContainer">
            <Link to="/register" className="login link">Signup</Link>
            <Link to="/forgotpassword" className="forgotPassword link">Forgot Password</Link>
        </div>
    </div>
  )
}

export default Login