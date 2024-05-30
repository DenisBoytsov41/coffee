import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminItem from "./AdminItem";
import ServHost from "../serverHost.json";
import "../styles/AdminProfile.css";
import Pagination from "../components/navigation/Pagination";

function AdminProfile() {
    const [data, setData] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Number of items to display per page

    useEffect(() => {
        fetch(ServHost.host + '/tovar')
            .then(res => res.json())
            .then(res => {
                setData(res);
                setLoading(false);
            });
    }, []);

    const sendDataToServerAddItem = async (data:{ mail: string, pass: string }) => {
        try {
            const res = await axios.post(ServHost.host + '/addItem', data);
            console.log(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const Exit = () => {
        window.localStorage.removeItem("AdminLogin");
        window.location.reload();
    };

    const Add = () => {
        let a = window.localStorage.getItem("AdminLogin");
        if (a) {
            let arr = a.split(" ");
            sendDataToServerAddItem({ mail: arr[0], pass: arr[1] });
            window.location.reload();
        }
    };

    // Calculate index of the first and last items to display on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);

    // Calculate total number of pages
    const totalPages = Math.ceil((data?.length || 0) / itemsPerPage);

    return (
        <div className="admin-profile-container">
            <div className="admin-profile-header">
                <div className="admin-profile-title">Администраторский профиль</div>
                <div className="admin-profile-buttons">
                    <button onClick={Add} className="admin-profile-button">ДОБАВИТЬ</button>
                    <button onClick={Exit} className="admin-profile-button">ВЫЙТИ</button>
                </div>
            </div>
            <div className="admin-profile-info">
                <div className="admin-profile-message">
                    <p>При внесении изменений не забывайте их сохранять.</p>
                    <p>По нажатию на "СОХРАНИТЬ" происходит изменение только того товара, рядом с которым была нажата кнопка, после чего страница обновится.</p>
                    <p>ВНОСИТЕ ИЗМЕНЕНИЯ КАЖДОГО ТОВАРА ОТДЕЛЬНО.</p>
                    <p>Поля NAME и OPISANIE имеют ограничения максимум 100 и 120 символов соответственно.</p>
                </div>
                <div className="admin-profile-items">
                    {loading ? <div className="admin-profile-loading">Загрузка...</div> :
                        currentItems?.map(item => (
                            <AdminItem
                                key={item.id}
                                name={item.name}
                                opisanie={item.opisanie}
                                price={item.price}
                                id={item.id}
                                optprice={item.optprice}
                            />
                        ))
                    }
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}

export default AdminProfile;
