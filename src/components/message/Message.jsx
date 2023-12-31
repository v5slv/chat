import s from "./Message.module.scss";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Message = ({ content, username, fromSelf }) => {
    const messageRef = useRef();

    useEffect(() => {
        gsap.to(messageRef.current, {
            opacity: 1,
            x: 0,
        });
    }, []);

    return (
        <div
            ref={messageRef}
            className={`${s.message} ${fromSelf ? s.message__self : ""}`}
        >
            <div className={s.message__username}>{username}</div>
            <div className={s.message__content}>{content}</div>
        </div>
    );
};

export default Message;
