import './Details.css'
import Avatar from "../../assets/avatar.png";
import ArrowUp from "../../assets/arrowUp.png";
import ArrowDown from "../../assets/arrowDown.png";
import Download from "../../assets/download.png";
import ExtraImg from "../../assets/1.jpeg";
import { auth, db } from '../../lib/firebase';
import { useChatStore } from '../../lib/chatStore';
import { useUserStore } from '../../lib/userStore';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';

const Details = () => {

    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();
    const { currentUser } = useUserStore();

    const handleBlock = async () => {
        if(! user) return;

        const userDocRef = doc(db, "users", currentUser.id); 

        try{
            await updateDoc(userDocRef, {
                blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
            });

            changeBlock();

        }catch(err){
            console.log(err);
        }
    }

    return(
        <div className="detail">
            <div className='user'>
                <img src={ user?.avatar || Avatar } alt="Avatar" />
                <h2>{ user?.username }</h2>
                <p>AAAAAAAAAAAAAAAAA</p>
            </div>
        
            <div className='info'>
                <div className='option'>
                    <div className='title'>
                        <span>Chat Settings</span>
                        <img src={ArrowUp} alt="ArrowUp" />
                    </div>
                </div>

                <div className='option'>
                    <div className='title'>
                        <span>Chat Settings</span>
                        <img src={ArrowUp} alt="ArrowUp" />
                    </div>
                </div>

                <div className='option'>
                    <div className='title'>
                        <span>Privacy & help</span>
                        <img src={ArrowUp} alt="ArrowUp" />
                    </div>
                </div>

                <div className='option'>
                    <div className='title'>
                        <span>Shared Photos</span>
                        <img src={ArrowDown} alt="ArrowDown" />
                    </div>

                    <div className='photos'>
                        <div className='photoItem'>
                            <div className='photoDetail'>
                                <img src={ExtraImg} alt="ExtraImg" /> 
                                <span>photo_2024_2.png</span>
                            </div>
                            <img src={Download} alt="Download" className='icon'/>
                        </div>
                    </div>
                    <div className='photos'>
                        <div className='photoItem'>
                            <div className='photoDetail'>
                                <img src={ExtraImg} alt="ExtraImg" /> 
                                <span>photo_2024_2.png</span>
                            </div>
                            <img src={Download} alt="Download" className='icon'/>
                        </div>
                    </div>

                </div>

                <div className='option'>
                    <div className='title'>
                        <span>Shared Files</span>
                        <img src={ArrowUp} alt="ArrowUp" />
                    </div>
                </div>
            </div>

            <div className='buttons'>  
                <button className='button1' onClick={ handleBlock}> 
                    {   isCurrentUserBlocked
                        ? "You are blocked!"
                        : isReceiverBlocked
                        ? "Unblocked user"
                        : "Block user"
                    }

                </button>
                <button className='button2' onClick={() => auth.signOut() }> Logout </button>
            </div>
        </div>
    );
}
export default Details;