import React, { useEffect, useState, useCallback } from "react";
import KartTovar from "./KartTovar";
import '../styles/katalog.css';
import KartTovarOpt from "./KartTovOpt";
import Pagination from "../components/navigation/Pagination";
import ti from "../images/tovimage.jpg";
import KartKorz from "./KartKorz";
import ServHost from "../serverHost.json";

interface Props {
    type: string;
    katcount: number;
    pagination?: boolean;
    itemsPerPage?: number;
    onRemoveLikedItem?: (itemId: number) => void;
    searchEnabled?: boolean;
}


interface Item {
    id: number;
    name: string;
    opisanie: string;
    price: number;
    optprice?: number;
    PhotoPath?: string;
}

function Katalog(props: Props) {
    const [data, setData] = useState<Item[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchData, setSearchData] = useState<Item[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetch(ServHost.host + '/tovar')
            .then(res => res.json())
            .then(res => {
                setData(res);
                setSearchData(res);
                setTotalItems(res.length); // Устанавливаем общее количество элементов при загрузке данных
                setTotalPages(Math.ceil(res.length / (props.itemsPerPage || 10))); // Рассчитываем общее количество страниц
            });
    }, []);

    const handleDelete = useCallback((id: number) => {
        setData(prevData => prevData.filter(item => item.id !== id));
        setSearchData(prevData => prevData.filter(item => item.id !== id));
        setTotalItems(prevTotal => prevTotal - 1); // Уменьшаем общее количество элементов при удалении элемента
        setTotalPages(Math.ceil((totalItems - 1) / (props.itemsPerPage || 10))); // Пересчитываем общее количество страниц
    }, [totalItems, props.itemsPerPage]);

    useEffect(() => {
        const filteredData = data.filter(item => {
            return (
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.opisanie.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
        setSearchData(filteredData);
        setTotalItems(filteredData.length); // Устанавливаем общее количество элементов после фильтрации
        setTotalPages(Math.ceil(filteredData.length / (props.itemsPerPage || 10))); // Пересчитываем общее количество страниц после фильтрации
    }, [data, searchQuery, props.itemsPerPage]);

    let currentItems = props.searchEnabled ? searchData : data;

    if (props.pagination !== false) {
        const itemsPerPage = props.itemsPerPage || 10;
        const currentPageIndex = currentPage - 1;
        const indexOfLastItem = Math.min((currentPageIndex + 1) * itemsPerPage, totalItems);
        const indexOfFirstItem = Math.min(currentPageIndex * itemsPerPage, indexOfLastItem);
        currentItems = currentItems.slice(indexOfFirstItem, indexOfLastItem);
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div>  
            <div className="search">
                {props.searchEnabled && (
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Поиск..."
                        className="search-input"
                    />
                )}
            </div>
            
            <div className='katalog'>
                {LoadKatalog(props.type, props.katcount, currentItems, handleDelete, props.onRemoveLikedItem)}
            </div>
            <div id='pagin'>
                {props.pagination && 
                    <Pagination 
                        currentPage={currentPage} 
                        totalPages={totalPages} // Используем новое состояние totalPages
                        onPageChange={paginate} 
                    />
                }
            </div>
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
                        image={item.PhotoPath ? item.PhotoPath.replace('blob:', '') : ti}
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
                        image={item.PhotoPath ? item.PhotoPath.replace('blob:', '') : ti}
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
                        image={item.PhotoPath ? item.PhotoPath.replace('blob:', '') : ti}
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
                        image={item.PhotoPath ? item.PhotoPath.replace('blob:', '') : ti}
                        id={item.id} 
                />
            );
        }
    }
}

return elementsArray;
}