import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, Form, useActionData } from 'react-router';
import { showToast } from '../slice/ToastSlice';
import { useDispatch, useSelector } from 'react-redux';
import { userSelects, userdetail } from '../slice/UserSlice';

export async function verifyAction({request}) {
    const otp = await request.formData();
    const otp1 = otp.get('1');
    const otp2 = otp.get('2');
    const otp3 = otp.get('3');
    const otp4 = otp.get('4');
    const otps = otp1+otp2+otp3+otp4

    if(!otp1 || !otp2 || !otp3 || !otp4){
        return {error: 'Must enter OTP!'}
    }

    try {
        const response = await axios.post('http://localhost:4000/api/auth/verify-otp',  { otps } );
        if(response.data.message === "Success") {
            return {message: response.data.message, status:200, Email: response.data.Email}
        } else{
            return {error: response.data, status:400}
        }
    } catch(err){
        return {error: 'Server Error', status:500}
    }
}

const OtpVerify = () => {
    const dispatch = useDispatch();
    const actionData = useActionData();
    const navigate = useNavigate();
    const user = useSelector(userSelects);
    const otp1ref = useRef("");
    const otp2ref = useRef("");
    const otp3ref = useRef("");
    const otp4ref = useRef("");
    const otp5ref = useRef("");
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if(user.Email === '') {
            navigate('/register');
        }
    },[user.Email,navigate])

    useEffect(() => {
        async function verify() {
            if(actionData) {
                if(actionData.error){
                    setIsError(true);
                    dispatch(showToast({id:Date.now(), isOpen:true, message:actionData.error, color:'red'}));
                } else {
                    setIsError(false);
                    dispatch(showToast({id:Date.now(), isOpen:true, message: actionData.message, color:'green'}));
                    try{
                        const token = await axios.post('http://localhost:4000/api/auth/token',  {mail: actionData.Email});
                        if(token.data !== null){
                            sessionStorage.setItem("JWTToken", token.data);
                        }
                        navigate('/login');
                        setTimeout(() => {
                            dispatch(userdetail(''));
                        }, 900);
                    } catch(err){
                        console.error('Error fetching token:');
                    }
                }
            }
        }
        verify()
    }, [actionData, dispatch, navigate])

    function handleChange(e, nextref, currentfield) {
        const value = e.target.value ;

        if(/^\d$/.test(value)) {
            currentfield.current = value;
            if(currentfield && nextref){ 
                if(nextref === otp5ref){
                    return;
                }
                if (nextref.current && nextref.current instanceof HTMLInputElement) {
                    nextref.current.focus();
                }   
            }
        }
    }

    
    const ResendOtp = async () => {
        dispatch(showToast({id:Date.now(), isOpen:true, message:"Otp has been sent Successfully", color:'green'}));
        try {
            await axios.post('http://localhost:4000/api/auth/resend-otp',  {email: user.Email});
        }catch(err) {  
            dispatch(showToast({id:Date.now(), isOpen:true, message:"Something went wrong", color:'red'})); 
        }
    }

  return ( 
    <div className='register'>
        <h1>OTP Verify</h1>
        <Form className='form otpForm' method='post'>
            <input name='1' type='text' maxLength='1' className={isError ? 'errorInput' : ''} ref={otp1ref} onChange={(e) => handleChange(e, otp2ref ,otp1ref)}/>
            <input name='2' type='text' maxLength='1' className={isError ? 'errorInput' : ''} ref={otp2ref} onChange={(e) => handleChange(e, otp3ref ,otp2ref)}/>
            <input name='3' type='text' maxLength='1' className={isError ? 'errorInput' : ''} ref={otp3ref} onChange={(e) => handleChange(e, otp4ref ,otp3ref)}/>
            <input name='4' type='text' maxLength='1' className={isError ? 'errorInput' : ''} ref={otp4ref} onChange={(e) => handleChange(e, otp5ref ,otp4ref)}/>
            <button type="submit">verify</button> <br />
        </Form>
        <div className="linkContainer">
            <Link to="#" className="login link" onClick={ResendOtp}>Resend OTP</Link>
        </div>
    </div>
  )
}

export default OtpVerify