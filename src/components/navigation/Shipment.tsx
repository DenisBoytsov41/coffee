import React, {useEffect} from "react";
import Hader from "../Hader";
import Futer from "../Futer";
import "../../styles/Shipment.css"
import backSh from "../../images/dostavka.jpg";
import cdek from "../../images/CDEK.png";

function Shipment(){

    useEffect(() => {
        return () => {
            document.title = "Условия работы";
        };
    }, []);

    return(
        <div>
            <Hader/>
            <img src={backSh} alt="back" className="imgbackSh"/>
            <div className="imgText">
                ДОСТАВКА И ОПЛАТА
            </div>
            <div className="ContentSh">
                <div className="Dostavka">
                    <div className="Dost1">
                        <div className="ZagolSh">
                            ДОСТАВКА
                        </div>
                        <div className="textSh">
                            Мы сотрудничаем с крупными транспортными компаниями и доставляем заказы до двери,
                            пунктов
                            выдачи
                            и
                            постаматов. Почти всегда делаем это за наш счёт.
                            Стоимость доставки в труднодоступные/удаленные города и регионы России и другие страны
                            рассчитывается автоматически в корзине.
                        </div>
                    </div>
                    <div className="Dost2">
                        <div className="ZagolSh">
                            Служба доставки
                            <img src={cdek} alt="cdek" className="imgcdek"/>
                        </div>
                    </div>
                </div>
                <br/>
                <br/>
                <div className="ZagolSh">
                    ОПЛАТА
                </div>
                <div className="textSh">
                    Минимальная сумма заказа — 800 рублей. Оплатить заказ можно онлайн на сайте или при получении.
                    Оплата на сайте происходит с использованием банковских карт систем МИР, VISA или Mastercard.
                    Принимаем оплату через ЮMoney.
                </div>
            </div>
            <Futer/>
        </div>
    );
}

export default Shipment;