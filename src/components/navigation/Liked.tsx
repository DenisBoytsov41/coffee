import React, {useEffect, useState} from "react";
import Hader from "../Hader";
import Futer from "../Futer";
import "../../styles/basket.css"
import Katalog from "../Katalog";
import axios from "axios";
import ServHost from "../../serverHost.json";

function Liked(){

    const [Pusto, setPusto] = useState(() => {
        const initialState = function () {
            return "";
        }
        return initialState()
    })
    const sendDataToServerUpdateLiked= async (refreshToken: string | null, liked: string | null) => {
        try {
            if (!refreshToken) {
                console.error('Refresh token is missing');
                return;
            }
            // Проверяем токен на сервере
            const resCheckToken = await axios.get(ServHost.host + '/checkToken', {
                params: { refreshToken }
            });
            if (resCheckToken.status === 200 && resCheckToken.data) {
                const login = resCheckToken.data.login;
                // Отправляем данные для обновления корзины
                const res = await axios.post(ServHost.host + '/UpdateLiked', { login, items: liked || "" });
                if (res.data.res !== "") {
                    console.log(res.data.res);
                }
            } else {
                console.error('Invalid or expired refresh token');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const UpdateDBLiked = async (basketParam?: string) => {
        const refreshToken = window.localStorage.getItem('refreshToken');
        const liked = basketParam ?? window.localStorage.getItem('liked');
        if (refreshToken) {
            await sendDataToServerUpdateLiked(refreshToken, liked || "");
        }
    };

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
                <div className="centerText">{Pusto}</div>
                <Katalog type={"liked"} katcount={0}/>
            </div>
            <Futer className="footer"/>
        </div>
    );
}

export default Liked;