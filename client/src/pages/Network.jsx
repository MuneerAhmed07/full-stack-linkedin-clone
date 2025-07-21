import Nav from '../components/Nav';
import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import { authDataContext } from '../context/AuthContext';

import dp_image from "../assets/profile.png";

// React Icons
import { FaRegCheckCircle } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";

const Network = () => {

    let { serverUrl } = useContext(authDataContext);

    let [connections, setConnections] = useState([]);

    // handle Get Request Function
    const handleGetRequests = async () => {
        try {
            let result = await axios.get(`${serverUrl}/api/connection/requests`, { withCredentials: true });
            setConnections(result.data);
        } catch (error) {
            console.log(error);
        }
    }

    // hadnle AcceptConnection Function
    const handleAcceptConnection = async (requestId) => {
        try {
            let result = await axios.put(`${serverUrl}/api/connection/accept/${requestId}`, {}, { withCredentials: true });
            // console.log(result);
            setConnections(connections.filter((con) => con._id == requestId));
        } catch (error) {
            console.log(error);
        }
    }

    // handle Reject connection Function
        const handleRejectConnection = async (requestId) => {
        try {
            let result = await axios.put(`${serverUrl}/api/connection/reject/${requestId}`, {}, { withCredentials: true });
            // console.log(result);
            setConnections(connections.filter((con) => con._id == requestId));
        } catch (error) {
            console.log(error);
        }
    }

    // useEffect
    useEffect(() => {
        handleGetRequests();
    }, []);

    return (
        <div className='w-screen h-[100vh] bg-black pt-[100px] flex'>
            <Nav />

            <div className="w-full px-[20px] items-center flex flex-col gap-[20px] bg-black">
                <div className='w-full h-[100px] bg-white flex items-center p-[10px] text-[18px] rounded-lg'>
                    Invitations {connections.length}
                </div>

                {/* All Connection */}
                {connections.length > 0 && <div className='w-[100%] max-w-[700px]  min-h-[100px] bg-white flex items-center p-[10px] rounded-lg'>
                    {connections.map((connection, index) => (
                        <div key={index} className='flex justify-between items-center w-full'>
                            {/* profile */}
                            <div className='flex gap-[10px] items-center'>
                                <div className='w-[50px] h-[50px] rounded-full overflow-hidden'>
                                    <img src={connection.sender.profileImage || dp_image} alt="" className='w-full h-full' />
                                </div>
                                <div className='text-[18px] font-semibold text-gray-700'>
                                    {`${connection.sender.firstName} ${connection.sender.lastName}`}
                                </div>
                            </div>
                            {/* button */}
                            <div className='flex gap-[10px]'>
                                <button className='text-[red] font-semibold' onClick={() => handleRejectConnection(connection._id)}>
                                    <RxCrossCircled className='w-[32px] h-[32px]' />
                                </button>
                                <button className='text-[#715bee] font-semibold' onClick={() => handleAcceptConnection(connection._id)}>
                                    <FaRegCheckCircle className='w-[30px] h-[30px]' />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>}
            </div>
        </div>
    )
}

export default Network;
