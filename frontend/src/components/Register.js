import { useEffect, useState } from 'react';
import { Form, Link, useActionData, useNavigate } from 'react-router';
import axios from 'axios';
import { showToast } from '../slice/ToastSlice';
import { useDispatch } from 'react-redux';
import { userdetail } from '../slice/UserSlice';

export async function registerAction({request}){
    const formData = await request.formData();
    const FullName = formData.get('FullName'); 
    const Email = formData.get('Email'); 
    const Password = formData.get('Password'); 
    const CPassword = formData.get('CPassword'); 
    
    if(!FullName || !Email || !Password){
        return {error: 'Must fill all of the Fields!', status: 400};
    } else if(Password !== CPassword) {
        return {error: 'Passwords do not match!', status: 400};
    }

    try {
        const response = await axios.post('http://localhost:4000/api/auth/register', {FullName, Email, Password});
        if(response.data === "Success") {
           return {message: response.data, status: 200, Email: Email};
        }else {
            return {error: response.data, status: 400};
        }
    } catch (err) {
        return {error: 'Server Error', status: 500};
    }
}

const Register = () => {
    const [password, setPassword] = useState("");
    const [isError, setIsError] = useState(false);
    const dispatch = useDispatch();
    const actionData = useActionData();
    const navigate = useNavigate()

    useEffect(() => {
        if (actionData) {
            if (actionData.error) {
                dispatch(showToast({id: Date.now(), isOpen: true, message: actionData.error, color: 'red' }));
            } else {
                dispatch(showToast({id: Date.now(), isOpen: true, message: actionData.message, color: 'green' }));
                dispatch(userdetail(actionData.Email));
                navigate('/verification')
            }
        }
    }, [actionData, dispatch, navigate]);

    function handlePassword(e) {
        if(password !== e.target.value){
            setIsError(true);
            if(e.target.value === ""){
                setIsError(false)
            }
        }  else {
            setIsError(false);
        }   
    }

  return (
    <div className='register'>
        <h1>Signup</h1>
        <Form className='form' method='post'>
            <label htmlFor="FullName">FullName </label> <br />
            <input 
                type="text" 
                id='FullName' 
                name='FullName' 
            /> <br />
            
            <label htmlFor="Email">Email </label> <br />
            <input 
                type="email" 
                id='Email' 
                name='Email' 
            />  <br />
            
            <label htmlFor="Password">Password </label> <br />
            <input 
                type="password" 
                id='Password' 
                name='Password' 
                onChange={(e) => {setPassword(e.target.value)}}
                minLength='8' //TODO
            /> <br />
            
            <label htmlFor="CPassword" className={isError ? 'errorLabel' : ''}>Confirm Password </label> <br />
            <input 
                type="password" 
                id='CPassword' 
                name='CPassword' 
                onChange={handlePassword}
                className={isError ? 'errorInput' : ''}
                minLength='8' //TODO 
            /> <br />

            <button type="submit">Register</button> <br />
        </Form>
        <div className="linkContainer">
            <Link className="login link" to="/login">Login</Link>
        </div>
    </div>
  )
}

export default Register