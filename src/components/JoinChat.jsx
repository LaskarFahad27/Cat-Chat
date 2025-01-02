import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, getDatabase, onValue, set } from 'firebase/database';
import loader from './images/loader.gif';

const JoinChat = () => {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
   
    const handleJoinChat = () => {
        if (!code.trim()) {
            alert("Please enter a valid chat code!");
            return;
        }
        setIsLoading(true);
        const db = getDatabase();
        const chatRoomRef = ref(db, `chatRooms/${code}`);
 
        onValue(chatRoomRef, (snapshot) => {
            if (snapshot.exists()) {
                setIsLoading(false);
                navigate(`/chat/${code}`);
            } else {
                const newRoomName = prompt("There Is No Chatroom With This Code.Put a Chatroom Name To Create a New Chatroom With This Code");
                if (newRoomName && newRoomName.trim() !== "") {
                    set(chatRoomRef, { name: newRoomName, messages: [] }); 
                    setIsLoading(false);
                    navigate(`/chat/${code}`);
                } else {
                    setIsLoading(false);
                    alert("Chat room name cannot be empty!");
                }
            }
        }, { onlyOnce: true });
    };

    return (
        <div className="page">
            <div className="cntnr">
            <h2 className='head'>Join a Chat Room</h2>
            <input
                className="roomCode"
                type="text"
                placeholder="Enter Chat Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
            <button className="join" onClick={handleJoinChat}>Join</button>
            {isLoading && (
                <img id='loader' src={loader} alt="loading..." />
            )}
        </div>
        </div>
    );
};

export default JoinChat;
