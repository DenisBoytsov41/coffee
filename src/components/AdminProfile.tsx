import React, { useEffect, useState } from "react";
import axios from "axios";
import ServHost from "../serverHost.json";
import "../styles/AdminProfile.css";
import Pagination from "../components/navigation/Pagination";
import UniversalTableItem from "./UniversalTableItem";
import Cookies from "js-cookie";

interface AdminProfileProps {
    onLogout: () => void;
}
interface Product {
    id: number;
    name: string;
    opisanie: string;
    price: number;
    optprice: number;
    imagePath: string;
}

interface User {
    login: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    phone: string;
}

interface UserPermission {
    login: string;
    access_level: string;
}

type DataType = Product[] | User[] | UserPermission[];

function AdminProfile({ onLogout }: AdminProfileProps) {
    const [data, setData] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedButton, setSelectedButton] = useState('tovar');
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = Cookies.get("authToken");
                const response = await axios.get(ServHost.host + '/tovar', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const sendDataToServerAddItem = async (data: { refreshToken: string, name: string, opisanie: string, price: number, optprice: number, PhotoPath: string }) => {
        try {
            const token = Cookies.get("authToken");
            const res = await axios.post(ServHost.host + '/addItem', data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(res.data);
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    const sendDataToServerDelete = async (id: number) => {
        try {
            const token = Cookies.get("authToken");
            const res = await axios.post(ServHost.host + '/deleteItem', { id }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(res.data);
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };
    const fetchData = async (endpoint: string) => {
        try {
            const token = Cookies.get("authToken");
            setSelectedButton(endpoint);
            const response = await axios.get(ServHost.host + endpoint, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    const sendDataToServerUpdate = async (itemData: any) => {
        try {
            const token = Cookies.get("authToken");
            const res = await axios.post(ServHost.host + '/UpdateItem', itemData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(res.data);
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const Exit = () => {
        onLogout();
        Cookies.remove("authToken");
        window.location.reload();
    };

    const Add = (addItem: Function, type: string) => {
        let endpoint = '';
        let data = {};
    
        if (type === 'tovar') {
            endpoint = '/addItem';
            data = { refreshToken: localStorage.getItem('refreshToken'), name: '', opisanie: '', price: 0, optprice: 0, PhotoPath: '' 
             };
        } else if (type === 'users') {
            endpoint = '/addUser';
            data = {};
        } else if (type === 'permissions') {
            endpoint = '/addPermission';
            data = {};
        }
    
        addItem(data, endpoint);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil((data?.length || 0) / itemsPerPage);

    return (
        <div className="admin-profile-container">
            <div className="admin-profile-header">
                <div className="admin-profile-title">Администраторский профиль</div>
                <div className="admin-profile-buttons">
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
                <div className="admin-profile-buttons-main">
                    <button onClick={() => fetchData('/tovar')} className="admin-profile-button">Товары</button>
                    <button onClick={() => fetchData('/users')} className="admin-profile-button">Пользователи</button>
                    <button onClick={() => fetchData('/permissions')} className="admin-profile-button">Права пользователей</button>
                    <button onClick={() => Add(sendDataToServerAddItem, selectedButton)} className="admin-profile-button">ДОБАВИТЬ</button>
                </div>
                <div className="admin-profile-items">
                    {loading ? <div className="admin-profile-loading">Загрузка...</div> :
                        currentItems?.map(item => (
                            <UniversalTableItem
                                key={item.id}
                                data={item}
                                fields={[
                                    { label: "Id", key: "id", type: "number" },
                                    { label: "Name", key: "name", type: "text" },
                                    { label: "Description", key: "opisanie", type: "text" },
                                    { label: "Price", key: "price", type: "number" },
                                    { label: "Opt Price", key: "optprice", type: "number" }
                                ]}
                                imagePathField="imagePath"
                                allowImageUpload={true}
                                onUpdate={sendDataToServerUpdate}
                                onDelete={() => sendDataToServerDelete(item.id)}
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
