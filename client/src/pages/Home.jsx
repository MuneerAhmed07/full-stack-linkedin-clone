import React, { useContext, useEffect, useState } from 'react'
import Nav from '../components/Nav';
import { userDataContext } from '../context/UserContext';

import dp_image from "../assets/profile.png";
// Icon Import Here
import { GoPlus } from "react-icons/go";
import { MdOutlineCameraAlt } from "react-icons/md";
import { HiPencil } from "react-icons/hi2";
import EditProfile from '../components/EditProfile';
import CreatePost from '../components/CreatePost';
import ShowPost from '../components/ShowPost';
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';


const Home = () => {

  let { userData, setUserData, edit, setEdit, post, setPost, postData, setPostData, handleGetProfile } = useContext(userDataContext);
  let { serverUrl } = useContext(authDataContext);

  let [suggestedUser, setSuggestedUser] = useState([]);

  // handle Suggested users
  const handleSuggestedUsers = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/user/suggesteduser", { withCredentials: true });
      setSuggestedUser(result.data);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleSuggestedUsers();
  }, [])


  return (
    <div className='w-full min-h-[100vh] bg-black pb-[50px]'>
      <Nav />

      {edit && <EditProfile />}
      {post && <CreatePost />}

      <div className="w-full min-h-[100vh] bg-black pt-[80px] flex items-start justify-center gap-[20px] flex-col lg:flex-row px-[20px]">

        {/* Left Container */}
        <div className='w-full lg:w-[25%] min-h-[200px] bg-[#f7f7f7] rounded-lg p-[10px] relative'>

          {/* cover image */}
          <div className="w-[100%] h-[100px] bg-gray-300 rounded overflow-hidden flex items-center justify-center cursor-pointer" onClick={() => setEdit(true)}>
            <img src={userData.coverImage || ""} alt="" className='w-full' />
            <MdOutlineCameraAlt className='absolute top-[20px] right-[20px] w-[20px] h-[20px] text-gray-800 cursor-pointer' />
          </div>

          {/* profile image */}
          <div className='w-[70px] h-[70px] rounded-full overflow-hidden items-center justify-center absolute top-[65px] left-[35px] cursor-pointer object-cover' onClick={() => setEdit(true)}>
            <img src={userData.profileImage || dp_image} alt="" className='w-full h-full object-cover' />
          </div>
          <div className='w-[20px] h-[20px] bg-[#17c1ff] absolute top-[108px] left-[95px] rounded-full flex items-center justify-center cursor-pointer text-white'>
            <GoPlus />
          </div>

          {/* detail container */}
          <div className="details mt-[35px] pl-[20px]">
            <div className="name text-[18px] font-semibold text-gray-700">{`${userData.firstName} ${userData.lastName}`}</div>
            <div className='text-[16px] text-gray-600'>{userData.headline || ""}</div>
            <div className='text-sm text-gray-500'>{userData.location}</div>
          </div>
          <button className='w-[100%] h-[40px] my-[20px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center gap-[10px]' onClick={() => setEdit(true)}>Edit Profile <HiPencil /></button>
        </div>

        {/* Middle Container */}
        <div className='w-full lg:w-[50%] min-h-[200px] bg-[#222] flex flex-col gap-[20px]'>
          {/* create post */}
          <div className="w-full h-[100px] bg-white rounded-lg flex items-center justify-center gap-[10px] p-[10px]">
            {/* profile  */}
            <div className='w-[50px] h-[50px] rounded-full overflow-hidden items-center justify-center cursor-pointer object-cover'>
              <img src={userData.profileImage || dp_image} alt="" className='w-full h-full object-cover' />
            </div>
            <button className='w-[80%] h-[50px] border border-[#ccc] rounded-full text-left px-[20px] hover:bg-[#f7f6f6]' onClick={() => setPost(true)}>Start a post</button>
          </div>

          {/* Show All Post */}
          {postData.map((post, index) => (
            <ShowPost key={index} id={post._id} description={post.description} author={post.author} image={post.image} like={post.like} comment={post.comment} createdAt={post.createdAt} />
          ))}
        </div>

        {/* Right Container */}
        <div className='w-full lg:w-[25%] min-h-[200px] bg-[#f7f7f7] p-[20px] hidden lg:flex flex-col'>
          <h1 className='text-[20px] text-gray-600 font-semibold'>Suggested User</h1>
          {suggestedUser.length > 0 && <div className='flex flex-col gap-[10px]'>
            {suggestedUser.map((su) => (
              <div className='pt-[10px]'>
                <div className='flex gap-[10px] items-center border-b border-gray-300 rounded-lg p-[10px] hover:bg-gray-200 cursor-pointer' onClick={() => handleGetProfile(su.userName)}>
                  <div className='w-[50px] h-[50px] rounded-full overflow-hidden' onClick={() => navigate("/profile")}>
                    <img src={su.profileImage || dp_image} alt="" className='w-full h-full' />
                  </div>
                  <div>
                    <div className='text-[18px] font-semibold text-gray-700'>
                      {`${su.firstName} ${su.lastName}`}
                    </div>
                    <div className='text-[14px]  text-gray-700'>
                      {su.headline}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>}
          {suggestedUser.length == 0 && <div>
            No Suggested User
          </div>}
        </div>
      </div>
    </div>
  )
}

export default Home;
