import React, { useState } from "react";
import '../styles/kartKorz.css';
import axios from "axios";
import ServHost from "../serverHost.json";

interface Props {
    name: string;
    price: number;
    id: number;
    image: string;
    onDelete: (id: number) => void;
}

function KartKorz(props: Props) {

    const [counttov, setCounttov] = useState(() => {
        const initialState = function () {
            let count = 1;
            if (window.localStorage.getItem("basket")) {
                let arr = window.localStorage.getItem("basket")?.split(",") || [];
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

    const [vsego, setVsego] = useState(() => props.price * counttov);

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
    }

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
                    //console.log(res.data.res);
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

    const handleDelete = async () => {
        let basket = window.localStorage.getItem("basket") || "";
        const itemString = String(props.id + ":" + counttov);
        if (basket.includes("," + itemString)) {
            basket = basket.replace("," + itemString, "");
        } else if (basket.includes(itemString + ",")) {
            basket = basket.replace(itemString + ",", "");
        } else {
            basket = basket.replace(itemString, "");
        }

        await UpdateDBBasket(basket);
        window.localStorage.setItem("basket", basket);
        UpdateBackCount("min");

        if (props.onDelete) {
            props.onDelete(props.id);
        }
    };
    const handleMinusClick = async () => {
        if (counttov > 1) {
            const newCount = counttov - 1;
            if (window.localStorage.getItem("basket")?.includes(`${props.id}:${newCount + 1}`)) {
                let basket = window.localStorage.getItem("basket") || "";
                let backCount = Number(window.localStorage.getItem("backCount") || 0);
                const itemString = String(props.id + ":" + counttov);
                if (basket.includes(itemString)) {
                    basket = basket.replace(itemString, `${props.id}:${counttov - 1}`);
                    backCount -= props.price;
                }
                await UpdateDBBasket(basket);
                window.localStorage.setItem("basket", basket);
                window.localStorage.setItem("backCount", String(backCount));
            }
            setCounttov(counttov - 1);
            setVsego(vsego - props.price);
        }
    };
    const handlePlusClick = async () => {
        if (counttov < 1000) {
            let basket = window.localStorage.getItem("basket") || "";
            let backCount = Number(window.localStorage.getItem("backCount") || 0);
            const itemString = String(props.id + ":" + counttov);
            if (basket.includes(itemString)) {
                basket = basket.replace(itemString, `${props.id}:${counttov + 1}`);
                backCount += props.price;
            }
            await UpdateDBBasket(basket);
            window.localStorage.setItem("basket", basket);
            window.localStorage.setItem("backCount", String(backCount));
        }
        setCounttov(counttov + 1);
        setVsego(vsego + props.price);
    };

    return (
        <div className='korzkarttov'>
            <div className='korzkarttov1'>
                <div className="korztovcont">
                    <img className="korzimgtovar" src={props.image} alt="tovar" />
                </div>
                <div className="korztovhead">
                    <div className="korztovname">
                        {props.name}
                    </div>
                </div>
                <div className="korzpaddingKorz"></div>
                <div className="korzcountkorz">
                    <div className='korztovcountinp'>
                        <button onClick={() => handleMinusClick()}>-</button>
                        <div className="korztovcount">{counttov}</div>
                        <button onClick={() => handlePlusClick()}>+</button>
                    </div>
                    <div className='korztovprice_one'>
                        1 шт = {props.price}₽
                    </div>
                </div>
                <div className="korztovfut">
                    <div className='korztovprice'>
                        {vsego}₽
                    </div>
                    <button className="ItemDelete" onClick={handleDelete}>
                        Удалить
                    </button>
                </div>
            </div>
            <div className="line1"></div>
        </div>
    );
}

export default KartKorz;
