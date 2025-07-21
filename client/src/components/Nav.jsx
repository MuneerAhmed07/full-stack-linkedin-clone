import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

// import Icons
import { IoSearchSharp } from "react-icons/io5";
import { IoMdHome } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";

// Import Images
import logo2 from "../assets/logo-2.png";
import dp_image from "../assets/profile.png";

// Import userContext
import { userDataContext } from '../context/UserContext';
import { authDataContext } from '../context/AuthContext';

const Nav = () => {

    // usestate variable
    let [activeSearch, setActiveSearch] = useState(false);
    let [showPopup, setShowPopup] = useState(false);
    let [searchInput, setSearchInput] = useState("");
    let [searchData, setSearchData] = useState([]);

    let { userData, setUserData, handleGetProfile } = useContext(userDataContext);
    let { serverUrl } = useContext(authDataContext);

    let navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            let result = await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true });
            setUserData(null);
            navigate("/login");
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    }

    // handle Search
    const handleSearch = async () => {
        try {
            let result = await axios.get(`${serverUrl}/api/user/search?query=${searchInput}`, { withCredentials: true });
            setSearchData(result.data);
        } catch (error) {
            setSearchData([]);
            console.log(error);
        }
    }

    useEffect(() => {
        handleSearch();
    }, [searchInput]);

    return (
        <div className='w-full h-[55px] bg-white fixed top-0 flex justify-between md:justify-around items-center px-[10px] shadow-md z-[100]'>
            {/* left Column */}
            <div className="left-col flex justify-center items-center gap-[10px]">
                {/* logo */}
                <div onClick={() => setActiveSearch(false)}>
                    <img src={logo2} alt="" className='w-[40px] cursor-pointer' onClick={() => navigate("/")} />
                </div>
                {/* Searchbar */}

                {!activeSearch && <div><IoSearchSharp className='w-[20px] h-[20px] text-gray-700 lg:hidden' onClick={() => setActiveSearch(true)} /></div>}

                {searchData.length > 0 &&
                    <div className='absolute top-[70px] left-0 lg:left-[120px] w-[100%] lg:w-[700px] bg-white shadow-lg flex flex-col gap-[20px] p-[20px] rounded-lg'>
                        {searchData.map((search) => (
                            <div className='flex gap-[10px] items-center border-b border-gray-300 rounded-lg p-[10px] hover:bg-gray-200 cursor-pointer' onClick={() => handleGetProfile(search.userName)}>
                                <div className='w-[50px] h-[50px] rounded-full overflow-hidden' onClick={() => navigate("/profile")}>
                                    <img src={search.profileImage || dp_image} alt="" className='w-full h-full' />
                                </div>
                                <div>
                                    <div className='text-[18px] font-semibold text-gray-700'>
                                        {`${search.firstName} ${search.lastName}`}
                                    </div>
                                    <div className='text-[14px]  text-gray-700'>
                                        {search.headline}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                }

                <form className={`w-[200px] lg:w-[300px] h-[35px] bg-[#f1efe3] lg:flex items-center gap-[10px] rounded-md px-[10px] ${!activeSearch ? "hidden" : "flex"}`}>
                    <div><IoSearchSharp className='w-[20px] h-[20px] text-gray-700' /></div>
                    <input type="text" value={searchInput} className='w-[80%] h-full bg-transparent outline-none border-0' placeholder='search users...' onChange={(e) => setSearchInput(e.target.value)} />
                </form>
            </div>

            {/* Right Column */}

            <div className='right-col flex justify-center items-center gap-[20px] relative'>

                {/* profile Popup container */}
                {showPopup &&
                    <div className="w-[300px] min-h-[300px] bg-white absolute top-[70px] rounded-lg flex flex-col items-center p-[20px] gap-[20px]">
                        <div className='w-[50px] h-[50px] rounded-full overflow-hidden' onClick={() => navigate("/profile")}>
                            <img src={userData.profileImage || dp_image} alt="" className='w-full h-full' />
                        </div>
                        <div className='text-[18px] font-semibold text-gray-700'>
                            {`${userData.firstName} ${userData.lastName}`}
                        </div>
                        <button className='w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]' onClick={() => handleGetProfile(userData.userName)}>View Profile</button>
                        <div className='w-full h-[1px] bg-gray-700'></div>
                        <div className='w-full flex items-center justify-start text-gray-600 text-sm gap-3 cursor-pointer' onClick={() => navigate("/network")}>
                            <FaUserFriends className='w-[20px] h-[20px]' />
                            <div>My Networks</div>
                        </div>
                        <button onClick={handleSignOut} className='w-[100%] h-[40px] rounded-full border-2 border-[#ec4545] text-[#ec4545]'>Sign Out</button>
                    </div>
                }

                {/* Right side Link and profile Pic */}
                <div className='lg:flex flex-col items-center justify-center text-gray-600 text-sm hidden cursor-pointer' onClick={() => navigate("/")}>
                    <IoMdHome className='w-[20px] h-[20px]' />
                    <div>Home</div>
                </div>
                <div className='lg:flex flex-col items-center justify-center text-gray-600 text-sm hidden cursor-pointer' onClick={() => navigate("/network")}>
                    <FaUserFriends className='w-[20px] h-[20px]' />
                    <div>My Networks</div>
                </div>
                <div className='flex flex-col items-center justify-center text-gray-600 text-sm cursor-pointer'>
                    <IoNotifications className='w-[20px] h-[20px]' />
                    <div className='md:block hidden'>Notifications</div>
                </div>
                <div className='w-[40px] h-[40px] rounded-full overflow-hidden cursor-pointer' onClick={() => setShowPopup(prev => !prev)}>
                    <img src={userData.profileImage || dp_image} alt="" className='w-full h-full' />
                </div>
            </div>
        </div>
    )
}

export default Nav
