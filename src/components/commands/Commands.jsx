import { useEffect, useState } from "react";
import { socket } from "@/utils/socket";
import s from "./Commands.module.scss";

const Commands = () => {
    const [sounds, setSounds] = useState({});

    useEffect(() => {
        setSounds({
            meow: new Audio("/sounds/meow.mp3"),
            piano: new Audio("/sounds/piano.mp3"),
            chef: new Audio("/sounds/chef.mp3"),
        });
    }, []);

    useEffect(() => {
        const onCommand = (command) => {
            switch (command) {
                case "/chef":
                    sounds.chef.currentTime = 0;
                    sounds.chef.play();
                    break;

                case "/meow":
                    sounds.meow.currentTime = 0;
                    sounds.meow.play();
                    break;

                case "/yes!":
                    sounds.piano.currentTime = 0;
                    sounds.piano.play();
                    break;

                default:
                    break;
            }
        };

        socket.on("command", onCommand);

        return () => {
            socket.off("command", onCommand);
        };
    }, [sounds]);

    return <div className={s.commands}></div>;
};

export default Commands;
