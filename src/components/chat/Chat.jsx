import React, { useEffect, useState, useRef } from 'react';
import './Chat.css'
import { Button } from 'react-bootstrap'
import EmojiPicker from 'emoji-picker-react'
import Avatar from "../../assets/avatar.png";
import Video from "../../assets/video.png";
import Phone from "../../assets/phone.png";
import Info from "../../assets/info.png";

import Image1 from "../../assets/img.png";
import Camera from "../../assets/camera.png";
import Mice from "../../assets/info.png";
import Emoji from "../../assets/emoji.png";
//import ExtraImg from "../../assets/1.jpeg";
import { doc, getDoc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useChatStore } from '../../lib/chatStore';
import { useUserStore } from '../../lib/userStore';
import { create } from 'zustand';
import upload from '../../lib/upload';

const Chat = () => {
    const [ chat, setChat ] = useState();
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [img, setImg] = useState({
        file: null,
        url: "",
    });

    const { currentUser } = useUserStore();
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();

    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    },[]);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            setChat(res.data());
        });

        return () => {
            unSub();
        };
    }, [chatId] );

    //console.log(chat);

    const handleEmoji = (e) => {
        setText((prev) => prev + e.emoji);
        setOpen(false);
    }
    /*
    const handleImg = (e) => {
        if (e.target.files[0]) {
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            });
        }
    };
    */
    const handleImg = (e) => {
        if (e.target.files[0]) {
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            });
        }
    };
    

    const handleSend = async () => {
        if (!text) return;

        let imgUrl = null;
      
        try {

            if(img.file) {
                imgUrl = await upload(img.file);
            }

            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createAt: new Date(),
                    ...(imgUrl && { img: imgUrl }),
                }),
            });
      
            const userIDs = [currentUser.id, user.id];
      
            for (const id of userIDs) {
                const userChatsRef = doc(db, "userchats", id);
                const userChatsSnapshot = await getDoc(userChatsRef);
      
                if (userChatsSnapshot.exists()) {
                const userChatsData = userChatsSnapshot.data();
      
                    if (!userChatsData.chats) {
                        userChatsData.chats = [];
                    }
        
                    const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === chatId);
        
                    if (chatIndex !== -1) {
                        userChatsData.chats[chatIndex].lastMessage = text;
                        userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
                        userChatsData.chats[chatIndex].updatedAt = Date.now();
                    } else {
                        userChatsData.chats.push({
                        chatId: chatId,
                        messages: text,
                        isSeen: id === currentUser.id ? true : false,
                        updatedAt: Date.now(),
                        });
                    }
        
                    await updateDoc(userChatsRef, {
                        chats: userChatsData.chats,
                    });
                }
            }

            setImg({
                file: null,
                url: "",
            })
            setText("");

        } catch (err) {
            console.log(err);
        }
    }

    return(
        <>
            <div className="chat">
                <div className='top'>
                    <div className='user'>
                        <img src={ user?.avatar || Avatar } alt="Avatar"/>
                        <div className='texts'>
                            <span>{ user?.username }</span>
                            <p>Welcome to Chat app</p>
                        </div>
                    </div>
                    <div className='icons'>
                        <img src={ Phone } alt="Phone"/>
                        <img src={ Video } alt="Video"/>
                        <img src={ Info } alt="Info"/>
                    </div>
                </div>

                <div className='center'>
                    { chat?.messages?.map((messages) => (
                        <div className={ messages.senderId === currentUser?.id ? 'message_own' : 'message'} key={ messages.createAt }>
                            
                            <div className='texts'>
                                { messages.img && <img src={ messages.img } alt=""/> }
                                <p>{ messages.text }</p>
                            </div>
                        </div>
                    ))}
                
                    {img.url && (
                        <div className='message_own'>
                            <div className='texts'>
                                <img src={ img.url } alt="" />
                            </div>
                        </div>
                    )}
                    
                    <div ref={ endRef }></div>
                </div>
                <div className='bottom'>
                    <div className='icons'>
                        <label htmlFor='file'>
                            <img src={ Image1 } alt="Image1"/>
                        </label>

                        <input type="file" id="file"  style={{ display: "none"}} onChange={ handleImg }/>
                        <img src={ Camera } alt="Camera"/>
                        <img src={ Mice } alt="Mice"/>
                    </div>
                    <input 
                        type="text" 
                        placeholder={
                            isCurrentUserBlocked || isReceiverBlocked
                            ? "You can't send a message"
                            : "Type a message.." 
                        }  
                        value={ text }
                        onChange={(e) => setText(e.target.value)}
                        disabled={ isCurrentUserBlocked || isReceiverBlocked }
                    />
                    <div className='emoji'>
                        <img 
                            src={ Emoji } 
                            onClick={() => setOpen((prev) => !prev)}
                            alt="Emoji" 
                        />
                        <div className='picker'>
                            <EmojiPicker open={open} onEmojiClick={ handleEmoji }/>
                        </div>   
                    </div>

                    <Button 
                        className="sendButton" 
                        onClick={ handleSend } 
                        disabled={ isCurrentUserBlocked || isReceiverBlocked }>
                        Send
                    </Button>
                </div>
            </div>
        </>
    )
}
export default Chat;