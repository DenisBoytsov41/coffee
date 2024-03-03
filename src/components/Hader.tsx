import React from "react";
import {Link} from "react-router-dom";
import City from "./City";
import Contacts from "./Contacts";
import Vhod from "./Vhod";
import '../styles/Header.css';
import logo from '../images/logo.png';
import like from '../images/Like.png';
import bask from '../images/Basket.png';

class Hader extends React.Component {
    render() {
        return(
            <div className="HeaderRezerv">
                <div className="HeaderBack"></div>
                <div className="mainHeader">
                    <div className="contHeader">
                        <div className="leftHeader">
                            <City/>
                            <Contacts/>
                            <Link to={"/opt"} className='linkHeader'>Оптовый сайт</Link>
                        </div>
                        <div className="rightHeader">
                            <Vhod/>
                            <Link to={"/reg"} className='linkHeader'>Регистрация</Link>
                        </div>
                    </div>
                    <div className="line"></div>
                    <div className="contHeader">
                        <div className="leftHeader">
                            <Link to={"/"} className='linkHeader'>
                                <img src={logo} alt="logo"/>
                            </Link>
                            <Link to={"/buy"} className='linkHeader'>Купить</Link>
                            <Link to={"/faq"} className='linkHeader'>Частые вопросы</Link>
                            <Link to={"/shipment"} className='linkHeader'>Условия работы</Link>
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
                                        <label>0 ₽</label>
                                        <label>0 тов.</label>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Hader;