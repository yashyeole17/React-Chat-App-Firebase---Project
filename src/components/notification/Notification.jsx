import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

const Notification = () => {
    return (
        <div className="">
            <ToastContainer position = "botton-center" autoClose={2000} />
        </div>
    )
}
export default Notification;

/*

const Notification = () => {
    return (
        <div className="">
            <ToastContainer 
                position="bottom-center" 
                autoClose={6000} // 10 seconds
                hideProgressBar={false} 
                newestOnTop={false} 
                closeOnClick 
                rtl={false} 
                pauseOnFocusLoss 
                draggable 
                pauseOnHover
            />
        </div>
    );
}

export default Notification;
*/