import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import profile from "../images/Profile.png";
import close from "../images/CloseMenu.png";
import open from "../images/OpenMenu.png";
import '../styles/KastomCheckBox.css';

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

    return(
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
                        <div className="UprLeft">
                            <img src={profile} alt="profile" className="imgVH"/>
                            <Link to={"/login"} className='linkHeader'>Войти</Link>
                            <Link to={"/reg"} className='linkHeader'>Регистрация</Link>
                        </div>
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