import { useRouter } from "next/router";
import { useRef, useEffect, useState } from "react";
import s from "@/styles/index.module.scss";

const Login = () => {
    const inputRef = useRef();
    const [error, setError] = useState("");
    const { push } = useRouter();

    console.log(inputRef);

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
            return <h2>error</h2>;
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
        <div>
            <h1 className={`${getClassname()}`}>Login</h1>
            <p>enter username</p>
            <input
                ref={inputRef}
                type="text"
                placeholder="aefjaoefh"
                onKeyDown={onKeyDown}
            />
            {displayError()}
        </div>
    );
};

export default Login;
