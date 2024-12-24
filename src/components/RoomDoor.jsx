import React, {useState, useCallback} from "react";
import { useNavigate } from 'react-router-dom';
import './Design.css'

const RoomDoor = () =>{
    const [roomCode, setRoomCode] = useState("");

    const navigate = useNavigate();

    const handleJoinRoom = useCallback(() => {
        navigate(`/room/${roomCode}`)
    },[navigate, roomCode])

    return(
        <div className="page">
            <div className="container">
                <input className="roomCode" 
                       type="text" 
                       placeholder="Enter Room Code"
                       value={roomCode} 
                       onChange={(e) => setRoomCode(e.target.value)}/>
                <button className="join"
                        onClick={handleJoinRoom}>Join</button>
            </div>
        </div>
    )
}
export default RoomDoor;