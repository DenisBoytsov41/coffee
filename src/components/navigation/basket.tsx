import React, {useEffect, useState} from "react";
import Hader from "../Hader";
import Futer from "../Futer";
import {Link} from "react-router-dom";
import "../../styles/basket.css"
import IMask from "imask";
import Katalog from "../Katalog";
import axios from "axios";

function Basket(){

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

    const [PustoLogo] = useState(() => {
        const initialState = function () {
            if(!window.localStorage.getItem("basket")) {
                return <div className="LikedKat">ВАША КОРЗИНА ПУСТА <br/><br/></div>
            }
            else {
                return <div></div>;
            }
        }
        return initialState()
    })

    const [Content] = useState(() => {
        const initialState = function () {
            if(!window.localStorage.getItem("basket")) {
                return <div>
                    Чтобы увидеть сохраненные в корзине товары,
                    <Link to={"/login"} className='linkHeader'>авторизуйтесь.</Link><br/><br/><br/>
                </div>
            }
            else {
                return <div className="basketContent">
                    <div className="OformlenieCont">
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
                            <br/>
                            <br/>
                            <Katalog type={'korzina'} katcount={0}/>
                            <br/>
                            <br/>
                            <div className="KorzVsego">
                                <div className="KorzVsegoText">
                                    всего {window.localStorage.getItem("backCount")} ₽
                                </div>
                                <button className="KorzVsegobutton" onClick={() => {
                                    window.localStorage.setItem("basket","")
                                    window.localStorage.setItem("backCount","0")
                                    UpdateDBBasket()
                                    window.location.reload()
                                }}>Удалить все товары</button>
                            </div>
                        </div>
                    </div>
                </div>;
            }
        }
        return initialState()
    })

    const [PustoBtn] = useState(() => {
        const initialState = function () {
            if(!window.localStorage.getItem("basket")) {
                return <div><Link to={"/buy"} className='linkHeader'>
                    <button className="ButtonPusto">Перейти в каталог</button>
                </Link></div>
            } else {
                return <div></div>;
            }
        }
        return initialState()
    })

    useEffect(() => {
        return () => {
            document.title = "Оформление заказа";
        };
    }, []);

    useEffect(() => {
        if (document.getElementById('tel')){
            const element = document.getElementById('tel');
            const maskOptions = {
                mask: '+7(000)000-00-00',
                lazy: false
            }
            // @ts-ignore
            const mask = new IMask(element, maskOptions);
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