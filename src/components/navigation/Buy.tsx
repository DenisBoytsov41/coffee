import React from "react";
import Hader from "../Hader";
import Futer from "../Futer";
import Katalog from "../Katalog";

class Buy extends React.Component {
    render() {
        return(
            <div>
                <Hader/>
                <br/>
                <br/>
                <div className="contApp">
                    <Katalog katcount={0}/>
                </div>
                <Futer/>
            </div>
        );
    }
}

export default Buy;