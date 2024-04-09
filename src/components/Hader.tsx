import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import City from "./City";
import Contacts from "./Contacts";
import Vhod from "./Vhod";
import '../styles/Header.css';
import logo from '../images/logo.png';
import like from '../images/Like.png';
import bask from '../images/Basket.png';
import HamburgerMenu from "./HamburgerMenu";
import axios from "axios";
import profile from "../images/Profile.png";
import ServHost from "../serverHost.json"

function Hader(){

    const sendDataToServer = async (data:{ basket:string }) => {
        try {
            const res = await axios.post(ServHost.host + '/CountBasket', data);
            window.localStorage.setItem('backCount', res.data)
        } catch (error) {
            console.error(error);
        }
    };

    const UpdateCount = () => {
        let count = 0;
        let a = window.localStorage.getItem('basket')
        if(a !== "" && a !== null ){
            // @ts-ignore
            let arr = a.split(",")
            for (let i = 0; i < arr.length; i++){
                count = count + Number(arr[i].split(":")[1]);
            }
        }
        return count;
    }

    const UpdateBaskCount = () => {
        let count = 0;
        let a = window.localStorage.getItem('backCount')
        if(a !== null && a !== ""){
            count = Number(a);
        }
        return count;
    }

    const [counttov, setCounttov] = useState(() => {
        const initialState = function () {
            return 0;
        }
        return initialState()
    })

    const [backCount, setBackCount] = useState(() => {
        const initialState = function () {
            return 0;
        }
        return initialState()
    })

    const sendDataToServerCheckUser = async (data:{ mail: string, pass: string }) => {
        try {
            const res = await axios.post('http://localhost:3001/api/checkUser', data);
            if(res.data.res){
                setLoginProfile(
                    <div className="rightHeader">
                        <img src={profile} alt="profile" className="imgVH"/>
                        <Link to={"/profile"} className='linkHeader'>Профиль</Link>
                        <button className='linkHeader Comissioner btnCont' onClick={() => {
                            window.localStorage.removeItem('Login')
                            window.location.reload()
                        }}>Выйти</button>
                    </div>
                )
                if(window.localStorage.getItem('basket') && window.localStorage.getItem('basket') !== ""){
                    // @ts-ignore
                    sendDataToServer({ basket:window.localStorage.getItem('basket') })
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const sendDataToServerGetBasket = async (data:{ mail: string, pass: string }) => {
        try {
            const res = await axios.post('http://localhost:3001/api/GetBasket', data);
            if(res.data.res !== "" && res.data.res !== null && res.data.res !== undefined ){
                window.localStorage.setItem('basket', res.data.res)
                let a = window.localStorage.getItem('Login')
                if(a){
                    sendDataToServerCheckUser({ mail: a.split(" ")[0], pass: a.split(" ")[1] })
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const [loginProfile, setLoginProfile] = useState(() => {
        const initialState = function () {
            let a = window.localStorage.getItem('Login')
            if(a){
                sendDataToServerCheckUser({ mail: a.split(" ")[0], pass: a.split(" ")[1] })
                sendDataToServerGetBasket({ mail: a.split(" ")[0], pass: a.split(" ")[1] })
            }
            return (
                <div className="rightHeader">
                    <Vhod/>
                    <Link to={"/reg"} className='linkHeader'>Регистрация</Link>
                </div>
            )
        }
        return initialState()
    })

    useEffect(() => {

        const interval = setInterval(() => {
            setCounttov(UpdateCount);
            setBackCount(UpdateBaskCount);

        }, 100);

        return () => clearInterval(interval);
    }, []);

    return(
        <div className="HeaderRezerv">
            <div className="HeaderBack"></div>
            <div className="mainHeader">
                <div className="contHeader hideMobile">
                    <div className="leftHeader">
                        <City/>
                        <Contacts/>
                        <Link to={"/opt"} className='linkHeader'>Оптовые цены</Link>
                    </div>
                    {loginProfile}
                </div>
                <div className="line hideMobile"></div>
                <div className="contHeader">
                    <div className="leftHeader">
                        <Link to={"/"} className='linkHeader'>
                            <img src={logo} alt="logo"/>
                        </Link>
                        <Link to={"/buy"} className='linkHeader  hideMobile'>Купить</Link>
                        <Link to={"/faq"} className='linkHeader  hideMobile'>Частые вопросы</Link>
                        <Link to={"/shipment"} className='linkHeader  hideMobile'>Условия работы</Link>
                    </div>
                    <div className="rightHeader">
                        <Link to={"/liked"} className='linkHeader'>
                            <div className='baskHeader'>
                                <img src={like} alt="like" className="imgtov"/>
                            </div>
                        </Link>
                        <Link to={"/basket"} className='linkHeader'>
                            <div className='baskHeader'>
                                <img src={bask} alt="bask" className="imgtov"/>
                                <div className='baskinfoHeader'>
                                    <label>{backCount} ₽</label>
                                    <label>{counttov} тов.</label>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="rightHeaderMobile">
                        <HamburgerMenu/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hader;