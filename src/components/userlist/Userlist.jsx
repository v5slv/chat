import { useEffect, useRef } from "react";
import s from "./Userlist.module.scss";
import User from "../user/User";
import { gsap } from "gsap";

const UserList = ({ users, setUsers, selectedUser, setSelectedUser }) => {
    const listRef = useRef();

    useEffect(() => {
        gsap.to(listRef.current.children, {
            opacity: 1,
            duration: 0.5,
            x: 0,
            stagger: 0.1,
        });
    }, [users]);

    const resetNotification = (user) => {
        const _users = [...users];
        const index = _users.findIndex((u) => u.userID === user.userID);
        _users[index].hasNewMessages = false;
        setUsers(_users);
    };

    return (
        <div className={s.userlist} ref={listRef}>
            <div
                className={`${s.user} ${selectedUser ? "" : s.user__active}`}
                onClick={() => setSelectedUser(null)}
            >
                <span className={s.general}>General</span>
            </div>

            {users.map((user, index) => {
                return user.connected === true ? (
                    <User
                        index={index}
                        key={user.userID}
                        user={user}
                        selectedUser={selectedUser}
                        setSelectedUser={setSelectedUser}
                        resetNotification={resetNotification}
                    />
                ) : null;
            })}
        </div>
    );
};

export default UserList;
