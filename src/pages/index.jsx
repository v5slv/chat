"use client"; // spécifie à next que c'est des composants côté client
import { useEffect, useState, useRef } from "react";
import { socket } from "@/utils/socket";
import { useRouter } from "next/router";
import Input from "@/components/input/Input";
import Commands from "@/components/commands/Commands";
import Notification from "@/components/notification/Notification";
import Userlist from "@/components/userlist/Userlist";
import Message from "@/components/message/Message";
import s from "@/styles/index.module.scss";

const Home = () => {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState();
    const viewerRef = useRef();
    const { push } = useRouter();

    const onSession = ({ sessionID, userID }) => {
        // attach the session ID to the next reconnection attempts
        socket.auth = { sessionID };
        // store it in the localStorage
        localStorage.setItem("sessionID", sessionID);
        // save the ID of the user
        socket.userID = userID;
        localStorage.clear("error");
    };

    const onMessage = (message) => {
        console.log("message received", message);
        // ❌ la variable message n'est pas un tableau
        // setMessages(message);

        // ❌ mutation qui ne trigger pas un re-render de votre app
        // messages.push(message);

        // explication sur les mutations vs la création de nouvelles variables
        // const temporaryMessages = [...messages];
        // temporaryMessages.push(message);
        // setMessages(temporaryMessages);

        // syntaxe plus courte pour la création d'une nouvelle variable
        setMessages((oldMessages) => [...oldMessages, message]);
    };

    const getMessagesAtInit = (messagesAtInit) => {
        // get messages when you connect to the server
        setMessages(messagesAtInit);
        scrollToBottom();
    };

    const getUsersAtInit = (_users) => {
        console.log("get users at init", _users);
        setUsers(_users);
    };

    const scrollToBottom = () => {
        viewerRef.current.scrollTop = viewerRef.current.scrollHeight;
    };

    const onUserConnect = (_user) => {
        const existingUser = users.find((user) => user.userID === _user.userID);

        if (existingUser) {
            return;
        }

        setUsers((currentUsers) => [...currentUsers, _user]);
    };

    const onUserDisconnect = (_userID) => {
        const filteredArray = [...users].filter((_user) =>
            _user.userID !== _userID ? true : false
        );
        console.log(filteredArray);
        setUsers(filteredArray);
    };

    const onConnectionError = (err) => {
        console.log("err", err);
        localStorage.clear("username");
        localStorage.clear("sessionID");
        localStorage.setItem("error", 200);
        push("/login");
    };

    const onError = ({ code, error }) => {
        console.log(code, error);

        let title = "";
        let content = "";

        switch (code) {
            case 100:
                title = `Erreur ${code} : Spam`;
                content = "Arete de spam";
                break;

            default:
                break;
        }

        setError({
            title,
            content,
        });
    };

    const onPrivateMessage = ({ content, from, to, username }) => {
        console.log(content, from, to, username);
        // check from which user the message came from
        const userMessagingIndex = users.findIndex(
            (_user) => _user.userID === from
        );

        console.log(userMessagingIndex);

        const userMessaging = users.find((_user) => _user.userID === from);

        console.log(userMessaging);

        if (!userMessaging) return;

        userMessaging.messages.push({
            content,
            from,
            to,
            username: username,
        });

        // affiche notif si l'utilisateur n'est pas sur la page de l'utilisateur qui lui envoie un message
        if (userMessaging.userID !== selectedUser?.userID) {
            userMessaging.hasNewMessages = true;
        }

        const _users = [...users];
        _users[userMessagingIndex] = userMessaging;

        setUsers(_users);
    };

    useEffect(() => {
        // console.log(users);
        socket.on("private message", onPrivateMessage);
        socket.on("user connected", onUserConnect);
        socket.on("user disconnected", onUserDisconnect);
        return () => {
            socket.off("private message", onPrivateMessage);
            socket.off("user connected", onUserConnect);
            socket.off("user disconnected", onUserDisconnect);
        };
    }, [users]);

    useEffect(() => {
        const sessionID = localStorage.getItem("sessionID");

        // session is already defined
        if (sessionID) {
            socket.auth = { sessionID };
            socket.connect();
            // first time connecting and has already visited login page
        } else if (localStorage.getItem("username")) {
            const username = localStorage.getItem("username");
            socket.auth = { username };
            socket.connect();
            // redirect to login page
        } else {
            push("/login");
        }

        socket.on("error", onError);
        socket.on("session", onSession);
        socket.on("message", onMessage);
        socket.on("messages", getMessagesAtInit);
        socket.on("users", getUsersAtInit);
        socket.on("disconnect", onConnectionError);
        socket.on("connect_error", onConnectionError);

        return () => {
            socket.disconnect();
            socket.off("error", onError);
            socket.off("session", onSession);
            socket.off("message", onMessage);
            socket.off("messages", getMessagesAtInit);
            socket.off("users", getUsersAtInit);
            socket.off("disconnect", onConnectionError);
            socket.off("connect_error", onConnectionError);
            socket.off("user connected", onUserConnect);
            socket.off("user disconnected", onUserDisconnect);
            socket.disconnect();
        };
    }, []);

    // à chaque fois qu'il y a un changement dans messages ou l'util sélectionné, ça va trigger le useEffect qui trigger le scroll to bottom
    useEffect(() => {
        scrollToBottom();
    }, [messages, selectedUser]);

    // useEffect(() => {
    //     console.log(selectedUser);
    // }, [selectedUser]);

    return (
        <div className={s.page}>
            <Userlist
                users={users}
                setUsers={setUsers}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
            />

            {error && (
                <Notification
                    title={error.title}
                    content={error.content}
                    onClose={() => setError(null)}
                />
            )}

            <div className={s.chat}>
                <div className={s.messages} ref={viewerRef}>
                    {selectedUser
                        ? selectedUser.messages.map((message, key) => (
                              <Message
                                  key={key}
                                  username={message.username}
                                  content={message.content}
                                  fromSelf={message.from === socket.userID}
                              />
                          ))
                        : messages.map((message, key) => (
                              <Message
                                  key={key}
                                  username={message.username}
                                  content={message.content}
                                  fromSelf={message.from === socket.userID}
                              />
                          ))}
                </div>

                <Input
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                />
                <Commands />
            </div>
        </div>
    );
};

export default Home;
