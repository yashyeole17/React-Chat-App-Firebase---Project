import React, { useEffect } from 'react';
import './App.css';
import Details from './components/details/Details';
import List from './components/list/List';
import Chat from './components/chat/Chat';
import Login from './components/login/Login';
import Notification from "./components/notification/Notification";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "./lib/firebase"; 
import { useUserStore } from "./lib/userStore";
import { useChatStore } from './lib/chatStore';

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      //console.log("Auth state changed. User:", user);
      fetchUserInfo(user?.uid);
    });
    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  //console.log("currentUser:", currentUser);
  //console.log("isLoading:", isLoading);

  if (isLoading) return <div className='loading'>Loading...</div>;

  return (
    <div className="container">
      {currentUser !== null ? ( // Handle null user here
        <>
          <List />
          { chatId &&  <Chat /> }
          { chatId &&  <Details /> }
        </>
      ) : (
        <Login />
      )}
      <Notification />
    </div>
  );
};

export default App;
