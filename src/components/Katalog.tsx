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

interface Item {
    id: number;
    name: string;
    opisanie: string;
    price: number;
    optprice?: number;
}

function Katalog(props: Props) {
    const [data, setData] = useState<Item[]>([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        fetch(ServHost.host + '/tovar')
            .then(res => res.json())
            .then(res => setData(res));
    }, []);

    const handleDelete = useCallback((id: number) => {
        setData(prevData => prevData.filter(item => item.id !== id));
    }, []);

    return (
        <div className='katalog'>
            {LoadKatalog(props.type, props.katcount, data, handleDelete, props.onRemoveLikedItem).map((el, index) => (
                <div className="ItemKatalog" key={index}>{el}</div>
            ))}
        </div>
    );
}

export default Katalog;

function LoadKatalog(type: string, count: number, data: Item[], onDelete: (id: number) => void, onRemoveLikedItem?: (itemId: number) => void) {
    const elementsArray = [];
    const datcount = data.length;

    if (count === 0 || count > datcount) {
        count = datcount;
    }

    const isValidItem = (item: Item) => item.name && item.price && item.price > 0;

    if (type === 'opt') {
        for (let i = 0; i < count; i++) {
            const item = data[i];
            if (isValidItem(item)) {
                elementsArray.push(
                    <KartTovarOpt 
                        key={item.id}
                        name={item.name} 
                        opis={item.opisanie} 
                        price={item.optprice || 0} 
                        id={item.id} 
                    />
                );
            }
        }
    }

    if (type === 'liked') {
        const likedItems = window.localStorage.getItem("liked")?.split(",") || [];
        for (let i = 0; i < count; i++) {
            const item = data[i];
            if (likedItems.includes(String(item.id)) && isValidItem(item)) {
                elementsArray.push(
                    <KartTovar 
                        key={item.id}
                        name={item.name} 
                        opis={item.opisanie} 
                        price={item.price} 
                        id={item.id} 
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
            if (basketItems.some(basketItem => basketItem.startsWith(String(item.id) + ":")) && isValidItem(item)) {
                elementsArray.push(
                    <KartKorz 
                        key={item.id}
                        name={item.name} 
                        price={item.price} 
                        id={item.id} 
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
            if (isValidItem(item)) {
                elementsArray.push(
                    <KartTovar 
                        key={item.id}
                        name={item.name} 
                        opis={item.opisanie} 
                        price={item.price} 
                        image={ti}
                        id={item.id} 
                    />
                );
            }
        }
    }

    return elementsArray;
}
