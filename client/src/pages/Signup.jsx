import React, { useContext, useState } from 'react';
import logo from "../assets/Linkedin.png";
import { useNavigate } from 'react-router-dom';
import { authDataContext } from '../context/AuthContext';
import axios from "axios";

// Import React Icon
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { userDataContext } from '../context/UserContext';

const Signup = () => {

    // usestate for Password show and hide
    let [show, setShow] = useState(false);
    let navigate = useNavigate();
    let [firstName, setFirstName] = useState("");
    let [lastName, setLastName] = useState("");
    let [userName, setUserName] = useState("");
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [loading, setLoading] = useState(false);
    let [err, setErr] = useState("");


    // use Context variable
    let {serverUrl} = useContext(authDataContext);
    let {userData, setUserData} = useContext(userDataContext);

    // Handle Signup
    const handleSignup = async (e) => {
      e.preventDefault();
      setLoading(true);
        try{
            let result = await axios.post(serverUrl+"/api/auth/signup", {
              firstName, lastName, userName, email, password
            }, {withCredentials: true});
            // console.log(result);
            setUserData(result.data);
            navigate("/");
            setErr("");
            setLoading(false);
            setFirstName("");
            setLastName("");
            setUserName("");
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
      <form onSubmit={handleSignup} className='w-[90%] max-w-[400px] h-[500px] bg-white flex flex-col justify-center gap-[10px] p-10 rounded-md'>
        <h1 className='text-gray-800 text-[30px] font-semibold mb-3'>Sign Up</h1>
        <input type="text" placeholder='firstname' required autoComplete='off' className='w-[100%] py-2 px-3 border border-gray-600 text-gray-800 text-[16px] rounded-md' value={firstName} onChange={(e) =>setFirstName(e.target.value)} />
        <input type="text" placeholder='lastname' required autoComplete='off' className='w-[100%] py-2 px-3 border border-gray-600 text-gray-800 text-[16px] rounded-md' value={lastName} onChange={(e) =>setLastName(e.target.value)}  />
        <input type="text" placeholder='username' required autoComplete='off' className='w-[100%] py-2 px-3 border border-gray-600 text-gray-800 text-[16px] rounded-md' value={userName} onChange={(e) =>setUserName(e.target.value)} />
        <input type="email" placeholder='email' required autoComplete='off' className='w-[100%] py-2 px-3 border border-gray-600 text-gray-800 text-[16px] rounded-md' value={email} onChange={(e) =>setEmail(e.target.value)} />
        <div className='w-[100%] border border-gray-600 text-gray-800 text-[16px] rounded-md relative'>
            <input type={show ? "text" : "password"} placeholder='password' required autoComplete='off' className='w-full h-full py-2 px-3 rounded-md' value={password} onChange={(e) =>setPassword(e.target.value)} />
            <span className='absolute right-[20px] top-[10px] cursor-pointer' onClick={() => setShow(prev=>!prev)}>{show ? <FaEyeSlash /> : <FaRegEye />}</span>
        </div>

      {err && <p className='text-red-600 text-sm'>{err}</p>}

        <button className='w-[100%] py-2 px-3 rounded-full bg-[#2080b4] mt-4 text-white' disabled={loading}>{loading ? "loading..." : "Sign Up"}</button>
        <p className='text-center'>Already have an account ? <span className='text-[#2f9ed9] cursor-pointer' onClick={() => navigate("/login")}>Sign In</span></p>
      </form>
    </div>
  )
}

export default Signup
