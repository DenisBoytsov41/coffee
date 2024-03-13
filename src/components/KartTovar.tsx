import React, {useEffect, useState} from "react";
import '../styles/katalog.css';
import ti from "../images/tovimage.png";
import tb from "../images/tovbuy.png";
import tld from "../images/tovlike.png";
import tla from "../images/tovlikeakt.png";

interface Props {
    name: string;
    opis: string;
    price: number;
    id: number;
}

function KartTovar(props: Props) {

    const [counttov, setCounttov] = useState(() => {
        const initialState = function () {
            return 1
        }
        return initialState()
    })

    const [LikeImage, setLikeImage] = useState(() => {
        const initialState = function () {
            return tld;
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
    });

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
            <div className="tovcont">
                <img src={ti} alt="ti"/>
                <div className="tovopis">
                    {props.opis}
                </div>
            </div>
            <div className='tovcountinp'>
                <button onClick={() => {
                    if(counttov > 1){
                        setCounttov(counttov - 1)
                    }
                }}>-</button>
                <div className="tovcount">{counttov}</div>
                <button onClick={() => setCounttov(counttov + 1)}>+</button>
            </div>
            <div className="tovfut">
                <div className='tovprice'>
                    {props.price}₽
                </div>
                <div className="tovbutt">
                    <button onClick={() => {
                        if(!window.localStorage.getItem("liked")) {
                            window.localStorage.setItem("liked", String(props.id))
                            setLikeImage(tla);
                        }
                        else {
                            // @ts-ignore
                            if(!window.localStorage.getItem("liked").includes(String(props.id))) {
                                window.localStorage.setItem("liked", window.localStorage.getItem("liked") + "," + String(props.id))
                                setLikeImage(tla);
                            }
                            else {
                                // @ts-ignore
                                window.localStorage.setItem("liked", window.localStorage.getItem("liked").replace("," + String(props.id),""))
                                // @ts-ignore
                                window.localStorage.setItem("liked", window.localStorage.getItem("liked").replace(String(props.id) + ",",""))
                                // @ts-ignore
                                window.localStorage.setItem("liked", window.localStorage.getItem("liked").replace(String(props.id),""))
                                setLikeImage(tld);
                            }
                        }
                    }}>
                        <img src={LikeImage} alt="tl" className='imgtov'/>
                    </button>
                    <button onClick={() => console.log("купить товар номер :" + props.id)}>
                        <img src={tb} alt="tb" className='imgtov'/>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default KartTovar;