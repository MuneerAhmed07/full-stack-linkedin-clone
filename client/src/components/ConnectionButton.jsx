import { useContext, useEffect, useState } from 'react'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios';
import io from "socket.io-client";
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

let socket = io("http://localhost:3000");

const ConnectionButton = ({ userId }) => {

    let { serverUrl } = useContext(authDataContext);
    let { userData, setUserData } = useContext(userDataContext);

    let [status, setStatus] = useState("");
    let navigate = useNavigate();

    // handle Send Connection Function
    const handleSendConnection = async () => {
        try {
            let result = await axios.post(`${serverUrl}/api/connection/send/${userId}`, {}, { withCredentials: true });
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    }

    // handle get Status function
    const handleGetStatus = async () => {
        try {
            let result = await axios.get(`${serverUrl}/api/connection/getstatus/${userId}`, { withCredentials: true });
            // console.log(result);

            setStatus(result.data.status);
        } catch (error) {
            console.log(error);
        }
    }

    // remove Connection Function
    const handleRemoveConnection = async () => {
        try {
            let result = await axios.delete(`${serverUrl}/api/connection/remove/${userId}`, { withCredentials: true });

            console.log(result);
        } catch (error) {
            console.log(error);
        }
    }

    // handle Click Function
    const handleClick = async () => {
        if (status == "disconnect") {
            await handleRemoveConnection();
        } else if (status == "received") {
            navigate("/network");
        } else {
            await handleSendConnection();
        }
    }

    // useEffect
    useEffect(() => {
        socket.emit("register", userData._id);
        handleGetStatus();

        socket.on("statusUpdate", ({ updatedUserId, newStatus }) => {
            if (updatedUserId == userId) {
                setStatus(newStatus);
            }
        })

        return () => {
            socket.off("statusUpdate");
        }
    }, [userId]);

    return (
        <button className='w-[100%] my-[20px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] px-[15px] py-[5px]' onClick={handleClick} disabled={status=="pending"}>{status}</button>
    )
}

export default ConnectionButton;
