import React, {useState} from "react";
import '../styles/katalog.css';
import ti from "../images/tovimage.jpg";
import tb from "../images/tovbuy.jpg";
import tl from "../images/tovlike.jpg";

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