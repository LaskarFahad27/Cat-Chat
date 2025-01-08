import { useState, useEffect, useRef } from 'react'
import logo from './images/logo.png';
import './Chat.css'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faVideo, faArrowRightFromBracket, faBars, faUsers, faUser, faXmark, faPenToSquare, faImage, faReply, faMicrophone, faPlay, faCheck, faPause } from '@fortawesome/free-solid-svg-icons';
import { getDatabase, push, ref, set, onChildAdded, onValue, remove, onDisconnect } from "firebase/database";
import { auth, db } from './Firebase'; 
import { doc, getDoc } from "firebase/firestore"; 

const Chat= () => {
  const { code } = useParams();
  const [name, setName] = useState("");
  const [chats, setChats] = useState([]);
  const [msg, setMsg] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const inputRef = useRef(null);
  const [members, setMembers] = useState([]);
  const [roomName, setRoomName] = useState("");
  const chatListRef = ref(getDatabase(), `chatRooms/${code}/messages`);
  const typingRef = ref(getDatabase(), `chatRooms/${code}/typing`);
  const membersRef = ref(getDatabase(), `chatRooms/${code}/members`);
  const [hoveredMessage, setHoveredMessage] = useState([]);
  const [repliedMessage, setRepliedMessage] = useState("");
  const [replyIndicator, setReplyIndicator] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState("");

const navigate = useNavigate();

  const barOpen = () =>{
    document.getElementById("sidebar").style.display = "flex";
    document.getElementById("bars").style.display = "none";
    document.getElementById("xmark").style.display = "flex";
  }
  const barClose = () =>{
    document.getElementById("sidebar").style.display = "none";
    document.getElementById("bars").style.display = "flex";
    document.getElementById("xmark").style.display = "none";
  }

  const autoScroll = () => {
    const element = document.getElementById("chatCon");
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  };
  
    const fetchUserName = async () => {
      const user = auth.currentUser; 
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setName(userDoc.data().name); 
        }
      }
    };
   
  const toRoomDoor = () =>{
    navigate('/RoomDoor');

  }

  useEffect(() => {
    fetchUserName();
    autoScroll();  
}, [chats]);

useEffect(() => {
  const roomRef = ref(getDatabase(), `chatRooms/${code}/name`);
  onValue(roomRef, (snapshot) => {
      if (snapshot.exists()) {
          setRoomName(snapshot.val());
      } else {
          setRoomName("Unnamed Room");
      }
  });
}, [code]);

  useEffect(()=>{

      const user = auth.currentUser;
      if (user) {
        const userRef = ref(getDatabase(), `chatRooms/${code}/members/${user.uid}`);
          set(userRef, name); 
        onDisconnect(userRef).remove();
      }
    const newChats = [];
    onChildAdded(chatListRef, (data) => {
      const messageKey = data.key;
      const messageData = data.val();
      if (user && messageData.name !== name) {
        const seenRef = ref(getDatabase(), `chatRooms/${code}/messages/${messageKey}/seenBy`);
        const updatedSeenBy = [...(messageData.seenBy || [])];

        if (!updatedSeenBy.includes(name)) {
          updatedSeenBy.push(name); 
        }
        set(seenRef, updatedSeenBy);
      }
  
      newChats.push({ key: messageKey, ...messageData });
      setChats([...newChats]);
      });

      onValue(chatListRef, (snapshot) => {
      const updatedChats = [];
      snapshot.forEach((childSnapshot) => {
      const msgKey = childSnapshot.key;
      const messageData = childSnapshot.val();

          updatedChats.push({ key: msgKey, ...messageData });
        });
        setChats(updatedChats); 
      }, [name, code]);

      onValue(typingRef, (snapshot) => {
        const typingData = snapshot.val();
        if (typingData) {
          const typingUsers = Object.values(typingData).filter((user) => user !== name);
          setTypingUser(Array.isArray(typingUsers) ? typingUsers : []); 
        } else {
          setTypingUser([]); 
        }
      });
      onValue(membersRef, (snapshot) => {
        if (snapshot.exists()) {
          setMembers(Object.values(snapshot.val())); 
        } else {
          setMembers([]);
        }
      });
  },[name, code])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile); 
    setPreview(selectedFile ? "Image is Selected" : "");
    const imgIconElement = document.getElementById("imgIcon");
     if (imgIconElement) {
     imgIconElement.style.display = "none";
  }
    document.getElementById("unSelect").style.display = "flex";
    document.getElementById("msgIn").style.display = "none";
  };
  const unSelect = () => {
    setFile(null); 
    setPreview(""); 
    document.getElementById("imgIn").value = "";
    document.getElementById("unSelect").style.display = "none";
    document.getElementById("msgIn").style.display = "flex";
  };

  const handleReplyClick = (c) => {
    let rplyTo = c.message;
    setRepliedMessage(rplyTo);  
    setReplyIndicator(`Replying to:  ${rplyTo}`); 
    document.getElementById("cnclRplyBtn").style.display = "flex";  // Cancel button দেখান
  };

  const startRecording = async () => {
    setRecording("Recording...");
    document.getElementById("endRcrd").style.display= "flex";
    document.getElementById("cancelRcrd").style.display= "flex";
    document.getElementById("startRcrd").style.display= "none";
    document.getElementById("msgIn").style.display= "none";
    document.getElementById("send").style.display= "none";
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
  
      mediaRecorder.ondataavailable = (event) => {
        setAudioBlob(event.data);
      };
  
      mediaRecorder.start();
  
      mediaRecorderRef.current = mediaRecorder;
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      mediaRecorderRef.current = null;
      document.getElementById("endRcrd").style.display = "none"; 
      setRecording("Ready To Share");
    }
    document.getElementById("send").style.display= "flex";
  };

  const cancelRecording = () => {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
          mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
          mediaRecorderRef.current = null;
        }
        setRecording("");   
        setAudioBlob(null);  
        
        document.getElementById("endRcrd").style.display = "none"; 
        document.getElementById("cancelRcrd").style.display = "none"; 
        document.getElementById("startRcrd").style.display = "flex";
        document.getElementById("msgIn").style.display = "flex";
      }, i * 100);
    }
  };
  

  const sendChat = () => {
    setRecording("");
    document.getElementById("endRcrd").style.display= "none";
    document.getElementById("msgIn").style.display= "flex";
    document.getElementById("startRcrd").style.display = "flex";
    document.getElementById("cancelRcrd").style.display = "none"; 
    
    if (audioBlob) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Audio = reader.result.split(",")[1]; 
        const audioDbRef = push(chatListRef); 
        set(audioDbRef, { 
          name, 
          audio: base64Audio, 
          message: "Voice Message", 
          seenBy: [] 
        });
      };
      reader.readAsDataURL(audioBlob); 
      setAudioBlob(null); 
      return;
    }

    if (msg.trim() !== "" || file) {
      const chatRef = push(chatListRef);
      let audioURL = null;
    if (file) {
      
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result;
        set(chatRef, {
          name,
          repliedTo: repliedMessage,
          message: msg,
          image: base64Image,
          seenBy: [],
        });
        setFile(null);
      };
      reader.readAsDataURL(file); 
    } else {
      set(chatRef, {
        name,
        repliedTo: repliedMessage,
        message: msg,
        seenBy: [],
      });
    }

    setAudioBlob(null);
    setMsg("");
    setRepliedMessage("");
    setReplyIndicator("");
    document.getElementById("cnclRplyBtn").style.display = "none";
    remove(ref(getDatabase(), `chatRooms/${code}/typing/${name}`));
    if (inputRef.current) inputRef.current.focus();
  }
  setFile(null);
  setPreview("");
  document.getElementById("imgIn").value = "";
  document.getElementById("unSelect").style.display = "none";
  document.getElementById("msgIn").style.display = "flex";

};


    const editMessage = (msgKey, newMessage) => {
      const messageRef = ref(getDatabase(), `chatRooms/${code}/messages/${msgKey}`);
      const messageData = chats.find(chat => chat.key === msgKey);
    
      if (messageData) {
        set(messageRef, { ...messageData, message: newMessage, editable: false });
        setChats(prevChats => prevChats.map(chat => 
          chat.key === msgKey ? { ...chat, message: newMessage, editable: false } : chat
        ));
      }
    };
    const handleTyping = (e) => {
        setMsg(e.target.value);
        if (e.target.value.trim() !== '') {
            set(ref(getDatabase(), `chatRooms/${code}/typing/${name}`), name);
        } else {
            remove(ref(getDatabase(), `chatRooms/${code}/typing/${name}`));
        }
    };

const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    sendChat();
  }
};

const logout = () =>{
  auth.signOut();
  window.location.href = "./Login";
}
const toggleMembers = () => {
  const membersDiv = document.getElementById("membersList");
  if (membersDiv.style.display === "block") {
    membersDiv.style.display = "none";
  } else {
    membersDiv.style.display = "block";
  }
};

const cancelRply = () => {
          setRepliedMessage("");
          setReplyIndicator("");
          document.getElementById("cnclRplyBtn").style.display = "none";
    };

  return (
    <div className='ppp'>
      <div>
        <div className='navbar'>
        <div className='logoBox'><img className='navLogo' src={logo}></img></div>
      <div className='navUser'><b><FontAwesomeIcon icon={faUser} /> {name}</b></div>
      <div className='roomName'><b>{roomName}</b></div>
        <button className='vdoCall'
                onClick={toRoomDoor}>
        <FontAwesomeIcon icon={faVideo} />
        </button>
      
        <button className='bars' id='bars' onClick={barOpen}>
      <FontAwesomeIcon icon={faBars} />
        </button>
        <button className='xMark' id='xmark' onClick={barClose}>
      <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
      <div id='chatCon' className='chat-container'>
       {chats.map((c,i)=> (
       <div key={i} className={`chatContainer ${c.name==name ? 'me':''}`}>
        <div className='msgDtls'>
       <div className='chatbox'
       onMouseOver={() => setHoveredMessage(c)}
       onMouseLeave={() => setHoveredMessage([])}
       >
        
        {c.repliedTo && (
                <div className="reply-text">
                  <FontAwesomeIcon className='rplyIcon' icon={faReply} /> {c.repliedTo}
                </div>
              )}
          <strong>{c.name}:</strong>
          {c.image ? (
        <img src={c.image} alt="Sent" style={{ maxWidth: '200px', borderRadius: '3px' }} />
      ) : (
        <span>{c.message}</span>
      )}
      {c.audio && (
  <div className="audio-container">
    <audio id={`audio-${c.key}`}
           onEnded={()=>{
            document.getElementById(`play-${c.key}`).style.display = "flex";
            document.getElementById(`pause-${c.key}`).style.display = "none";  
           }}>
      <source src={`data:audio/webm;base64,${c.audio}`} type="audio/webm" />
      Your browser does not support the audio element.
    </audio>
    <button id={`play-${c.key}`}
     style={{
        background: "none",
        color: "white",
        border: "none",
        cursor: "pointer"
       }}
      onClick={() => {
        const audioElement = document.getElementById(`audio-${c.key}`);
        if (audioElement) {
          audioElement.play();
          document.getElementById(`play-${c.key}`).style.display = "none";
          document.getElementById(`pause-${c.key}`).style.display = "flex";  
              
        }
      }}
    >
      <FontAwesomeIcon id='playIcon' icon={faPlay} />
    </button>
    <button id={`pause-${c.key}`}
     style={{ display: "none",
              background: "none",
              color: "white",
              border: "none",
              cursor: "pointer"
      }}
      onClick={() => {
        const audioElement = document.getElementById(`audio-${c.key}`);
        if (audioElement) {
          audioElement.pause();
          document.getElementById(`play-${c.key}`).style.display = "flex";
          document.getElementById(`pause-${c.key}`).style.display = "none";
        }
      }}
    >
      <FontAwesomeIcon id='pauseIcon' icon={faPause} />
    </button>
    
  </div>
)}

          {c.name === name && (!c.seenBy || c.seenBy.length === 0) && (
            <button className="editBtn" onClick={() => {
                const newMessage = prompt("Edit your message:", c.message);
                if (newMessage) editMessage(c.key, newMessage);
            }}>
                <FontAwesomeIcon icon={faPenToSquare} />
            </button>
          )}
        
          {hoveredMessage === c && (
                <button id='rply' className='rply'
                onClick={() => handleReplyClick(c)}
                onMouseOver={() => setHoveredMessage(c)}
                 >
                <FontAwesomeIcon icon={faReply} />
                 </button>
              )}
        </div>
        {hoveredMessage === c &&  hoveredMessage.seenBy && (
                <div className='seenBy'>
                  Seen by: {hoveredMessage.seenBy.join(", ")}
                </div>
              )}
              </div>
              
        </div>))}
        <div className='typing-status-container'>
      {Array.isArray(typingUser) && typingUser.map((user, index) => (
    <div key={index} className='typing-status'>{user} is typing...<br></br></div>
  ))}
</div>
        <div className='wtrmrk'><img className='watermark' src={logo}/></div>
        <div className='sideBar' id='sidebar'>
              <div className='barCon' onClick={toggleMembers}>
            <FontAwesomeIcon icon={faUsers} />
               <span></span> Members
              </div>
              <div id="membersList" style={{ display: 'none'}}>
              <div className='cmHead'>Current Members:</div>
              {members.map((member, index) => (
                <div className='membersNm' key={index}>{member}</div>
              ))}
            </div>
              <div className='barCon'
               onClick={logout}>
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
              <span></span> Logout
              </div>
        </div>
      </div>
      <div className='bottom'>
        <div className='replyIndicator'>
          {replyIndicator}
          <button id='cnclRplyBtn'
                  onClick={cancelRply}>
          <FontAwesomeIcon id='cancelRply' icon={faXmark} />
          </button>
        </div>
        <div className='msgOptns'>
        <div className='imgSharing'>
         <input 
            type="file"
            name="imgIn"
            id="imgIn"
            accept="image/*"
            onChange={handleFileChange}
          />
           <label htmlFor="imgIn" className="imgIcon">
          <FontAwesomeIcon icon={faImage} />
          </label>
          <div className='audioRecording'>
              <button id='startRcrd' onClick={startRecording}>
              <FontAwesomeIcon icon={faMicrophone} />
              </button>
              <button id='cancelRcrd' onClick={cancelRecording}>
              <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          <div className="preview">{preview}
        <button id="unSelect" onClick={unSelect}><FontAwesomeIcon icon={faXmark} /></button>
        </div>
        <div id='recording'>{recording}
        <button id="endRcrd" onClick={stopRecording}><FontAwesomeIcon icon={faCheck} /></button>
        </div>
          </div>
        <input type='text'
               value={msg}
               id='msgIn'
               onInput={handleTyping}
               onKeyDown={handleKeyDown}>
        </input>
        <button className='send' id='send'
                onClick={e=>sendChat()}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
      </div>
      </div>
    </div>
  )
}

export default Chat;
