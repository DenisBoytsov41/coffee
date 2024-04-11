import React, {useEffect} from "react";
import Hader from "../Hader";
import Futer from "../Futer";
import Katalog from "../Katalog";

function Buy(){

    return(
        <div>
            <Hader/>
            <br/>
            <br/>
            <div className="contApp">
                <Katalog type={''} katcount={0}/>
            </div>
            <Futer/>
        </div>
    );
}

export default Buy;