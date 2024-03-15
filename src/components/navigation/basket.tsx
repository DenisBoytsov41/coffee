import React, {useEffect, useState} from "react";
import Hader from "../Hader";
import Futer from "../Futer";
import {Link} from "react-router-dom";
import "../../styles/basket.css"
import Katalog from "../Katalog";

function Basket(){

    const [PustoLogo, setPustoLogo] = useState(() => {
        const initialState = function () {
            return <div></div>;
        }
        return initialState()
    })

    const [Content, setContent] = useState(() => {
        const initialState = function () {
            return <div></div>;
        }
        return initialState()
    })

    const [PustoBtn, setPustoBtn] = useState(() => {
        const initialState = function () {
            return <div></div>;
        }
        return initialState()
    })

    useEffect(() => {
        return () => {
            document.title = "Оформление заказа";
        };
    }, []);

    useEffect(() => {
        if(!window.localStorage.getItem("basket")){
            setPustoLogo(<div className="LikedKat">ВАША КОРЗИНА ПУСТА <br/><br/></div>)
            setContent(<div>Чтобы увидеть сохраненные в корзине товары,<Link to={"/login"} className='linkHeader'>авторизуйтесь.</Link><br/><br/><br/></div>)
            setPustoBtn(<div><Link to={"/buy"} className='linkHeader'><button className="ButtonPusto">Перейти в каталог</button></Link></div>)
        }
        else {
            setPustoLogo(<div></div>)
            setPustoBtn(<div></div>)
            setContent(<div></div>)
        }
    });

    return (
        <div>
            <Hader/>
            <br/>
            <br/>
            <div className="contApp">
                {PustoLogo}
                {Content}
                {PustoBtn}
            </div>
            <Futer/>
        </div>
    );
}

export default Basket;