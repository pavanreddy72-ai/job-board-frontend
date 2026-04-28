
import React, { useState } from 'react'
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
const HandleAPi = () => {
 const [username,setUsername] = useState("");
 const [password,setPassword] = useState("");
 const navigate = useNavigate();
 const handleLogin = async()=>{

 try{
 const res = await API.post('token/',{
 username:username,
 password:password
 }) ;
 console.log(res);
 localStorage.setItem('token',res.data.access);

 localStorage.setItem('refreshToken',res.data.refresh);
 console.log("Login successful",res.data);
 alert("Login Successful");
 navigate('/students');
 }catch(error){
 console.log("Login failed",error);
 alert("Login Failed");
 }

 }
return (
 <div>
 <h1>Login page</h1>
 <div>
 <label>Username : </label>
 <input type='text' value={username}
onChange={(e)=>setUsername(e.target.value)}/>
<br/>
<label>Password : </label>
 <input type='password' value={password}
onChange={(e)=>setPassword(e.target.value)} />
<br/>
 <button onClick={handleLogin}>Login</button>
 </div>
 </div>
 )
}
export default HandleAPi
