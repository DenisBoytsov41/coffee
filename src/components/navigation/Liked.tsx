import React, {useEffect, useState} from "react";
import Hader from "../Hader";
import Futer from "../Futer";
import Katalog from "../Katalog";

function Liked(){

    const [Pusto, setPusto] = useState(() => {
        const initialState = function () {
            return "";
        }
        return initialState()
    })

    useEffect(() => {
        return () => {
            document.title = "Избранное";
        };
    }, []);

    useEffect(() => {
        if(!window.localStorage.getItem("liked")){
            setPusto("Здесь появятся товары, которые вы добавите в избранное");
        }
    });

    return(
        <div>
            <Hader/>
            <br/>
            <br/>
            <div className="contApp">
                <div className="LikedKat">
                    ИЗБРАННОЕ
                </div>
                <br/>
                <br/>
                <div>{Pusto}</div>
                <Katalog type={"liked"} katcount={0}/>
            </div>
            <Futer/>
        </div>
    );
}

export default Liked;