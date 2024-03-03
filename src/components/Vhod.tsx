import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";


function Vhod(){

    const [isElementVisible, setElementVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (elementRef.current && !elementRef.current.contains(event.target as Node | null)) {
            setElementVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleButtonClick = () => {
        setElementVisible(!isElementVisible);
    };

    return(
        <div ref={elementRef}>
            <button onClick={handleButtonClick} id="btnVh">
                Вход
            </button>
            <div className="formVhod" id="formVh" hidden={!isElementVisible}>
                <div className="absformVhod">
                    <label>ВХОД НА САЙТ</label>
                    <input type="text" placeholder="E-mail"/>
                    <input type="text" placeholder="Пароль"/>
                    <div>
                        <button>ВОЙТИ</button>
                        Забыли пароль?
                    </div>
                    <input type="checkbox"/>
                    <label>Чужой компьютер</label>
                    <Link to={'/reg'}>Регистрация</Link>
                </div>
            </div>
        </div>
    );
}

export default Vhod;