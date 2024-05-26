import React from "react";
import { Link } from "react-router-dom";
import '../styles/Futer.css';
import tg from "../images/TG.jpg";
import vk from "../images/VK.jpg";

interface FuterProps {
    className?: string;
}

const Futer: React.FC<FuterProps> = ({ className }) => {
    return (
        <div className={className}>
            <div className="mainFuter">
                <div className="contFuter">
                    <div className="leftFuter">
                        <div className="contdopFuter">
                            <label>ПОМОЩЬ</label>
                            <br />
                            <Link to="/faq" className='linkFuter'>Вопрос-ответ</Link>
                            <Link to="/shipment" className='linkFuter'>Доставка и оплата</Link>
                        </div>
                        <div className="contdopFuter">
                            <label>КОМПАНИЯ</label>
                            <br />
                            <Link to="/about" className='linkFuter'>О компании</Link>
                            <Link to="/opt" className='linkFuter'>Перейти на оптовый сайт</Link>
                        </div>
                        <div className="contdopFuter">
                            <label>КАТАЛОГ</label>
                            <br />
                            <Link to="/buy" className='linkFuter'>Кофе</Link>
                            <Link to="/buy" className='linkFuter'>Аксессуары</Link>
                        </div>
                    </div>
                    <div className="rightFuter">
                        <label>+7 (915) 923-81-62</label>
                        <label>info@godinecoffee.ru</label>
                        <div className="contactsFuter">
                            <div>
                                <a href="https://web.telegram.org/" target="_blank" hidden={true}>
                                    <img src={tg} alt="tg" className='imgtov' />
                                </a>
                            </div>
                            <div>
                                <a href="https://vk.com/" target="_blank" hidden={true}>
                                    <img src={vk} alt="vk" className='imgtov' />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="podpis">
                    <label>© 2024 «GodineCoffee»</label>
                </div>
            </div>
        </div>
    );
};

export default Futer;
