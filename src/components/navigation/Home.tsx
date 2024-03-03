import React from "react";
import Hader from "../Hader";
import Futer from "../Futer";
import Katalog from "../Katalog";
import {Link} from "react-router-dom";
import "../../App.css"
import "../../styles/Home.css"
import back from "../../images/back.png";
import ap from "../../images/AllPrice.png";

class Home extends React.Component {
    render() {
        return(
            <div>
                <Hader/>
                <div className="Content">
                    <img src={back} alt="back" className="imgback"/>
                    <div className="deviz">
                        <div className="devizbol">ВКУСНЫЙ КОФЕ ИЗ</div>
                        <div className="devizbol">ЭФИОПИИ.</div>
                        <div className="devizmal">МЫ ЛЮБИМ ТО, ЧТО ДЕЛАЕМ И ЦЕНИМ ПРОДУКТ, КОТОРЫЙ ПРОДАЁМ.</div>
                    </div>
                    <div className="contApp">
                        <Katalog katcount={6}/>
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
}

export default Home;