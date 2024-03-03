import React from "react";
import Hader from "../Hader";
import Futer from "../Futer";

class Basket extends React.Component {
    render() {
        return(
            <div>
                <Hader/>
                корзина
                <Futer/>
            </div>
        );
    }
}

export default Basket;