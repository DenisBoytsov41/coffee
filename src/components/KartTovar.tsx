import React, {useState} from "react";
import '../styles/katalog.css';
import ti from "../images/tovimage.png";
import tb from "../images/tovbuy.png";
import tl from "../images/tovlike.png";

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
                    <button onClick={() => console.log("лайк товар номер :" + props.id)}>
                        <img src={tl} alt="tl" className='imgtov'/>
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