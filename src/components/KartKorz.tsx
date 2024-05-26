import React, {useEffect, useState} from "react";
import '../styles/kartKorz.css';
import ti from "../images/tovimage.jpg";
import axios from "axios";
import ServHost from "../serverHost.json";

interface Props {
    name: string;
    price: number;
    id: number;
}

function KartTovar(props: Props) {

    const [counttov, setCounttov] = useState(() => {
        const initialState = function () {
            let count = 1;
            if(window.localStorage.getItem("basket")){
                // @ts-ignore
                let arr = window.localStorage.getItem("basket").split(",")
                for (let i = 0; i < arr.length; i++){
                    if(arr[i].split(":")[0] === String(props.id)){
                        count = Number(arr[i].split(":")[1]);
                    }
                }
            }
            return count;
        }
        return initialState()
    })

    const [vsego, setVsego] = useState(() => {
        const initialState = function () {
            return props.price * counttov
        }
        return initialState()
    })

    const UpdateBackCount = (type:string) =>{
        if(!window.localStorage.getItem("backCount")) {
            if(type === "pl"){
                window.localStorage.setItem("backCount", String(props.price * counttov))
            }
        }
        else {
            if(type === "pl"){
                let a = Number(window.localStorage.getItem("backCount"))
                window.localStorage.setItem("backCount", String((props.price * counttov) + a))
            }
        }
        if(type === "min"){
            let a = Number(window.localStorage.getItem("backCount"))
            window.localStorage.setItem("backCount", String(a - (props.price * counttov)))
        }
    }

    const sendDataToServerUpdateBasket = async (refreshToken: string | null, basket: string | null) => {
        try {
            console.log("хахахах");
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
                    //window.location.reload();
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
    

    return(
        <div className='korzkarttov'>
            <div className='korzkarttov1'>
                <div className="korztovcont">
                    <img className="korzimgtovar" src={ti} alt="ti"/>
                </div>
                <div className="korztovhead">
                    <div className="korztovname">
                        {props.name}
                    </div>
                </div>
                <div className="korzpaddingKorz"></div>
                <div className="korzcountkorz">
                    <div className='korztovcountinp'>
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
                            setVsego(vsego - props.price);
                        }
                    }}>-</button>

                        <div className="korztovcount">{counttov}</div>
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
                                setVsego(vsego + props.price);
                            }
                        }}>+</button>

                    </div>
                    <div className='korztovprice_one'>
                        1 шт = {props.price}₽
                    </div>
                </div>
                <div className="korztovfut">
                    <div className='korztovprice'>
                        {vsego}₽
                    </div>
                    <button className="ItemDelete" onClick={async () => {
                        // Получаем значение из локального хранилища в переменную
                        let basket = window.localStorage.getItem("basket") || "";

                        // Обновляем переменную, удаляя элементы
                        basket = basket.replace("," + String(props.id + ":" + counttov), "");
                        basket = basket.replace(String(props.id + ":" + counttov) + ",", "");
                        basket = basket.replace(String(props.id + ":" + counttov), "");

                        // Обновляем данные корзины в базе данных
                        await UpdateDBBasket(basket);

                        // Сохраняем новое значение обратно в локальное хранилище
                        window.localStorage.setItem("basket", basket);

                        // Обновляем количество элементов на сервере
                        UpdateBackCount("min");
                    }}>
                        Удалить
                    </button>

                </div>
            </div>
            <div className="line1"></div>
        </div>
    );
}

export default KartTovar;
