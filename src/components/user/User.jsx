import s from "./User.module.scss";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const User = ({ user, selectedUser, setSelectedUser, resetNotification }) => {
    const userRef = useRef();

    useEffect(() => {
        gsap.to(userRef.current, {
            opacity: 1,
            x: 0,
            duration: 0.5,
        });
    }, []);

    return (
        <div
            ref={userRef}
            className={`${s.user} ${
                selectedUser?.userID === user.userID ? s.user__active : ""
            }`}
            onClick={() => {
                setSelectedUser(user);
                resetNotification(user);
            }}
        >
            <span>{user.username}</span>

            {user.hasNewMessages === true ? (
                <div className={s.notif}></div>
            ) : null}
        </div>
    );
};

export default User;
