import React, {useEffect, useState} from "react";
import Hader from "../Hader";
import Futer from "../Futer";
import {Link} from "react-router-dom";
import "../../styles/basket.css"
import IMask from "imask";

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
            setContent(
                <div className="basketContent">
                    <div className="Oformlenie">
                        <div className="paddingCont">
                            <br/>
                            <div className="baskZagol whiteText">ОФОРМЛЕНИЕ</div>
                            <br/>
                            <br/>
                            <div className="baskText grayText">Покупатель</div>
                            <br/>
                            <div className="inpGor">
                                <div className="TelBask">
                                    <input type="text" placeholder="Имя и Фамилия" className="inpBasklog whiteText"/>
                                    <input type="text" placeholder="E-mail" className="inpBasklog whiteText"/>
                                </div>
                                <div className="TelBask">
                                    <input type="text" placeholder="Телефон" id="tel" className="inpBasklog whiteText"/>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <br/>
                        <br/>
                        <div className="AddrDost">
                            ИНТЕГРАЦИЯ CDEK
                        </div>
                        <br/>
                        <br/>
                        <br/>
                        <div className="AddrDost">
                            ИНТЕГРАЦИЯ ЮКАССА
                        </div>
                    </div>
                    <div className="Bask">
                        <div className="paddingCont">
                            <br/>
                            <div className="baskZagol">КОРЗИНА</div>
                        </div>
                    </div>
                </div>
            )
            if (document.getElementById('tel')){
                const element = document.getElementById('tel');
                const maskOptions = {
                    mask: '+7(000)000-00-00',
                    lazy: false
                }
                // @ts-ignore
                const mask = new IMask(element, maskOptions);
            }
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