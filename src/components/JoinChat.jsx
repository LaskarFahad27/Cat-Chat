import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, getDatabase, onValue, set } from 'firebase/database';

const JoinChat = () => {
    const [code, setCode] = useState('');
    const navigate = useNavigate();

    const handleJoinChat = () => {
        const db = getDatabase();
        const chatRoomRef = ref(db, `chatRooms/${code}`);
 
        onValue(chatRoomRef, (snapshot) => {
            if (snapshot.exists()) {
                navigate(`/chat/${code}`);
            } else {
                const newRoomName = prompt("There Is No Chatroom With This Code.Put a Chatroom Name To Create a New Chatroom With This Code");
                if (newRoomName && newRoomName.trim() !== "") {
                    set(chatRoomRef, { name: newRoomName, messages: [] }); 
                    navigate(`/chat/${code}`);
                } else {
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
        </div>
        </div>
    );
};

export default JoinChat;
