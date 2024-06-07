import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import profile from "../images/Profile.jpg";
import close from "../images/CloseMenu.jpg";
import open from "../images/OpenMenu.jpg";
import '../styles/KastomCheckBox.css';
import axios from "axios";
import Vhod from "./Vhod";
import ServHost from "../serverHost.json"
import { useAuth } from '../components/navigation/AuthContext';

interface MyForm {
    mail: string;
    pass: string;
}
interface BasketData {
    basket: string;
}

function HamburgerMenu(){

    const [isElementVisible, setElementVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);
    const { logout } = useAuth(); 

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

    const sendDataToServer = async (data: BasketData | null = null) => {
        try {
            if (data === null) {
                data = { basket: window.localStorage.getItem('basket') || "" };
            }
            const res = await axios.post(ServHost.host + '/countBasket', data);
            const { basket, count } = res.data;
            window.localStorage.setItem('basket', basket);
            window.localStorage.setItem('backCount', count);
        } catch (error) {
            //console.error(error);
        }
    };
    

    const UpdateCount = () => {
        let count = 0;
        let a = window.localStorage.getItem('basket');
        if (a && a !== "0" && a !== "" && a !== null) {
            let arr = a.split(",");
            let validItems = [];
            for (let i = 0; i < arr.length; i++) {
                let parts = arr[i].split(":");
                if (parts.length === 2 && parseInt(parts[0]) > 0 && parseInt(parts[1]) > 0) {
                    validItems.push(arr[i]);
                    count += parseInt(parts[1]);
                }
            }
            window.localStorage.setItem('basket', validItems.join(","));
        } else if (a === "0") {
            window.localStorage.setItem('basket', "");
            window.localStorage.setItem('backCount', "0");
        }
        return count;
    };
    const logoutUser = async () => {
        try {
            const refreshToken = window.localStorage.getItem('refreshToken');
            if (!refreshToken) {
                console.error('Отсутствует refreshToken в локальном хранилище');
                return;
            }
    
            const response = await axios.post(ServHost.host + '/logout', { refreshToken });
            console.log(response.data.message);
        } catch (error) {
            console.error('Ошибка при выходе из системы:', error);
        }
    };

    const UpdateBaskCount = () => {
        let count = 0;
        UpdateCount();
        let a = window.localStorage.getItem('backCount');
        if (a !== null && a !== "") {
            count = Number(a);
        }
        return count;
    };

    const [counttov, setCounttov] = useState(0);
    const [backCount, setBackCount] = useState(0);

    const sendDataToServerCheckToken = async (refreshToken: string) => {
        try {
            const res = await axios.get(ServHost.host + '/checkToken', {
                params: { refreshToken }
            });
            if (res.status === 200 && res.data) {
                setLoginProfile(
                    <div className="rightHeader">
                        <img src={profile} alt="profile" className="imgVH" />
                        <Link to={"/profile"} className='linkHeader'>Профиль</Link>
                        <button className='linkHeader Comissioner btnCont' onClick={handleLogout}>Выйти</button>
                    </div>
                );
            } else {
                setLoginProfile(
                    <div className="rightHeader">
                        <Vhod isMandatory={false} />
                        <Link to={"/reg"} className='linkHeader'>Регистрация</Link>
                    </div>
                );
            }
        } catch (error) {
            console.error(error);
            setLoginProfile(
                <div className="rightHeader">
                    <Vhod isMandatory={false} />
                    <Link to={"/reg"} className='linkHeader'>Регистрация</Link>
                </div>
            );
        }
    };

    const sendDataToServerGetBasket = async () => {
        try {
            const refreshToken = window.localStorage.getItem('refreshToken');
            if (refreshToken) {
                const resCheckToken = await axios.get(ServHost.host + '/checkToken', {
                    params: { refreshToken }
                });
                if (resCheckToken.status === 200 && resCheckToken.data) {
                    const login = resCheckToken.data.login; // Извлекаем логин из ответа
                    const resGetBasket = await axios.post(ServHost.host + '/GetBasket', { login });
                    if (resGetBasket.data.res !== "" && resGetBasket.data.res !== null && resGetBasket.data.res !== undefined) {
                        window.localStorage.setItem('basket', resGetBasket.data.res);
                    }
                    const basket = window.localStorage.getItem('basket');
                    if (basket && basket !== "") {
                        sendDataToServer({ basket });
                    }
                }
            }
            else sendDataToServer();
        } catch (error) {
            console.error(error);
        }
    };
    const sendDataToServerGetLiked = async () => {
        try {
            const refreshToken = window.localStorage.getItem('refreshToken');
            if (refreshToken) {
                const resCheckToken = await axios.get(ServHost.host + '/checkToken', {
                    params: { refreshToken }
                });
                if (resCheckToken.status === 200 && resCheckToken.data) {
                    const login = resCheckToken.data.login; // Извлекаем логин из ответа
                    const resGetBasket = await axios.post(ServHost.host + '/GetLiked', { login });
                    if (resGetBasket.data.res !== "" && resGetBasket.data.res !== null && resGetBasket.data.res !== undefined) {
                        const liked = window.localStorage.getItem('liked');
                        window.localStorage.setItem('liked', resGetBasket.data.res);
                        if (resGetBasket.data.res!=liked)
                        {
                            //window.location.reload();
                        }
                    }
                }
            }
            else sendDataToServer();
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = async () => {
        try {
            logoutUser();
            logout();
            window.location.reload();
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    const [loginProfile, setLoginProfile] = useState(() => (
        <div className="rightHeader">
            <Vhod isMandatory={false} />
            <Link to={"/reg"} className='linkHeader'>Регистрация</Link>
        </div>
    ));

    useEffect(() => {
        const refreshToken = window.localStorage.getItem('refreshToken');
        if (refreshToken) {
            sendDataToServerCheckToken(refreshToken);
            sendDataToServerGetBasket();
            sendDataToServerGetLiked();
            const basket = window.localStorage.getItem('basket');
            if (basket && basket !== "") {
                sendDataToServer({ basket });
            }
        }
        else sendDataToServer();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCounttov(UpdateCount());
            setBackCount(UpdateBaskCount());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const handleBasketChange = async () => {
        const basket = window.localStorage.getItem('basket');
        const basketCount = window.localStorage.getItem('backCount');
        const liked = window.localStorage.getItem('liked');
        // Проверяем наличие basket
        if (!basket) {
            window.localStorage.setItem('backCount', "0");
            window.localStorage.setItem('basket', "");
        }
        else if(!basketCount){
            window.localStorage.setItem('backCount', "0");
            window.localStorage.setItem('basket', "");
        } 
        else {
            setCounttov(UpdateCount());
            setBackCount(UpdateBaskCount());
            await sendDataToServerGetLiked();    
        }
        // Проверяем наличие backCount
        if (!basketCount || basketCount === "") {
            // Если backCount отсутствует или пуст, пересчитываем его
            setBackCount(UpdateBaskCount());
        }
    };
    

    useEffect(() => {
        // Вызываем handleBasketChange при монтировании компонента
        handleBasketChange();
        // Отслеживаем изменения в корзине
        window.addEventListener('storage', handleBasketChange);
        setCounttov(UpdateCount());
        setBackCount(UpdateBaskCount());
        // Очищаем слушателя событий при размонтировании компонента
        return () => {
            window.removeEventListener('storage', handleBasketChange);
        };
    }, []);

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