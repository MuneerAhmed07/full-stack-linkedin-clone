import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';
import { userDataContext } from '../context/UserContext';
import { io } from "socket.io-client";
import ConnectionButton from './ConnectionButton';

// Moment Package
import moment from 'moment';

// import Image
import dp_image from "../assets/profile.png";

// Import Icons Here
import { BiLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";
import { BiSolidLike } from "react-icons/bi";
import { IoMdSend } from "react-icons/io";


let socket = io("http://localhost:3000");

const ShowPost = ({ id, author, like, comment, description, image, createdAt }) => {

    let [more, setMore] = useState(false);
    let [likeCount, setLikeCount] = useState(like || []);
    let { userData, setUserData, getPost, handleGetProfile } = useContext(userDataContext);
    let { serverUrl } = useContext(authDataContext);
    let [commentContent, setCommentContent] = useState("");
    let [comments, setComments] = useState(comment || []);
    let [showComment, setShowComment] = useState(false);

    // handle like Function
    const handleLike = async () => {
        try {
            let result = await axios.get(serverUrl + `/api/post/like/${id}`, { withCredentials: true })
            // console.log(result);
            setLikeCount(result.data.like);
        } catch (error) {
            console.log(error);
        }
    }

    // handle Comment function
    const handleComment = async (e) => {
        e.preventDefault();
        try {
            let result = await axios.post(serverUrl + `/api/post/comment/${id}`,
                { content: commentContent },
                { withCredentials: true })
            setComments(result.data.comment);
            // console.log(result.data.comment);
            setCommentContent("");
        } catch (error) {
            console.log(error);
        }
    }

    // useEffect for Like and comment updated
    useEffect(() => {
        // like
        socket.on("likeUpdated", ({ postId, likes }) => {
            if (postId == id) {
                setLikeCount(likes);
            }
        });

        // comment
        socket.on("commentAdded", ({ postId, comm }) => {
            if (postId == id) {
                setComments(comm);
            }
        });

        return () => {
            socket.off("likeUpdated");
            socket.off("commentAdded");
        }
    }, [id]);

    // useEffect
    useEffect(() => {
        getPost();
    }, [likeCount, setLikeCount, comments])

    return (
        <div className='w-full min-h-[200px] flex flex-col gap-[15px] bg-white rounded-lg p-[20px]'>
            {/* userDetails */}
            <div className='flex  justify-between items-center'>
                {/* Profile container */}
                <div className='flex items-start gap-[10px]' onClick={() => handleGetProfile(author.userName)}>
                    <div className='w-[60px] h-[60px] rounded-full overflow-hidden items-center justify-center cursor-pointer object-cover'>
                        <img src={author.profileImage || dp_image} alt="" className='w-full h-full object-cover' />
                    </div>
                    {/* detail Container */}
                    <div>
                        <div className="name text-[17px] font-semibold text-gray-700">{`${author.firstName} ${author.lastName}`}</div>
                        <div className='text-[14px] text-gray-600'>{author.headline || ""}</div>
                        <div className='text-[12px] text-gray-600'>{moment(createdAt).fromNow()}</div>
                    </div>
                </div>
                {/* button container  */}
                <div>
                    {userData._id != author._id && <ConnectionButton userId={author._id} />}
                </div>
            </div>

            {/* Post Details */}
            <div className={`w-full ${!more ? "max-h-[100px] overflow-hidden" : ""} `}>{description}</div>
            <div className='text-[18px] font-semibold cursor-pointer' onClick={() => setMore(prev => !prev)}>{more ? "read less..." : "read more..."}</div>
            {image && <div className='w-full h-[300px] overflow-hidden rounded-lg'>
                <img src={image} alt="" className='object-cover' />
            </div>}

            {/* Like and Comment container */}
            <div>
                <div className='w-full flex justify-between items-center py-[15px] border-b-2 border-gray-300'>
                    <div className='flex items-center justify-center gap-[5px] text-[18px]'>
                        <BiLike className='text-[#1ebbff] w-[20px] h-[20px]' />
                        <span>{likeCount.length}</span>
                    </div>
                    <div className='flex items-center justify-center gap-[5px] text-[18px] cursor-pointer' onClick={() => setShowComment(prev => !prev)}>
                        <span>{comment.length}</span>
                        <span>comments</span>
                    </div>
                </div>
                {/* Like and Comment Section */}
                <div className='w-full flex gap-[20px] items-center py-[15px]'>
                    {!likeCount.includes(userData._id) && <div className='flex items-center justify-center gap-[5px] text-[18px] cursor-pointer' onClick={handleLike}>
                        <BiLike className='w-[22px] h-[22px]' />
                        <span>Like</span>
                    </div>}

                    {likeCount.includes(userData._id) && <div className='flex items-center justify-center gap-[5px] text-[18px] cursor-pointer' onClick={handleLike}>
                        <BiSolidLike className='text-[#07a4ff] w-[22px] h-[22px]' />
                        <span className='text-[#07a4ff]'>Liked</span>
                    </div>}
                    <div className='flex items-center justify-center gap-[5px] text-[18px]' onClick={() => setShowComment(prev => !prev)}>
                        <span><FaRegCommentDots className='w-[22px] h-[22px] cursor-pointer' /></span>
                        <span className='cursor-pointer'>comments</span>
                    </div>
                </div>
                {/* comment form */}
                {showComment &&
                    <div>
                        <form onSubmit={handleComment} className='w-full flex justify-between items-center border-b border-b-gray-300 p-[10px]'>
                            <input type="text" placeholder={"leave a comment"} className='outline-none border-none' value={commentContent} onChange={(e) => setCommentContent(e.target.value)} />
                            <button>
                                <IoMdSend className='text-[#07a4ff] w-[20px] h-[20px]' />
                            </button>
                        </form>
                        {/* comment show */}
                        <div className='flex flex-col gap-[10px]'>
                            {comments.map((com, index) => (
                                <div key={index} className='flex flex-col gap-[10px] border-b p-[20px] border-b-gray-300'>
                                    {/* profile data */}
                                    <div className='w-full flex justify-start gap-[10px] items-center'>
                                        <div className='w-[40px] h-[40px] rounded-full overflow-hidden items-center justify-center cursor-pointer object-cover'>
                                            <img src={com.user.profileImage || dp_image} alt="" className='w-full h-full object-cover' />
                                        </div>
                                        <div>
                                            <div className="name text-[17px] font-semibold text-gray-700">{`${com.user.firstName} ${com.user.lastName}`}</div>
                                            <div className='text-[12px]'>{moment(com.createdAt).fromNow()}</div>
                                        </div>
                                    </div>
                                    {/* comment Data */}
                                    <div className='pl-[30px]'>{com.content}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                }
            </div>

        </div>
    )
}

export default ShowPost;
