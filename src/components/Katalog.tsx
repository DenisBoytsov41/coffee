import React, { useEffect, useState, useCallback } from "react";
import KartTovar from "./KartTovar";
import '../styles/katalog.css';
import KartTovarOpt from "./KartTovOpt";
import ti from "../images/tovimage.jpg";
import KartKorz from "./KartKorz";
import ServHost from "../serverHost.json";

interface Props {
    type: string;
    katcount: number;
    onRemoveLikedItem?: (itemId: number) => void; // добавляем проп для удаления из избранного
}

function Katalog(props: Props) {
    const [data, setData] = useState<any[]>([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        fetch(ServHost.host + '/tovar')
            .then(res => res.json())
            .then(res => setData(res));
    }, []);

    const handleDelete = useCallback((id: number) => {
        setData(prevData => prevData.filter(item => item.id !== id));
    }, []);

    useEffect(() => {
        // Trigger re-render when the refresh state changes
    }, [refresh]);

    return (
        <div className='katalog'>
            {LoadKatalog(props.type, props.katcount, data, handleDelete, props.onRemoveLikedItem).map((el, index) => (
                <div className="ItemKatalog" key={index}>{el}</div>
            ))}
        </div>
    );
}

export default Katalog;

function LoadKatalog(type: string, count: number, data: any[], onDelete: (id: number) => void, onRemoveLikedItem?: (itemId: number) => void) {
    const elementsArray = [];
    const datcount = data.length;

    if (count === 0 || count > datcount) {
        count = datcount;
    }

    if (type === 'opt') {
        for (let i = 0; i < count; i++) {
            const item = data[i];
            elementsArray.push(
                <KartTovarOpt 
                    key={item?.id || i}
                    name={item?.name || "Loading..."} 
                    opis={item?.opisanie || "Loading..."} 
                    price={item?.optprice || "Loading..."} 
                    id={item?.id || "Loading..."} 
                />
            );
        }
    }

    if (type === 'liked') {
        const likedItems = window.localStorage.getItem("liked")?.split(",") || [];
        for (let i = 0; i < count; i++) {
            const item = data[i];
            if (likedItems.includes(String(item.id))) {
                elementsArray.push(
                    <KartTovar 
                        key={item?.id || i}
                        name={item?.name || "Loading..."} 
                        opis={item?.opisanie || "Loading..."} 
                        price={item?.price || "Loading..."} 
                        id={item?.id || "Loading..."} 
                        image={ti}
                        onRemoveLikedItem={onRemoveLikedItem} // передаем проп далее
                    />
                );
            }
        }
    }

    if (type === 'korzina') {
        const basketItems = window.localStorage.getItem("basket")?.split(",") || [];
        for (let i = 0; i < count; i++) {
            const item = data[i];
            if (basketItems.some(basketItem => basketItem.startsWith(String(item.id) + ":"))) {
                elementsArray.push(
                    <KartKorz 
                        key={item?.id || i}
                        name={item?.name || "Loading..."} 
                        price={item?.price || "Loading..."} 
                        id={item?.id || "Loading..."} 
                        image={ti}
                        onDelete={onDelete}
                    />
                );
            }
        }
    }

    if (type === '') {
        for (let i = 0; i < count; i++) {
            const item = data[i];
            elementsArray.push(
                <KartTovar 
                    key={item?.id || i}
                    name={item?.name || "Loading..."} 
                    opis={item?.opisanie || "Loading..."} 
                    price={item?.price || "Loading..."} 
                    image={ti}
                    id={item?.id || "Loading..."} 
                />
            );
        }
    }

    return elementsArray;
}
