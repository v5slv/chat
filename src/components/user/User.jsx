import s from "./User.module.scss";
import { useEffect, useRef } from "react";

const User = ({
    index,
    user,
    selectedUser,
    setSelectedUser,
    resetNotification,
}) => {
    return (
        <div
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
