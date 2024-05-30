import React, { useEffect, useState } from "react";
import '../styles/katalog.css';
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
    image: string;
    onRemoveLikedItem?: (itemId: number) => void; // New prop for removing liked item
}

function KartTovar(props: Props) {
    const [counttov, setCounttov] = useState(() => {
        let count = 1;
        if (window.localStorage.getItem("basket")) {
            const arr = window.localStorage.getItem("basket")?.split(",") || [];
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].split(":")[0] === String(props.id)) {
                    count = Number(arr[i].split(":")[1]);
                }
            }
        }
        return count;
    });

    const [LikeImage, setLikeImage] = useState(tld);
    const [BuyImage, setBuyImage] = useState(tbd);

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
                const a = Number(window.localStorage.getItem("backCount"));
                window.localStorage.setItem("backCount", String((props.price * counttov) + a));
            }
        }
        if (type === "min") {
            const a = Number(window.localStorage.getItem("backCount"));
            window.localStorage.setItem("backCount", String(a - (props.price * counttov)));
        }
    };

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

    const sendDataToServerUpdateLiked = async (refreshToken: string | null, liked: string | null) => {
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
    const handleMinusClick = async () => {
        if (counttov > 1) {
            const newCount = counttov - 1;
            const basket = window.localStorage.getItem("basket") || "";
            const backCount = Number(window.localStorage.getItem("backCount") || 0);
            const itemString = `${props.id}:${counttov}`;
            if (basket.includes(itemString)) {
                const newBasket = basket.replace(itemString, `${props.id}:${newCount}`);
                const newBackCount = backCount - props.price;
                await Promise.all([
                    UpdateDBBasket(newBasket),
                    window.localStorage.setItem("basket", newBasket),
                    window.localStorage.setItem("backCount", String(newBackCount))
                ]);
            }
            setCounttov(newCount);
        }
    };
    
    const handlePlusClick = async () => {
        if (counttov < 1000) {
            const newCount = counttov + 1;
            const basket = window.localStorage.getItem("basket") || "";
            const backCount = Number(window.localStorage.getItem("backCount") || 0);
            const itemString = `${props.id}:${counttov}`;
            if (basket.includes(itemString)) {
                const newBasket = basket.replace(itemString, `${props.id}:${newCount}`);
                const newBackCount = backCount + props.price;
                await Promise.all([
                    UpdateDBBasket(newBasket),
                    window.localStorage.setItem("basket", newBasket),
                    window.localStorage.setItem("backCount", String(newBackCount))
                ]);
            }
            setCounttov(newCount);
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
                    <img src={props.image} alt="tovar" />
                    <div className="tovopis">
                        {props.opis}
                    </div>
                </div>
                <div className='tovcountinp'>
                    <button onClick={() => handleMinusClick()}>-</button>
                    <div className="tovcount">{counttov}</div>
                    <button onClick={() => handlePlusClick()}>+</button>
                </div>
                <div className="tovfut">
                    <div className='tovprice'>
                        {props.price}₽
                    </div>
                    <div className="tovbutt">
                        <button onClick={() => {
                            let liked = window.localStorage.getItem("liked") || "";
                            if (!liked.includes(String(props.id))) {
                                liked += liked ? `,${props.id}` : `${props.id}`;
                                window.localStorage.setItem("liked", liked);
                                UpdateDBLiked(liked);
                                setLikeImage(tla);
                            } else {
                                liked = liked.split(",").filter(id => id !== String(props.id)).join(",");
                                window.localStorage.setItem("liked", liked);
                                UpdateDBLiked(liked);
                                setLikeImage(tld);
                                if (props.onRemoveLikedItem) {
                                    props.onRemoveLikedItem(props.id);
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
