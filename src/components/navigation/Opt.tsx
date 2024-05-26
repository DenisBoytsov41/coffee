import React, {useEffect} from "react";
import Hader from "../Hader";
import Futer from "../Futer";
import Katalog from "../Katalog";

function Opt(){

    const tel = "+7(915)923-81-62";
    const Email = "info@godinecoffee.ru";
    return(
        <div>
            <Hader/>
            <br/>
            <br/>
            <div className="contApp">
                <div className="ZagolKat">
                    Для оформления заказа по оптовым ценам нужно связаться с менеджером по телефону {tel} или написать на почту {Email} .
                     Оптовый заказ считается от 10 кг.
                     В перечне приведены цены за 1кг и 250гр читайте в названии.
                </div>
                <br/>
                <br/>
                <Katalog type={"opt"} katcount={0}/>
            </div>
            <Futer className="footer"/>
        </div>
    );
}

export default Opt;