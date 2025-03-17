import axios from 'axios';
import { useDispatch } from 'react-redux';
import { showToast } from '../slice/ToastSlice';
import { useNavigate, Form, useActionData } from 'react-router';
import { useEffect } from 'react';

export async function forgotAction({request}){
   const formdata = await request.formData();
   const email = formdata.get('Email');

   if(!email){
      return {error: 'You must enter the Email Address'}
   }

   try{
      const response = await axios.post('http://localhost:4000/api/auth/forget-password', {email});
      console.log(response.data)
      return {message: response.data.message};
   }catch (err){
      return {error: "Server Error", status: 500}
   }
}

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const actionData = useActionData();

  useEffect(() => {
     if(actionData){
        if(actionData.error){
           dispatch(showToast({id:Date.now(), isOpen:true, message:actionData.error, color:'red'}))
         } else if(!actionData.error) {
            dispatch(showToast({id:Date.now(), isOpen:true, message:actionData.message, color:'green'}))
            setTimeout(() => {
               navigate('/login')
            }, 5000);
          }
      }
  },[actionData, dispatch, navigate])

  return (
    <div className='register'>
        <h1>Forgot password</h1>
        <Form className='form' method='post'>
            <label htmlFor="Email">Email </label> <br />
            <input type="email" id='Email' name='Email'/>  <br />
            <button type="submit">Send Reset Link</button> <br />
        </Form>
    </div>
  )
}

export default ForgotPassword