import React, { useEffect, useState } from "react";
import Hader from "../Hader";
import Futer from "../Futer";
import "../../styles/basket.css"
import Katalog from "../Katalog";
import axios from "axios";
import ServHost from "../../serverHost.json";

function Liked() {
    const [Pusto, setPusto] = useState(() => "Здесь появятся товары, которые вы добавите в избранное");
    const [likedItems, setLikedItems] = useState<string[]>([]);

    const sendDataToServerUpdateLiked = async (refreshToken: string | null, liked: string | null) => {
        try {
            if (!refreshToken) {
                console.error('Refresh token is missing');
                return;
            }
            const resCheckToken = await axios.get(ServHost.host + '/checkToken', {
                params: { refreshToken }
            });
            if (resCheckToken.status === 200 && resCheckToken.data) {
                const login = resCheckToken.data.login;
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

    const UpdateDBLiked = async (likedParam?: string) => {
        const refreshToken = window.localStorage.getItem('refreshToken');
        const liked = likedParam ?? window.localStorage.getItem('liked');
        if (refreshToken) {
            await sendDataToServerUpdateLiked(refreshToken, liked || "");
        }
    };

    useEffect(() => {
        const liked = window.localStorage.getItem("liked");
        if (liked) {
            setLikedItems(liked.split(","));
        }
    }, []);

    useEffect(() => {
        if (likedItems.length === 0) {
            setPusto("Здесь появятся товары, которые вы добавите в избранное");
        } else {
            setPusto("");
        }
    }, [likedItems]);

    const handleRemoveLikedItem = (itemId: number) => {
        const newLikedItems = likedItems.filter(item => item !== String(itemId));
        setLikedItems(newLikedItems);
        const newLikedString = newLikedItems.join(",");
        window.localStorage.setItem("liked", newLikedString);
        UpdateDBLiked(newLikedString);
    };

    return (
        <div>
            <Hader />
            <br />
            <br />
            <div className="contApp">
                <div className="LikedKat">
                    ИЗБРАННОЕ
                </div>
                <br />
                <br />
                <div className="centerText">{Pusto}</div>
                <Katalog type={"liked"} katcount={0} onRemoveLikedItem={handleRemoveLikedItem} />
            </div>
            <Futer className="footer" />
        </div>
    );
}

export default Liked;
