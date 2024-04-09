import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import profile from "../images/Profile.jpg";
import close from "../images/CloseMenu.jpg";
import open from "../images/OpenMenu.jpg";
import '../styles/KastomCheckBox.css';
import axios from "axios";
import Vhod from "./Vhod";
import ServHost from "../serverHost.json"

interface MyForm {
    mail: string;
    pass: string;
}


function HamburgerMenu(){

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

    const sendDataToServerCheckUser = async (data:{ mail: string, pass: string }) => {
        try {
            const res = await axios.post(ServHost.host + '/checkUser', data);
            if(res.data.res){
                setLoginProfile(
                    <div className="rightHeader">
                        <img src={profile} alt="profile" className="imgVH"/>
                        <Link to={"/profile"} className='linkHeader'>Профиль</Link>
                        <button className='linkHeader Comissioner btnCont' onClick={() => {
                            window.localStorage.removeItem('Login')
                            window.location.reload()
                        }}>Выйти</button>
                    </div>
                )
            }
        } catch (error) {
            console.error(error);
        }
    };

    const [loginProfile, setLoginProfile] = useState(() => {
        const initialState = function () {
            let a = window.localStorage.getItem('Login')
            if(a){
                sendDataToServerCheckUser({ mail: a.split(" ")[0], pass: a.split(" ")[1] })
            }
            return (
                <div className="UprLeft">
                    <img src={profile} alt="profile" className="imgVH"/>
                    <Link to={"/login"} className='linkHeader'>Войти</Link>
                    <Link to={"/reg"} className='linkHeader'>Регистрация</Link>
                </div>
            )
        }
        return initialState()
    })

    return (
        <div ref={elementRef}>
            <button onClick={handleButtonClick} className="btnHamburger">
                <div className='linkHeader'>
                    <img src={open} alt="openmenu" className="imgBurger"/>
                </div>
            </button>
            <div className="formHamburger" hidden={!isElementVisible}>
                <div className="absformHamburger">
                    <div className="UprHamburger">
                        <div className="UprRight">
                            <button onClick={handleButtonClick} className="btnHamburger">
                                <div className='linkHeader'>
                                    <img src={close} alt="closemenu" className="imgBurger"/>
                                </div>
                            </button>
                        </div>
                        {loginProfile}
                    </div>
                    <div className="HamburgerCont">
                        <Link to={"/buy"} className='linkHeader linkHumburger'>Купить</Link>
                        <Link to={"/opt"} className='linkHeader linkHumburger'>Оптовые цены</Link>
                        <Link to={"/faq"} className='linkHeader linkHumburger'>Частые вопросы</Link>
                        <Link to={"/shipment"} className='linkHeader linkHumburger'>Условия работы</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HamburgerMenu;