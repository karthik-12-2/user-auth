import axios from 'axios';
import { useEffect, useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router';
import { showToast } from './slice/ToastSlice';
import { useDispatch } from 'react-redux';

export async function loader(){
   const token = sessionStorage.getItem('JWTToken');
   if(!token){
      return {error: 'Not found', status: 400};
   }
   try{
      const response = await axios.post('http://localhost:4000/api/auth/get-user', {token});
      if(response.data === 'Error'){
         try{
            const response = await axios.post('http://localhost:4000/api/auth/is-token', {token} );
            if(response.data === "Verification Failed"){
                sessionStorage.removeItem("JWTToken");
                return {failed: "Verification Failed"};
            } else {
                return {message: 'success'}
            }
         }catch(err){
            return {error: 'error'}
         }
      } else {
         return response.data;
      }
   }catch(err){
      return {error: 'Not Authenticated', status: 400};
   }
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({})
  const dispatch = useDispatch();
  const loader = useLoaderData();
  
  useEffect(() => {
     if(loader){
         if(loader.error || loader.failed){
            navigate('/login');
         } else {
            setData(loader);
         }
      }
  },[navigate, loader])

  function handleLogout(){
      sessionStorage.removeItem("JWTToken");
      navigate('/login');
      dispatch(showToast({id: Date.now(), isOpen:true, message:"Logout Successfully", color:'green'}))
  }

  return (
      <div className='dashboard'>
      <header className='header'>
         <h2>Dashboard</h2>
         <button onClick={handleLogout} className='logout'>
         Logout
         </button>
      </header>
      
      <main className='main'>
         <h1>Where were you <b style={{color: 'red'}}>{data.FullName}</b> ! </h1>
         <h1>Welcome to the Dashboard {data.FullName}</h1>
      </main>
      </div>
  )
}

export default Dashboard