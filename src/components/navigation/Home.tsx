import React, {useEffect} from "react";
import Hader from "../Hader";
import Futer from "../Futer";
import Katalog from "../Katalog";
import {Link} from "react-router-dom";
import "../../App.css"
import "../../styles/Home.css"
// @ts-ignore
// import back from "../../videos/back.webm";
import back from "../../images/back.jpg";
import ap from "../../images/AllPrice.jpg";

function Home(){

    useEffect(() => {
        return () => {
            document.title = "Интернет-магазин кофе из эфиопии, купить от Godinecoffee";
        };
    }, []);

    return(
        <div>
            <Hader/>
            <div className="Content">
                {/*<video autoPlay muted loop className="imgback">*/}
                {/*    <source src={back} type='video/webm'/>*/}
                {/*    Ваш браузер не поддерживает воспроизведение видео.*/}
                {/*</video>*/}
                <img src={back} alt="ap" className='imgback'/>
                <div className="deviz">
                    <div className="devizbol">ВКУСНЫЙ КОФЕ ИЗ</div>
                    <div className="devizbol">ЭФИОПИИ.</div>
                    <div className="devizmal">МЫ ЛЮБИМ ТО, ЧТО ДЕЛАЕМ И ЦЕНИМ ПРОДУКТ, КОТОРЫЙ ПРОДАЁМ.</div>
                </div>
                <div className="contApp">
                    <Katalog type={''} katcount={6}/>
                    <br/>
                    <br/>
                    <Link to={"/buy"} className='linkHome'>
                        <img src={ap} alt="ap" className='imgbuy'/>
                        Просмотреть весь кофе
                    </Link>
                </div>
            </div>
            <Futer/>
        </div>
    );
}

export default Home;