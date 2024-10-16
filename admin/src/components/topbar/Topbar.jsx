import React, { useState, useEffect, useRef } from 'react';
import "./topbar.css";
import { useDispatch, useSelector } from 'react-redux';
import { Language, Settings } from '@mui/icons-material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CloseIcon from '@mui/icons-material/Close';
import { removeNotification } from '../../redux/userRedux';
import { logout } from '../../redux/userRedux'; // Import the logout action
import { useNavigate } from 'react-router-dom'; // To redirect after logout

const Topbar = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);
    const notifications = useSelector((state) => state.notifications.list);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const notificationRef = useRef(null);
    const navigate = useNavigate(); // Initialize navigate

    // Toggle notification dropdown
    const toggleNotifications = () => {
        setIsNotificationOpen(!isNotificationOpen);
    };

    // Handle click outside to close the notification dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Delete a notification
    const handleDeleteNotification = (index) => {
        dispatch(removeNotification(index));
    };

    // Logout function
    const handleLogout = () => {
        dispatch(logout()); // Dispatch logout action
        localStorage.removeItem("persist:root"); // Clear local storage
        navigate("/login"); // Redirect to login page
    };

    return (
        <div className='topbar'>
            <div className='topbarWrapper'>
                <div className='topLeft'>
                    <span className="logo">Goku Admin</span>
                </div>
                <div className='topRight'>
                    <div className="topbarIconContainer" ref={notificationRef}>
                        <NotificationsNoneIcon onClick={toggleNotifications} />
                        <span className="topIconBadge">{notifications.length}</span>
                        {isNotificationOpen && (
                            <div className="notificationDropdown">
                                {notifications.length > 0 ? (
                                    notifications.map((notif, index) => (
                                        <div key={index} className="notificationItem">
                                            <span>{notif.message}</span>
                                            <CloseIcon 
                                                className="deleteIcon"
                                                onClick={() => handleDeleteNotification(index)}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="notificationItem">No new notifications</div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="topbarIconContainer">
                        <Language />
                        <span className="topIconBadge">2</span>
                    </div>
                    <div className="topbarIconContainer">
                        <Settings />
                    </div>
                    <img
                        src={currentUser?.avatar || "default-avatar-url.jpg"}
                        alt="Avatar"
                        className="topAvatar"
                        onClick={handleLogout} // Logout when avatar is clicked
                    />
                </div>
            </div>
        </div>
    );
};

export default Topbar;
