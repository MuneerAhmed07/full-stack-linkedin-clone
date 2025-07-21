import React, { useContext, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext';
import { authDataContext } from '../context/AuthContext';

import dp_image from "../assets/profile.png";

// Icon Import Here
import { RxCross2 } from "react-icons/rx";
import { BsImage } from "react-icons/bs";
import axios from 'axios';

const CreatePost = () => {

    let { userData, setUserData, post, setPost } = useContext(userDataContext);
    let{serverUrl} = useContext(authDataContext);

    // usestate for handle post
    let [frontendImage, setFrontendImage] = useState("");
    let [backendImage, setBackendImage] = useState("");
    let [description, setDescription] = useState("");
    let [posting, setPosting] = useState(false);

    let image = useRef();

    // handle image function
    function handleImage(e) {
        let file = e.target.files[0];
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
    }

    // Call Post API
    async function handleUploadPost() {
        setPosting(true);
        try {
            let formdata = new FormData();
            formdata.append("description", description);
            if(backendImage) {
                formdata.append("image", backendImage);
            }

            let result = await axios.post(serverUrl+"/api/post/create", formdata, {withCredentials:true});
            // console.log(result);
            setPosting(false);
            setPost(false);
        } catch (error) {
            setPosting(false);
            console.log(error);            
        }
    }

    return (
        <div className='w-full h-[100vh] fixed z-[100] flex justify-center items-center'>
            <div className='w-[100%] bg-black opacity-[0.5] h-full absolute'></div>
            {/* Create Post Container */}
            <div className={`w-[90%] max-w-[550px] h-[550px] overflow-auto bg-white relative z-[200] shadow-lg rounded-lg p-[20px] flex flex-col gap-[20px]`}>
                {/* Cross icon */}
                <div className='absolute top-[20px] right-[20px]'>
                    <RxCross2 className='w-[20px] h-[20px] text-gray-800 font-semibold cursor-pointer' onClick={() => setPost(false)} />
                </div>

                {/* profile  */}
                <div className='flex gap-[10px] items-center'>
                    <div className='w-[50px] h-[50px] rounded-full overflow-hidden items-center justify-center cursor-pointer object-cover'>
                        <img src={userData.profileImage || dp_image} alt="" className='w-full h-full object-cover' />
                    </div>
                    <h2 className='text-[20px] font-semibold'>{`${userData.firstName} ${userData.lastName}`}</h2>
                </div>

                {/* textarea */}
                <textarea name="" className={`w-full h-[550px] outline-none border-none p-[10px] resize-none rounded-md text-[18px]`} placeholder='What do you want to talk about?' value={description} onChange={(e) => setDescription(e.target.value)}></textarea>

                {/* bottom container */}
                <div className={`bottom w-full ${frontendImage ? "h-[300px]" : "h-[200px]"} flex flex-col`}>
                    <div className='image'>
                        <img src={frontendImage} alt="" className='' />
                    </div>
                    <div className='p-[20px] flex items-center justify-start border-b-2 border-[#ccc]'>
                        <BsImage className='w-[20px] h-[20px] cursor-pointer text-gray-600' onClick={() => image.current.click()} />
                    </div>
                    <input type="file" ref={image} hidden onChange={handleImage} />
                    <div className='mt-2 w-full text-right'>
                        <button className='w-[100px] py-2 px-3 rounded-md bg-blue-600 mt-4 text-white font-semibold' disabled={posting} onClick={handleUploadPost}>{posting ? "Posting..." : "Post"}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePost;
