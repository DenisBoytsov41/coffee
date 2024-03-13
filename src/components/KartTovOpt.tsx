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

function KartTovarOpt(props: Props) {
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

            <div className="optprice">
                {props.price}₽
            </div>
        </div>
    );
}

export default KartTovarOpt;