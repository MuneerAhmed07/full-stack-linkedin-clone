import React, { useContext, useState } from 'react';
import logo from "../assets/Linkedin.png";
import { useNavigate } from 'react-router-dom';
import { authDataContext } from '../context/AuthContext';
import axios from "axios";

// Import React Icon
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { userDataContext } from '../context/UserContext';

const Login = () => {

    // usestate for Password show and hide
    let [show, setShow] = useState(false);
    let navigate = useNavigate();
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [loading, setLoading] = useState(false);
    let [err, setErr] = useState("");


    // use Context variable
    let {serverUrl} = useContext(authDataContext);
    let {userData, setUserData} = useContext(userDataContext);

    // Handle signIn
    const handleSignin = async (e) => {
      e.preventDefault();
      setLoading(true);
        try{
            let result = await axios.post(serverUrl+"/api/auth/login", {
              email, password
            }, {withCredentials: true});
            // console.log(result);
            setUserData(result.data);
            navigate("/");
            setErr("");
            setLoading(false);
            setEmail("");
            setPassword("");
        }catch(error) {
          setErr(error.response.data.message);
          setLoading(false);
        }
    }

  return (
    <div className='w-full h-screen bg-black flex flex-col items-center justify-start gap-[10px]'>
      <div className='p-[30px] lg:p-[35px] w-full items-center'>
        <img className='w-32' src={logo} alt="" />
      </div>
      {/* Signup Form */}
      <form onSubmit={handleSignin} className='w-[90%] max-w-[400px] bg-white flex flex-col justify-center gap-[10px] p-10 rounded-md'>
        <h1 className='text-gray-800 text-[30px] font-semibold mb-3'>Sign In</h1>
        <input type="email" placeholder='email' required autoComplete='off' className='w-[100%] py-2 px-3 border border-gray-600 text-gray-800 text-[16px] rounded-md' value={email} onChange={(e) =>setEmail(e.target.value)} />
        <div className='w-[100%] border border-gray-600 text-gray-800 text-[16px] rounded-md relative'>
            <input type={show ? "text" : "password"} placeholder='password' required autoComplete='off' className='w-full h-full py-2 px-3 rounded-md' value={password} onChange={(e) =>setPassword(e.target.value)} />
            <span className='absolute right-[20px] top-[10px] cursor-pointer' onClick={() => setShow(prev=>!prev)}>{show ? <FaEyeSlash /> : <FaRegEye />}</span>
        </div>

      {err && <p className='text-red-600 text-sm'>{err}</p>}

        <button className='w-[100%] py-2 px-3 rounded-full bg-[#2080b4] mt-4 text-white' disabled={loading}>{loading ? "loading..." : "Log In"}</button>
        <p className='text-center'>Don't have an Account ? <span className='text-[#2f9ed9] cursor-pointer' onClick={() => navigate("/signup")}>Sign Up</span></p>
      </form>
    </div>
  )
}

export default Login;
