import React, {useEffect, useState} from "react";
import '../styles/kartKorz.css';
import ti from "../images/tovimage.png";
import axios from "axios";

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
        window.location.reload();
    }

    const sendDataToServerUpdateBasket = async (data:{ mail: string, pass: string , value: string}) => {
        try {
            const res = await axios.post('http://localhost:3001/api/UpdateBasket', data);
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
                                setVsego(vsego - props.price)
                                UpdateDBBasket()
                            }
                        }}>-
                        </button>
                        <div className="korztovcount">{counttov}</div>
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
                            setVsego(vsego + props.price)
                            UpdateDBBasket()
                        }}>+
                        </button>
                    </div>
                    <div className='korztovprice_one'>
                        1 шт = {props.price}₽
                    </div>
                </div>
                <div className="korztovfut">
                    <div className='korztovprice'>
                        {vsego}₽
                    </div>
                    <button className="ItemDelete" onClick={() => {
                        // @ts-ignore
                        window.localStorage.setItem("basket", window.localStorage.getItem("basket").replace("," + String(props.id + ":" + counttov), ""))
                        // @ts-ignore
                        window.localStorage.setItem("basket", window.localStorage.getItem("basket").replace(String(props.id + ":" + counttov) + ",", ""))
                        // @ts-ignore
                        window.localStorage.setItem("basket", window.localStorage.getItem("basket").replace(String(props.id + ":" + counttov), ""))
                        UpdateBackCount("min");
                        UpdateDBBasket()
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