import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import City from "./City";
import Contacts from "./Contacts";
import Vhod from "./Vhod";
import '../styles/Header.css';
import logo from '../images/logo.jpg';
import like from '../images/Like.jpg';
import bask from '../images/Basket.jpg';
import HamburgerMenu from "./HamburgerMenu";
import axios from "axios";
import profile from "../images/Profile.jpg";
import ServHost from "../serverHost.json";
import { useAuth } from '../components/navigation/AuthContext';

interface BasketData {
    basket: string;
}

function Header() {
    const { logout } = useAuth(); 
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
                        <Vhod />
                        <Link to={"/reg"} className='linkHeader'>Регистрация</Link>
                    </div>
                );
            }
        } catch (error) {
            console.error(error);
            setLoginProfile(
                <div className="rightHeader">
                    <Vhod />
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
            <Vhod />
            <Link to={"/reg"} className='linkHeader'>Регистрация</Link>
        </div>
    ));

    useEffect(() => {
        const refreshToken = window.localStorage.getItem('refreshToken');
        if (refreshToken) {
            sendDataToServerCheckToken(refreshToken);
            sendDataToServerGetBasket();
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

    const handleBasketChange = () => {
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
            sendDataToServerGetLiked();    
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
        <div className="HeaderRezerv">
            <div className="HeaderBack"></div>
            <div className="mainHeader">
                <div className="contHeader hideMobile">
                    <div className="leftHeader">
                        <City />
                        <Contacts />
                        <Link to={"/opt"} className='linkHeader'>Оптовые цены</Link>
                    </div>
                    {loginProfile}
                </div>
                <div className="line hideMobile"></div>
                <div className="contHeader">
                    <div className="leftHeader">
                        <Link to={"/"} className='linkHeader'>
                            <img src={logo} alt="logo" />
                        </Link>
                        <Link to={"/buy"} className='linkHeader hideMobile'>Купить</Link>
                        <Link to={"/faq"} className='linkHeader hideMobile'>Частые вопросы</Link>
                        <Link to={"/shipment"} className='linkHeader hideMobile'>Условия работы</Link>
                    </div>
                    <div className="rightHeader">
                        <Link to={"/liked"} className='linkHeader'>
                            <div className='baskHeader'>
                                <img src={like} alt="like" className="imgtov" />
                            </div>
                        </Link>
                        <Link to={"/basket"} className='linkHeader'>
                            <div className='baskHeader'>
                                <img src={bask} alt="bask" className="imgtov" />
                                <div className='baskinfoHeader'>
                                    <label>{backCount} ₽</label>
                                    <label>{counttov} тов.</label>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="rightHeaderMobile">
                        <HamburgerMenu />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
