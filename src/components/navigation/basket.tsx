import React, { useEffect, useState } from "react";
import Header from "../Hader";
import Footer from "../Futer";
import { Link } from "react-router-dom";
import "../../styles/basket.css";
import IMask from "imask";
import Katalog from "../Katalog";
import axios from "axios";
import ServHost from "../../serverHost.json";

function Basket() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ name: "", email: "", phone: "" });
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const sendDataToServerUpdateBasket = async (refreshToken: string | null, basket: string | null) => {
        try {
            if (!refreshToken) {
                console.error('Refresh token is missing');
                return;
            }
            const resCheckToken = await axios.get(ServHost.host + '/checkToken', {
                params: { refreshToken }
            });
            if (resCheckToken.status === 200 && resCheckToken.data) {
                const login = resCheckToken.data.login;
                const res = await axios.post(ServHost.host + '/UpdateBasket', { login, items: basket || "" });
                if (res.data.res !== "") {
                    console.log(res.data.res);
                }
            } else {
                console.error('Invalid or expired refresh token');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const updateDBBasket = async () => {
        const refreshToken = window.localStorage.getItem('refreshToken');
        const basket = window.localStorage.getItem('basket');
        if (refreshToken) {
            await sendDataToServerUpdateBasket(refreshToken, basket || "");
        }
    };

    const handleDeleteAll = async () => {
        setLoading(true);
        window.localStorage.setItem("basket", "");
        window.localStorage.setItem("backCount", "0");
        await updateDBBasket();
        window.location.reload();
    };

    const [PustoLogo] = useState(() => {
        if (!window.localStorage.getItem("basket")) {
            return <div className="LikedKat">ВАША КОРЗИНА ПУСТА <br /><br /></div>
        } else {
            return <div></div>;
        }
    });

    useEffect(() => {
        let a = "";

        const interval = setInterval(() => {
            if (a !== window.localStorage.getItem('backCount')) {
                a = window.localStorage.getItem('backCount') || "";
                if (!window.localStorage.getItem("basket")) {
                    setContent(
                        <div className="centerText">
                            Чтобы увидеть сохраненные в корзине товары,
                            <Link to={"/login"} className='linkHeader'>авторизуйтесь.</Link><br /><br /><br />
                        </div>
                    );
                } else {
                    setContent(loadContentIFBask(a));
                }
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    const validateForm = () => {
        const newErrors = { name: "", email: "", phone: "" };
        let isValid = true;

        if (!name.trim()) {
            newErrors.name = "Имя и фамилия обязательны.";
            isValid = false;
        }
        if (!email.trim()) {
            newErrors.email = "Email обязателен.";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Неверный формат email.";
            isValid = false;
        }
        if (!phone.trim()) {
            newErrors.phone = "Телефон обязателен.";
            isValid = false;
        } else if (!/^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(phone)) {
            newErrors.phone = "Неверный формат телефона.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            // Здесь можно отправить данные на сервер
            console.log("Форма валидна и отправлена.");
        }
    };

    const loadContentIFBask = (BC: string) => {
        return (
            <div className="basketContent">
                <div className="OformlenieCont">
                    <div className="Oformlenie">
                        <div className="paddingCont">
                            <br />
                            <div className="baskZagol whiteText">ОФОРМЛЕНИЕ</div>
                            <br />
                            <br />
                            <div className="baskText grayText">Покупатель</div>
                            <br />
                            <div className="inpGor">
                                <div className="TelBask">
                                    <input 
                                        type="text" 
                                        placeholder="Имя и Фамилия" 
                                        className="inpBasklog whiteText" 
                                        defaultValue={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    {errors.name && <span className="error">{errors.name}</span>}
                                    <input 
                                        type="email" 
                                        placeholder="E-mail" 
                                        className="inpBasklog whiteText" 
                                        defaultValue={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    {errors.email && <span className="error">{errors.email}</span>}
                                </div>
                                <div className="TelBask">
                                    <input 
                                        type="tel" 
                                        placeholder="Телефон" 
                                        id="tel" 
                                        className="inpBasklog whiteText" 
                                        defaultValue={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                    {errors.phone && <span className="error">{errors.phone}</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <br />
                    <br />
                    <div className="AddrDost">
                        ИНТЕГРАЦИЯ CDEK
                    </div>
                    <br />
                    <br />
                    <br />
                    <div className="AddrDost">
                        ИНТЕГРАЦИЯ ЮКАССА
                    </div>
                </div>
                <div className="Bask">
                    <div className="paddingCont">
                        <br />
                        <div className="baskZagol">КОРЗИНА</div>
                        <br />
                        <br />
                        <Katalog type={'korzina'} katcount={0} />
                        <br />
                        <br />
                        <div className="KorzVsego">
                            <div className="KorzVsegoText">
                                всего {BC}₽
                            </div>
                            <button className="KorzVsegobutton" onClick={handleDeleteAll} disabled={loading}>
                                {loading ? 'Удаление...' : 'Удалить все товары'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const [Content, setContent] = useState(() => {
        if (!window.localStorage.getItem("basket")) {
            return (
                <div>
                    Чтобы увидеть сохраненные в корзине товары,
                    <Link to={"/login"} className='linkHeader'>авторизуйтесь.</Link><br /><br /><br />
                </div>
            );
        } else {
            return loadContentIFBask(window.localStorage.getItem('backCount') || "0");
        }
    });

    const [PustoBtn] = useState(() => {
        if (!window.localStorage.getItem("basket")) {
            return (
                <div>
                    <Link to={"/buy"} className='linkHeader'>
                        <button className="ButtonPusto">Перейти в каталог</button>
                    </Link>
                </div>
            );
        } else {
            return <div></div>;
        }
    });

    useEffect(() => {
        if (document.getElementById('tel')) {
            const element = document.getElementById('tel');
            const maskOptions = {
                mask: '+7(000)000-00-00',
                lazy: false
            };
            // @ts-ignore
            new IMask(element, maskOptions);
        }
    }, []);

    return (
        <div>
            <Header />
            <br />
            <br />
            <div className="contApp">
                {PustoLogo}
                {Content}
                {PustoBtn}
            </div>
            <Footer className="footer" />
        </div>
    );
}

export default Basket;
