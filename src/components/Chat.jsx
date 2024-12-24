import { useState, useEffect, useRef } from 'react'
import logo from './images/logo.png';
import './Chat.css'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faVideo, faArrowRightFromBracket, faBars, faUsers, faUser, faXmark} from '@fortawesome/free-solid-svg-icons';
import { getDatabase, push, ref, set, onChildAdded, onValue, remove, onDisconnect } from "firebase/database";
import { auth, db } from './Firebase'; 
import { doc, getDoc } from "firebase/firestore"; 

const Chat= () => {
  const { code } = useParams();
  const [name, setName] = useState("");
  const [chats, setChats] = useState([]);
  const [msg, setMsg] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const inputRef = useRef(null);
  const [members, setMembers] = useState([]);
  const [roomName, setRoomName] = useState("");
  const chatListRef = ref(getDatabase(), `chatRooms/${code}/messages`);
  const typingRef = ref(getDatabase(), `chatRooms/${code}/typing`);
  const membersRef = ref(getDatabase(), `chatRooms/${code}/members`);

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
      newChats.push(data.val());
      setChats([...newChats]);
      });

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

  const sendChat = () => {
        if (msg.trim() !== '') {
            const chatRef = push(chatListRef);
            set(chatRef, { name, message: msg });
            setMsg('');
            remove(ref(getDatabase(), `chatRooms/${code}/typing/${name}`));
            if (inputRef.current) inputRef.current.focus();
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
        <p className='chatbox'>
          <strong>{c.name}:</strong><br></br>
          <span>{c.message}</span>
        </p>
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
        <input type='text'
               value={msg}
               ref={inputRef}
               onInput={handleTyping}
               onKeyDown={handleKeyDown}>
        </input>
        <button className='send'
                onClick={e=>sendChat()}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>

      </div>
    </div>
  )
}

export default Chat;
