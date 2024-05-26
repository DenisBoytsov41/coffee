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
                                    <input type="text" placeholder="Имя и Фамилия" className="inpBasklog whiteText" />
                                    <input type="text" placeholder="E-mail" className="inpBasklog whiteText" />
                                </div>
                                <div className="TelBask">
                                    <input type="text" placeholder="Телефон" id="tel" className="inpBasklog whiteText" />
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
    });

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
