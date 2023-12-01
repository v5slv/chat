import { useRouter } from "next/router";
import { useRef, useEffect, useState } from "react";
import s from "@/styles/login.module.scss";

const Login = () => {
    const inputRef = useRef();
    const [error, setError] = useState("");
    const { push } = useRouter();

    const onKeyDown = (e) => {
        if (e.keyCode === 13) {
            console.log(inputRef.current.value);
            localStorage.setItem("username", inputRef.current.value);
            inputRef.current.value = "";
            push("/");
        }
    };

    useEffect(() => {
        console.log(typeof localStorage.getItem("error"));
        if (localStorage.getItem("error") == 200) {
            console.log("error is present");
            setError("Server is down atm");
        }
    }, []);

    const displayError = () => {
        if (error !== "") {
            console.log("! error : ", error);
            return <div className={s.error}>error</div>;
        }
    };

    const getClassname = () => {
        let finalClassname = `${s.title}`;
        if (error !== "") {
            return (finalClassname += ` ${s.error}`);
        } else {
            return finalClassname;
        }
    };

    return (
        <div className={s.login}>
            <div className={s.intro}>
                <h1 className={`${getClassname()}`}>Login</h1>
                <p>who are u?!</p>
            </div>

            <img className={s.img} src="/img/tea.gif" alt="" />

            <input
                ref={inputRef}
                type="text"
                placeholder="tutututu"
                onKeyDown={onKeyDown}
            />

            {displayError()}
        </div>
    );
};

export default Login;
