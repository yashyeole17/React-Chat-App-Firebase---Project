import React, { useEffect, useState } from 'react';
import "./ChatList.css";
import Search from '../../../assets/search.png';
import Plus from '../../../assets/plus.png';
import Minus from '../../../assets/minus.png';
import Avatar from "../../../assets/avatar.png";
import AddUser from './addUser/AddUser';
import { useUserStore } from '../../../lib/userStore';
import { onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useChatStore } from '../../../lib/chatStore';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");
  
  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  useEffect(() => {
    if (!currentUser || !currentUser.id) return;

    const fetchChats = async () => {
      const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
        const items = res.data()?.chats || [];

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();

          return { ...item, user };
        });

        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      });

      return () => {
        unSub();
      };
    };

    fetchChats();
  }, [currentUser]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });
  
    const chatIndex = userChats.findIndex((item) => item.chatId === chat.chatId);
  
    if (chatIndex !== -1) {
      userChats[chatIndex].isSeen = true;
  
      const userChatsRef = doc(db, "userchats", currentUser.id);
  
      try {
        await updateDoc(userChatsRef, {
          chats: userChats,
        });
        changeChat(chat.chatId, chat.user);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const filteredChats = chats.filter((c) => 
    c.user.username.toLowerCase().includes(input.toLowerCase())
  )

  return (
    <div className='chatList'>
      <div className='search'>
        <div className='searchBar'>
          <img src={Search} alt="Search" />
          <input type="text" placeholder='Search' onChange={ (e) => setInput(e.target.value) }/>
        </div>

        <img
          src={addMode ? Minus : Plus}
          alt="Plus-minus"
          className='add'
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>

      {filteredChats.map((chat) => (
        <div 
          className='item' 
          key={chat.chatId} 
          onClick={() => handleSelect(chat)}
          style={{ backgroundColor: chat?.isSeen ? "transparent": "#5183fe", }} 
        >
        <img src=
          { chat.user.blocked.includes(currentUser.id)
            ? Avatar 
            : chat.user.avatar || Avatar
          } 
          alt="Avatar" />
        <div className='texts'>
            <span>
              { chat.user.blocked.includes(currentUser.id)
                ? "User"
                : chat.user.username
              }
            </span>
            <p>{ chat.lastMessage }</p>
          </div>
        </div>
      ))}

      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
