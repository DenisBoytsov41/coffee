import React, { useEffect, useState } from "react";
import '../styles/katalog.css';
import ti from "../images/tovimage.jpg";
import tbd from "../images/tovbuy.jpg";
import tba from "../images/inkorz.jpg";
import tld from "../images/tovlike.jpg";
import tla from "../images/tovlikeakt.jpg";
import axios from "axios";
import ServHost from "../serverHost.json";

interface Props {
    name: string;
    opis: string;
    price: number;
    id: number;
}

function KartTovar(props: Props) {

    const [counttov, setCounttov] = useState(() => {
        const initialState = function () {
            let count = 1;
            if (window.localStorage.getItem("basket")) {
                // @ts-ignore
                let arr = window.localStorage.getItem("basket").split(",");
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].split(":")[0] === String(props.id)) {
                        count = Number(arr[i].split(":")[1]);
                    }
                }
            }
            return count;
        }
        return initialState();
    });

    const [LikeImage, setLikeImage] = useState(() => {
        const initialState = function () {
            return tld;
        }
        return initialState();
    });

    const [BuyImage, setBuyImage] = useState(() => {
        const initialState = function () {
            return tbd;
        }
        return initialState();
    });

    useEffect(() => {
        if (window.localStorage.getItem("liked")) {
            // @ts-ignore
            if (window.localStorage.getItem("liked").includes(String(props.id))) {
                setLikeImage(tla);
            }
        }
        if (window.localStorage.getItem("basket")) {
            // @ts-ignore
            if (window.localStorage.getItem("basket").includes(String(props.id + ":" + counttov))) {
                setBuyImage(tba);
            }
        }
    }, [props.id, counttov]);

    const UpdateBackCount = (type: string) => {
        if (!window.localStorage.getItem("backCount")) {
            if (type === "pl") {
                window.localStorage.setItem("backCount", String(props.price * counttov));
            }
        } else {
            if (type === "pl") {
                let a = Number(window.localStorage.getItem("backCount"));
                window.localStorage.setItem("backCount", String((props.price * counttov) + a));
            }
        }
        if (type === "min") {
            let a = Number(window.localStorage.getItem("backCount"));
            window.localStorage.setItem("backCount", String(a - (props.price * counttov)));
        }
    };

    const sendDataToServerUpdateBasket = async (refreshToken: string | null, basket: string | null) => {
        try {
            if (!refreshToken) {
                console.error('Refresh token is missing');
                return;
            }
            // Проверяем токен на сервере
            const resCheckToken = await axios.get(ServHost.host + '/checkToken', {
                params: { refreshToken }
            });
            if (resCheckToken.status === 200 && resCheckToken.data) {
                const login = resCheckToken.data.login;
                // Отправляем данные для обновления корзины
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

    const UpdateDBBasket = async (basketParam?: string) => {
        const refreshToken = window.localStorage.getItem('refreshToken');
        const basket = basketParam ?? window.localStorage.getItem('basket');
        if (refreshToken) {
            await sendDataToServerUpdateBasket(refreshToken, basket || "");
        }
    };

    const sendDataToServerUpdateLiked= async (refreshToken: string | null, liked: string | null) => {
        try {
            if (!refreshToken) {
                console.error('Refresh token is missing');
                return;
            }
            // Проверяем токен на сервере
            const resCheckToken = await axios.get(ServHost.host + '/checkToken', {
                params: { refreshToken }
            });
            if (resCheckToken.status === 200 && resCheckToken.data) {
                const login = resCheckToken.data.login;
                // Отправляем данные для обновления корзины
                const res = await axios.post(ServHost.host + '/UpdateLiked', { login, items: liked || "" });
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

    const UpdateDBLiked = async (basketParam?: string) => {
        const refreshToken = window.localStorage.getItem('refreshToken');
        const liked = basketParam ?? window.localStorage.getItem('liked');
        if (refreshToken) {
            await sendDataToServerUpdateLiked(refreshToken, liked || "");
        }
    };

    return (
        <div className='karttov'>
            <div className="tovhead">
                <div className="tovname">
                    {props.name}
                </div>
                <div>
                    натуральный
                </div>
            </div>
            <div className="bottomCont">
                <div className="tovcont">
                    <img src={ti} alt="ti" />
                    <div className="tovopis">
                        {props.opis}
                    </div>
                </div>
                <div className='tovcountinp'>
                    <button onClick={async () => {
                        if (counttov > 1) {
                            // Получаем значения из локального хранилища в переменные
                            let basket = window.localStorage.getItem("basket") || "";
                            let backCount = Number(window.localStorage.getItem("backCount") || 0);

                            // Проверяем и обновляем переменную basket
                            const itemString = String(props.id + ":" + counttov);
                            if (basket.includes(itemString)) {
                                basket = basket.replace(itemString, `${props.id}:${counttov - 1}`);
                                backCount -= props.price;
                            }
                            // Обновляем базу данных
                            await UpdateDBBasket(basket);
                            // Сохраняем обновленные значения обратно в локальное хранилище
                            window.localStorage.setItem("basket", basket);
                            window.localStorage.setItem("backCount", String(backCount));

                            // Обновляем состояние компонента
                            setCounttov(counttov - 1);
                        }
                    }}>-
                    </button>
                    <div className="tovcount">{counttov}</div>
                    <button onClick={async () => {
                        if (counttov < 1000) {
                            // Получаем значение из локального хранилища в переменные
                            let basket = window.localStorage.getItem("basket") || "";
                            let backCount = Number(window.localStorage.getItem("backCount") || 0);

                            // Проверяем и обновляем переменную basket
                            const itemString = String(props.id + ":" + counttov);
                            if (basket.includes(itemString)) {
                                basket = basket.replace(itemString, `${props.id}:${counttov + 1}`);
                                backCount += props.price;
                            }
                            await UpdateDBBasket(basket);
                            // Сохраняем обновленные значения обратно в локальное хранилище
                            window.localStorage.setItem("basket", basket);
                            window.localStorage.setItem("backCount", String(backCount));

                            // Обновляем состояние компонента
                            setCounttov(counttov + 1);
                        }
                    }}>+
                    </button>
                </div>
                <div className="tovfut">
                    <div className='tovprice'>
                        {props.price}₽
                    </div>
                    <div className="tovbutt">
                        <button onClick={() => {
                            if (!window.localStorage.getItem("liked")) {
                                window.localStorage.setItem("liked", String(props.id));
                                let liked = window.localStorage.getItem("liked") || "";
                                UpdateDBLiked(liked);
                                setLikeImage(tla);
                            } else {
                                // @ts-ignore
                                if (!window.localStorage.getItem("liked").includes(String(props.id))) {
                                    window.localStorage.setItem("liked", window.localStorage.getItem("liked") + "," + String(props.id));
                                    let liked = window.localStorage.getItem("liked") || "";
                                    UpdateDBLiked(liked);
                                    setLikeImage(tla);
                                } else {
                                    // @ts-ignore
                                    let liked = window.localStorage.getItem("liked") || "";
                                    liked = liked.replace("," + String(props.id), "");
                                    liked = liked.replace(String(props.id) + ",", "");
                                    liked = liked.replace(String(props.id), "");
                                    window.localStorage.setItem("liked", liked);
                                    UpdateDBLiked(liked);
                                    setLikeImage(tld);
                                }
                            }
                        }}>
                            <img src={LikeImage} alt="tl" className='imgtov' />
                        </button>
                        <button onClick={async () => {
                            let basket = window.localStorage.getItem("basket") || "";
                            let backCount = Number(window.localStorage.getItem("backCount") || 0);

                            if (!basket.includes(String(props.id + ":" + counttov))) {
                                basket += basket ? `,${props.id}:${counttov}` : `${props.id}:${counttov}`;
                                backCount += props.price * counttov;
                                setBuyImage(tba);
                                UpdateBackCount("pl");
                            } else {
                                basket = basket.replace(`,${props.id}:${counttov}`, "")
                                               .replace(`${props.id}:${counttov},`, "")
                                               .replace(`${props.id}:${counttov}`, "");
                                backCount -= props.price * counttov;
                                setBuyImage(tbd);
                                UpdateBackCount("min");
                            }
                            await UpdateDBBasket(basket);
                            window.localStorage.setItem("basket", basket);
                            window.localStorage.setItem("backCount", String(backCount));
                        }}>
                            <img src={BuyImage} alt="tb" className='imgtov' />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default KartTovar;
