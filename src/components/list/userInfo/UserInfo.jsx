import React from 'react';
import "./UserInfo.css"
import Avatar from "../../../assets/avatar.png";
import More from "../../../assets/more.png";
import Video from "../../../assets/video.png";
import Edit from "../../../assets/edit.png";
import { useUserStore } from '../../../lib/userStore';

const UserInfo = () => {

  const { currentUser } = useUserStore();

  return (
    <div className='userInfo'>
      <div className='user'>
            <img src={currentUser.avatar ||  Avatar} alt="Avatar"/>
            <h4> { currentUser.username } </h4>
      </div>
      <div className='icons'>
        <img src={More} alt="More"/>
        <img src={Video} alt="Video"/>
        <img src={Edit} alt="Edit"/>
      </div>
    </div>
  );
}

export default UserInfo;
