import { useEffect, useState } from 'react';
import { useLoaderData, useNavigate} from 'react-router';
import { showToast } from '../slice/ToastSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';

export async function loader({ params }){
    const token = params.reset
    let allowUser = false;
    try {
        const response = await axios.post('http://localhost:4000/api/auth/verify-reset-token', { token });
        if(response.data === "Success") {
            allowUser = true;
        } else {
            allowUser = false;
        }
    } catch (err){

    }
    return {allowUser, token};
}


const ResetPassword = () => {
    const loader = useLoaderData();
    const [password, setPassword] = useState("");
    const [cPassword, setCPassword] = useState("");
    const [isError, setIsError] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useEffect(() => {
        if(!loader.allowUser) {
            console.log('Not Authorized');
            navigate('/login');
        }
    }, [loader.allowUser, navigate])

    function handlePassword(e) {
        e.preventDefault();
        if(password !== e.target.value){
            setIsError(true);
            if(e.target.value === ""){
                setIsError(false);
            }
            setCPassword(e.target.value);
        } else {
            setIsError(false);
        }
    }
    async function handleSubmit(e){
        e.preventDefault();
        if(password === cPassword){
            try {
                const response = await axios.post('http://localhost:4000/api/auth/reset-password', { password, resetToken: loader.token  });
                dispatch(showToast({isOpen:true, message:`Password changed successfully`, color:'green'}));
                if(response.data !== "Error"){
                    setTimeout(() => {
                        window.close()
                    },2000)
                }
            } catch(err) {
                console.log('err')
            }
        } else {
            dispatch(showToast({id: Date.now(),isOpen:true, message:`Password mismatched`, color:'red'}))
        }
    }

  return (
    <div className='register'>
        <h1>Reset Password</h1>
        <form className='form' onSubmit={handleSubmit}>            
            <label htmlFor="Password">New Password </label> <br />
            <input 
                type="password" 
                id='Password' 
                name='Password' 
                onChange={(e) => {setPassword(e.target.value)}}
                required
            /> <br />
            
            <label htmlFor="CPassword" className={isError ? 'errorLabel' : ''}>Confirm Password </label> <br />
            <input 
                type="password" 
                id='CPassword' 
                name='CPassword' 
                onChange={(e) => {handlePassword(e); setCPassword(e.target.value)}}
                className={isError ? 'errorInput' : ''}
                required
            /> <br />

            <button type="submit">Reset Password</button> <br />
        </form>
    </div>
  )
}

export default ResetPassword