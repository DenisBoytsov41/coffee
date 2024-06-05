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
    const [content, setContent] = useState<JSX.Element | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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

    const handlePayment = async () => {
        const refreshToken = window.localStorage.getItem("refreshToken");
        const basket = window.localStorage.getItem("basket");

        if (!basket) {
            console.error('Отсутсвует корзина');
            return;
        }

        if (refreshToken) {
            console.log('daad');
            try {
                setLoading(true);
                const response = await axios.post(`${ServHost.host}/processPayment`, {
                    refreshToken,
                    basket
                });

                if (response.status === 200) {
                    console.log('Оплата успешна');
                    await handleDeleteAll();
                } else {
                    console.log(response);
                    console.error('Ошибка оплаты');
                }
            } catch (error) {
                console.error('Ошибка в процессе оплаты:', error);
            } finally {
                setLoading(false);
                //window.location.reload();
            }
        } else {
            if (!validateForm(name, email, phone)) {
                return;
            }

            try {
                setLoading(true);
                const response = await axios.post(`${ServHost.host}/processPayment`, {
                    email,
                    basket
                });

                if (response.status === 200) {
                    console.log('Payment successful');
                    await handleDeleteAll();
                } else {
                    console.error('Payment failed');
                }
            } catch (error) {
                console.error('Error processing payment:', error);
            } finally {
                setLoading(false);
                window.location.reload();
            }
        }
    };

    useEffect(() => {
        const refreshToken = window.localStorage.getItem('refreshToken');
        setIsLoggedIn(!!refreshToken);
    }, []);

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
                    setContent(
                        <div className="basketContent">
                            <div className="OformlenieCont">
                                <form onSubmit={handleFormSubmit}>
                                    <div className="Oformlenie">
                                        <div className="paddingCont">
                                            <br />
                                            <div className="baskZagol whiteText">ОФОРМЛЕНИЕ</div>
                                            <br />
                                            <br />
                                            <div className="baskText grayText">Покупатель</div>
                                            <br />
                                            {!isLoggedIn && (
                                                <div className="inpGor">
                                                    <div className="TelBask">
                                                        <input 
                                                            type="text" 
                                                            placeholder="Имя и Фамилия" 
                                                            className="inpBasklog whiteText" 
                                                            defaultValue={name}
                                                            onChange={(e) => setName(e.target.value)}
                                                        />
                                                        {errors.name && <div className="error">{errors.name}</div>}
                                                        <input 
                                                            type="email" 
                                                            placeholder="E-mail" 
                                                            className="inpBasklog whiteText" 
                                                            defaultValue={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                        />
                                                        {errors.email && <div className="error">{errors.email}</div>}
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
                                                        {errors.phone && <div className="error">{errors.phone}</div>}
                                                    </div>
                                                </div>
                                            )}
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
                                    <br />
                                    <button type="submit" className="KorzVsegobutton" disabled={loading}>
                                        {loading ? 'Оплата...' : 'Оплатить товар'}
                                    </button>
                                </form>
                            </div>
                            <div className="Bask">
                                <div className="paddingCont">
                                    <br />
                                    <div className="baskZagол">КОРЗИНА</div>
                                    <br />
                                    <br />
                                    <Katalog type={'korzina'} katcount={0} pagination={false} itemsPerPage={10}/>
                                    <br />
                                    <br />
                                    <div className="KorzVsego">
                                        <div className="KorzVsegoText">
                                            всего {a}₽
                                        </div>
                                        <button className="KorzVsegobutton" onClick={handleDeleteAll} disabled={loading}>
                                            {loading ? 'Удаление...' : 'Удалить все товары'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
            }
        }, 100);

        return () => clearInterval(interval);
    }, [errors, loading, name, email, phone, isLoggedIn]);

    const validateForm = (name: string, email: string, phone: string) => {
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

    useEffect(() => {
        if (Object.values(errors).some(error => error !== "")) {
            const timer = setTimeout(() => {
                setErrors({ name: "", email: "", phone: "" });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const refreshToken = window.localStorage.getItem('refreshToken');
        if (validateForm(name, email, phone) || refreshToken !='') {
            handlePayment();
        } else {
            console.log('Форма не валидна, не выполняем оплату');
        }
    };

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
                {content}
                {!window.localStorage.getItem("basket") && (
                    <div>
                        <Link to={"/buy"} className='linkHeader'>
                            <button className="ButtonPusto">Перейти в каталог</button>
                        </Link>
                    </div>
                )}
            </div>
            <Footer className="footer" />
        </div>
    );
}

export default Basket;
