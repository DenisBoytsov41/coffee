import React, {useEffect} from "react";
import Hader from "../Hader";
import Futer from "../Futer";

function Basket(){

    useEffect(() => {
        return () => {
            document.title = "Оформление заказа";
        };
    }, []);

    return(
        <div>
            <Hader/>
            корзина
            <Futer/>
        </div>
    );
}

export default Basket;