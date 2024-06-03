import React from "react";
import '../styles/katalog.css';

interface Props {
    name: string;
    opis: string;
    price: number;
    id: number;
    image: string;
}

function KartTovarOpt(props: Props) {
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
                    <img src={props.image} alt="tovimage"/>
                    <div className="tovopis">
                        {props.opis}
                    </div>
                </div>
                <br/>
                <div className="optprice">
                    {props.price}₽
                </div>
            </div>
        </div>
    );
}

export default KartTovarOpt;
