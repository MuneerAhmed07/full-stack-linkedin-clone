import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const userDataContext = createContext();

const UserContext = ({ children }) => {

    let [userData, setUserData] = useState(null);
    let {serverUrl} = useContext(authDataContext);
    let [edit, setEdit] = useState(false);
    let [post, setPost] = useState(false);
    let [postData, setPostData] = useState([]);
    let [profileData, setProfileData] = useState([]);
    let navigate = useNavigate();

    // Get Current User
    const getCurrentUser = async () => {
        try {
            let result = await axios.get(serverUrl+"/api/user/currentuser", {withCredentials: true});
            // console.log(result);
            setUserData(result.data);
        } catch (error) {
            console.log(error);
            setUserData(null);
        }
    }

    // get All Post
    const getPost = async ()=> {
        try {
            let result = await axios.get(serverUrl+"/api/post/getpost", {withCredentials: true});
            // console.log(result);
            setPostData(result.data);
        } catch (error) {
            console.log(error);
        }
    }

    // get single Profile
    const handleGetProfile = async (userName) => {
        try {
             let result = await axios.get(serverUrl+`/api/user/profile/${userName}`, {withCredentials: true});
             setProfileData(result.data);
             navigate("/profile");
        } catch (error) {
            console.log(error);
        }
    }

    // useEffect Hook
    useEffect(() => {
        getCurrentUser();
        getPost();
    }, []);

    // value object
    const value = {
        userData, setUserData,
        edit, setEdit,
        post, setPost,
        postData, setPostData,
        getPost,  handleGetProfile,
        profileData, setProfileData
    }

    return (
        <div>
            <userDataContext.Provider value={value}>
                {children}
            </userDataContext.Provider>
        </div>
    )
}

export default UserContext
