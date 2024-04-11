import React, {useEffect, useState} from "react";
import '../styles/katalog.css';
import ti from "../images/tovimage.jpg";
import tbd from "../images/tovbuy.jpg";
import tba from "../images/inkorz.jpg";
import tld from "../images/tovlike.jpg";
import tla from "../images/tovlikeakt.jpg";
import axios from "axios";
import ServHost from "../serverHost.json"

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

    const [LikeImage, setLikeImage] = useState(() => {
        const initialState = function () {
            return tld;
        }
        return initialState()
    })

    const [BuyImage, setBuyImage] = useState(() => {
        const initialState = function () {
            return tbd;
        }
        return initialState()
    })

    useEffect(() => {
        if(window.localStorage.getItem("liked")){
            // @ts-ignore
            if(window.localStorage.getItem("liked").includes(String(props.id))){
                setLikeImage(tla);
            }
        }
        if(window.localStorage.getItem("basket")){
            // @ts-ignore
            if(window.localStorage.getItem("basket").includes(String(props.id + ":" + counttov))){
                setBuyImage(tba);
            }
        }
    });

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

    const sendDataToServerUpdateBasket = async (data:{ mail: string, pass: string , value: string}) => {
        try {
            const res = await axios.post(ServHost.host + '/UpdateBasket', data);
            if(res.data.res !== ""){
                console.log(res.data.res)

            }
        } catch (error) {
            console.error(error);
        }
    };

    const UpdateDBBasket = () => {
        let a = window.localStorage.getItem('Login')
        if(a){
            let b = window.localStorage.getItem('basket')
            if(b) {
                sendDataToServerUpdateBasket({ mail: a.split(" ")[0], pass: a.split(" ")[1], value: b })
            }
            if(!b || b === ""){
                sendDataToServerUpdateBasket({ mail: a.split(" ")[0], pass: a.split(" ")[1], value: "" })
            }
        }
    }

    return(
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
                    <img src={ti} alt="ti"/>
                    <div className="tovopis">
                        {props.opis}
                    </div>
                </div>
                <div className='tovcountinp'>
                    <button onClick={() => {
                        if (counttov > 1) {
                            if (window.localStorage.getItem("basket")) {
                                // @ts-ignore
                                if (window.localStorage.getItem("basket").includes(String(props.id + ":" + counttov))) {
                                    // @ts-ignore
                                    window.localStorage.setItem("basket", window.localStorage.getItem("basket").replace(String(props.id + ":" + counttov), props.id + ":" + (counttov - 1)))
                                    let a = Number(window.localStorage.getItem("backCount"))
                                    window.localStorage.setItem("backCount", String(a - props.price))
                                }
                            }
                            setCounttov(counttov - 1)
                            UpdateDBBasket()
                        }
                    }}>-
                    </button>
                    <div className="tovcount">{counttov}</div>
                    <button onClick={() => {
                        if (window.localStorage.getItem("basket")) {
                            // @ts-ignore
                            if (window.localStorage.getItem("basket").includes(String(props.id + ":" + counttov))) {
                                // @ts-ignore
                                window.localStorage.setItem("basket", window.localStorage.getItem("basket").replace(String(props.id + ":" + counttov), props.id + ":" + (counttov + 1)))
                                let a = Number(window.localStorage.getItem("backCount"))
                                window.localStorage.setItem("backCount", String(a + props.price))
                            }
                        }
                        setCounttov(counttov + 1)
                        UpdateDBBasket()
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
                                window.localStorage.setItem("liked", String(props.id))
                                setLikeImage(tla);
                            } else {
                                // @ts-ignore
                                if (!window.localStorage.getItem("liked").includes(String(props.id))) {
                                    window.localStorage.setItem("liked", window.localStorage.getItem("liked") + "," + String(props.id))
                                    setLikeImage(tla);
                                } else {
                                    // @ts-ignore
                                    window.localStorage.setItem("liked", window.localStorage.getItem("liked").replace("," + String(props.id), ""))
                                    // @ts-ignore
                                    window.localStorage.setItem("liked", window.localStorage.getItem("liked").replace(String(props.id) + ",", ""))
                                    // @ts-ignore
                                    window.localStorage.setItem("liked", window.localStorage.getItem("liked").replace(String(props.id), ""))
                                    setLikeImage(tld);
                                }
                            }
                        }}>
                            <img src={LikeImage} alt="tl" className='imgtov'/>
                        </button>
                        <button onClick={() => {
                            if (!window.localStorage.getItem("basket")) {
                                window.localStorage.setItem("basket", String(props.id + ":" + counttov))
                                setBuyImage(tba);
                                UpdateBackCount("pl");
                                UpdateDBBasket()
                            } else {
                                // @ts-ignore
                                if (!window.localStorage.getItem("basket").includes(String(props.id + ":" + counttov))) {
                                    window.localStorage.setItem("basket", window.localStorage.getItem("basket") + "," + String(props.id + ":" + counttov))
                                    setBuyImage(tba);
                                    UpdateBackCount("pl");
                                    UpdateDBBasket()
                                } else {
                                    // @ts-ignore
                                    window.localStorage.setItem("basket", window.localStorage.getItem("basket").replace("," + String(props.id + ":" + counttov), ""))
                                    // @ts-ignore
                                    window.localStorage.setItem("basket", window.localStorage.getItem("basket").replace(String(props.id + ":" + counttov) + ",", ""))
                                    // @ts-ignore
                                    window.localStorage.setItem("basket", window.localStorage.getItem("basket").replace(String(props.id + ":" + counttov), ""))
                                    setBuyImage(tbd);
                                    UpdateBackCount("min");
                                    UpdateDBBasket()
                                }
                            }
                        }}>
                            <img src={BuyImage} alt="tb" className='imgtov'/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default KartTovar;