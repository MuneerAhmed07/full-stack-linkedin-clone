import React, { useContext, useEffect, useState } from 'react'
import Nav from '../components/Nav';
import { userDataContext } from '../context/UserContext';

import dp_image from "../assets/profile.png";
import EditProfile from '../components/EditProfile';
import CreatePost from '../components/CreatePost';
import ShowPost from '../components/ShowPost';

// icons
import { GoPlus } from "react-icons/go";
import { MdOutlineCameraAlt } from "react-icons/md";
import { HiPencil } from "react-icons/hi2";
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';
import ConnectionButton from '../components/ConnectionButton';

const Profile = () => {

    let { userData, setUserData, edit, setEdit, post, setPost, postData, setPostData, profileData, setProfileData } = useContext(userDataContext);

    let [profilePost, setProfilePost] = useState([]);
    let { serverUrl } = useContext(authDataContext);


    useEffect(() => {
        setProfilePost(postData.filter((post) => post.author._id == profileData._id));
    }, [profileData]);

    return (
        <div className='w-full min-h-[100vh] bg-black flex flex-col items-center pb-[40px]'>
            <Nav />

            {edit && <EditProfile />}

            <div className='w-full max-w-[900px] min-h-[100vh] pt-[80px] flex flex-col items-center gap-[10px]'>
                {/* For Image */}
                <div className='w-full min-h-[200px] bg-[#f7f7f7] rounded-lg p-[10px] relative'>

                    {/* cover image */}
                    <div className="w-[100%] h-[150px] bg-gray-300 rounded overflow-hidden flex items-center justify-center cursor-pointer" onClick={() => setEdit(true)}>
                        <img src={profileData.coverImage || ""} alt="" className='w-full' />
                        <MdOutlineCameraAlt className='absolute top-[20px] right-[20px] w-[20px] h-[20px] text-gray-800 cursor-pointer' />
                    </div>

                    {/* profile image */}
                    <div className='w-[70px] h-[70px] rounded-full overflow-hidden items-center justify-center absolute top-[120px] left-[35px] cursor-pointer object-cover' onClick={() => setEdit(true)}>
                        <img src={profileData.profileImage || dp_image} alt="" className='w-full h-full object-cover' />
                    </div>
                    <div className='w-[20px] h-[20px] bg-[#17c1ff] absolute top-[155px] left-[95px] rounded-full flex items-center justify-center cursor-pointer text-white'>
                        <GoPlus />
                    </div>

                    {/* detail container */}
                    <div className="details mt-[35px] pl-[20px]">
                        <div className="name text-[18px] font-semibold text-gray-700">{`${userData.firstName} ${profileData.lastName}`}</div>
                        <div className='text-[16px] text-gray-600'>{profileData.headline || ""}</div>
                        <div className='text-sm text-gray-500'>{profileData.location}</div>
                        <div className='text-sm text-gray-500'>{`${profileData.connection.length} connection`}</div>
                    </div>
                    {profileData._id == userData._id &&
                        <button className='min-w-[150px] h-[40px] my-[20px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center gap-[10px]' onClick={() => setEdit(true)}>Edit Profile <HiPencil /></button>
                    }

                    {profileData._id != userData._id &&
                        <div className='ml-[15px] w-[130px] cursor-pointer'> <ConnectionButton userId={profileData._id} /></div>
                    }
                </div>
                {/* All Post Show */}
                <div className='w-full h-[100px] flex items-center p-[20px] text-[20px] text-gray-600 rounded-lg bg-[#f7f7f7]'>{`Post (${profilePost.length})`}</div>
                <div className="flex w-full h-screen overflow-x-auto overflow-y-hidden flex-row snap-x snap-mandatory">
                    {profilePost.map((post, index) => (
                        <div key={index} className="min-w-full h-full snap-start">
                            <ShowPost id={post._id} description={post.description} author={post.author} image={post.image} like={post.like} comment={post.comment} createdAt={post.createdAt} />
                        </div>
                    ))}
                </div>

                {/* Section for Skills */}
                {userData.skills.length &&
                    <div className='w-full min-h-[100px] p-[20px] rounded-lg bg-[#f7f7f7]'>
                        <div className='w-full flex items-center text-[20px] mb-[10px] text-gray-600 rounded-lg bg-[#f7f7f7]'>{`Skills`}</div>
                        <div className='flex flex-wrap justify-start items-center gap-[20px]'>
                            {userData.skills.map((skill) => (
                                <div>{skill}</div>
                            ))}
                        </div>
                    </div>
                }

                {/* section for education */}
                {userData.education.length &&
                    <div className='w-full min-h-[100px] p-[20px] rounded-lg bg-[#f7f7f7]'>
                        <div className='w-full flex items-center text-[20px] mb-[10px] text-gray-600 rounded-lg bg-[#f7f7f7]'>{`Education`}</div>
                        <div className='flex flex-wrap justify-start items-center gap-[20px]'>
                            {userData.education.map((edu, index) => (
                                <div key={index} className='border border-gray-200 p-[20px] rounded-lg w-full'>
                                    <div>College: {edu.college}</div>
                                    <div>Degree: {edu.degree}</div>
                                    <div>Field Of Study: {edu.fieldofstudy}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                }

                {/* Section for experience */}
                {userData.experience.length &&
                    <div className='w-full min-h-[100px] p-[20px] rounded-lg bg-[#f7f7f7]'>
                        <div className='w-full flex items-center text-[20px] mb-[10px] text-gray-600 rounded-lg bg-[#f7f7f7]'>{`Experience`}</div>
                        <div className='flex flex-wrap justify-start items-center gap-[20px]'>
                            {userData.experience.map((exp, index) => (
                                <div key={index} className='border border-gray-200 p-[20px] rounded-lg w-full'>
                                    <div>Title: {exp.title}</div>
                                    <div>Company: {exp.company}</div>
                                    <div>Description: {exp.description}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Profile
