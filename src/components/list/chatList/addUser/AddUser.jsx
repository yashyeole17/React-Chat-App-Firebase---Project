import React, { useState } from 'react';
import "./AddUser.css";
import Avatar from "../../../../assets/avatar.png";
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { useUserStore } from '../../../../lib/userStore';

const AddUser = () => {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapshot = await getDocs(q); 

      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data());
        setErrorMessage(""); 
      } else {
        setUser(null);
        setErrorMessage("User not found"); 
      }
    } catch (err) {
      console.log("Error fetching user data: ", err);
      setErrorMessage("Error fetching user data"); 
    }
  }

  const handleAddUser = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");
  
    try {
      const newChatRef = doc(chatRef);
      
      await setDoc(newChatRef, {
        createAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        })
      });

      await updateDoc(doc(userChatsRef, currentUser.id), {
          chats: arrayUnion({
            chatId: newChatRef.id,
            lastMessage: "",
            receiverId: user.id,
            updatedAt: Date.now(),
          })
        });

    } catch (err) {
      console.log(err);
    }
  }  

  return (
    <div className='addUser'>
      <form onSubmit={handleSearch}>
        <input type="text" placeholder='Username' name="username" />
        <button type="submit">Search</button>
      </form>
      {user && (
        <div className='user'>
          <div className='detail'>
            <img src={user.avatar || Avatar} alt="Avatar" />
            <span>{user.username}</span>
          </div>
          <button onClick={ handleAddUser }>Add User</button>
        </div>
      )}
      {!user && errorMessage && (
        <p className="error">{ errorMessage }</p>
      )}
    </div>
  );
}

export default AddUser;
