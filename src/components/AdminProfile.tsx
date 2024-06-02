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
    const [data, setData] = useState<DataType | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedButton, setSelectedButton] = useState('/tovar');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = Cookies.get("authToken");
                const response = await axios.get(ServHost.host + selectedButton, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setData(response.data);
                setSuccessMessage('Успешный запрос');
                setTimeout(() => {
                    setSuccessMessage(null);
                }, 2000);
                setLoading(false);
            } catch (error: any) {
                setErrorMessage(error.response.data);
                setTimeout(() => {
                    setErrorMessage(null);
                }, 2000);
                console.error(error);
            }
        };
        fetchData();
    }, [selectedButton]);

    const sendDataToServerAddItem = async (data: { refreshToken: string, name: string, opisanie: string, price: number, optprice: number, PhotoPath: string }) => {
        try {
            if (data.price < 0 || data.optprice < 0) {
                setErrorMessage('Цена не может быть отрицательной.');
                setTimeout(() => {
                    setErrorMessage(null);
                }, 2000);
                return;
            }
            const token = Cookies.get("authToken");
            const res = await axios.post(ServHost.host + '/addItem', data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(res.data);
            setSuccessMessage('Товар успешно добавлен.');
            setTimeout(() => {
                setSuccessMessage(null);
            }, 2000);
            fetchData(selectedButton);
        } catch (error: any) {
            setErrorMessage(error.response.data);
            setTimeout(() => {
                setErrorMessage(null);
            }, 2000);
            console.error(error);
        }
    };

    const sendDataToServerAddUser = async (data: { login: string, firstName: string, lastName: string, email: string, gender: string, phone: string }) => {
        try {
            const token = Cookies.get("authToken");
            const res = await axios.post(ServHost.host + '/addUser', data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(res.data);
            setSuccessMessage('Пользователь успешно добавлен');
            setTimeout(() => {
                setSuccessMessage(null);
            }, 2000);
            fetchData(selectedButton);
        } catch (error: any) {
            setErrorMessage(error.response.data);
            setTimeout(() => {
                setErrorMessage(null);
            }, 2000);
            console.error(error);
        }
    };

    const sendDataToServerAddPermission = async (data: { login: string, access_level: string }) => {
        try {
            const token = Cookies.get("authToken");
            const res = await axios.post(ServHost.host + '/addPermission', data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(res.data);
            setSuccessMessage('Права успешно добавлены');
            setTimeout(() => {
                setSuccessMessage(null);
            }, 2000);
            fetchData(selectedButton);
        } catch (error: any) {
            setErrorMessage(error.response.data);
            setTimeout(() => {
                setErrorMessage(null);
            }, 2000);
            console.error(error);
        }
    };

    const sendDataToServerDelete = async (id: number | string) => {
        try {
            const token = Cookies.get("authToken");
            const refreshToken = window.localStorage.getItem('refreshToken');
            const res = await axios.post(ServHost.host + '/deleteItem', { refreshToken, id }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(res.data);
            setSuccessMessage('Товар успешно удалён');
            setTimeout(() => {
                setSuccessMessage(null);
            }, 2000);
            fetchData(selectedButton);
        } catch (error: any) {
            setErrorMessage(error.response.data);
            setTimeout(() => {
                setErrorMessage(null);
            }, 2000);
            console.error(error);
        }
    };

    const fetchData = async (endpoint: string) => {
        try {
            setLoading(true);
            const token = Cookies.get("authToken");
            setSelectedButton(endpoint);
            const response = await axios.get(ServHost.host + endpoint, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setData(response.data);
            setLoading(false);
            setSuccessMessage('Запрос успешно выполнен');
            setTimeout(() => {
                setSuccessMessage(null);
            }, 2000);
        } catch (error: any) {
            setErrorMessage(error.response.data);
            setTimeout(() => {
                setErrorMessage(null);
            }, 2000);
            setLoading(false);
            console.error(error);
        }
    };

    const sendDataToServerUpdate = async (itemData: any) => {
        try {
            if (itemData.price < 0 || itemData.optprice < 0) {
                console.error('Цена не может быть отрицательной.');
                return;
            }
            const token = Cookies.get("authToken");
            const refreshToken = window.localStorage.getItem('refreshToken');
            const res = await axios.post(ServHost.host + '/UpdateItem', { ...itemData, refreshToken }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(res.data);
            fetchData(selectedButton);
            setSuccessMessage('Товар обновлен');
            setTimeout(() => {
                setSuccessMessage(null);
            }, 2000);
        } catch (error: any) {
            setErrorMessage(error.response.data);
            setTimeout(() => {
                setErrorMessage(null);
            }, 2000);
            console.error(error);
        }
    };

    const sendDataToServerUpdatePermission = async (permissionData: UserPermission) => {
        try {
            const token = Cookies.get("authToken");
            const refreshToken = window.localStorage.getItem('refreshToken');
            const res = await axios.post(ServHost.host + '/updateUserAccessLevel', {...permissionData, refreshToken}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(res.data);
            fetchData(selectedButton);
            setSuccessMessage('Права пользователя обновлены');
            setTimeout(() => {
                setSuccessMessage(null);
            }, 2000);
        } catch (error: any) {
            setErrorMessage(error.response.data);
            setTimeout(() => {
                setErrorMessage(null);
            }, 2000);
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

    const AddItem = () => {
        const data = { refreshToken: localStorage.getItem('refreshToken') || '', name: '', opisanie: '', price: 0, optprice: 0, PhotoPath: '' };
        sendDataToServerAddItem(data);
    };

    const AddUser = () => {
        const data = { login: '', firstName: '', lastName: '', email: '', gender: '', phone: '' };
        sendDataToServerAddUser(data);
    };

    const AddPermission = () => {
        const data = { login: '', access_level: '' };
        sendDataToServerAddPermission(data);
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
                    <button onClick={() => fetchData('/getNewUsers')} className="admin-profile-button">Пользователи</button>
                    <button onClick={() => fetchData('/getUserAccessRights')} className="admin-profile-button">Права пользователей</button>
                </div>
                <div className="admin-profile-add-button">
                    {selectedButton === '/tovar' && <button onClick={AddItem} className="admin-profile-button">ДОБАВИТЬ ТОВАР</button>}
                    {selectedButton === '/getNewUsers' && <button onClick={AddUser} className="admin-profile-button">ДОБАВИТЬ ПОЛЬЗОВАТЕЛЯ</button>}
                </div>
                {successMessage && <div className="success-message">{successMessage}</div>}
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <div className="admin-profile-items">
                    {loading ? <div className="admin-profile-loading">Загрузка...</div> :
                        currentItems?.map(item => {
                            if (selectedButton === '/tovar' && 'id' in item) {
                                const product = item as Product;
                                return (
                                    <UniversalTableItem
                                        key={product.id}
                                        data={product}
                                        fields={[
                                            { label: "Id", key: "id", type: "number" },
                                            { label: "Name", key: "name", type: "text" },
                                            { label: "Opisanie", key: "opisanie", type: "text" },
                                            { label: "Price", key: "price", type: "number" },
                                            { label: "OptPrice", key: "optprice", type: "number" }
                                        ]}
                                        imagePathField="imagePath"
                                        allowImageUpload={true}
                                        onUpdate={sendDataToServerUpdate}
                                        onDelete={() => sendDataToServerDelete(product.id)}
                                    />
                                );
                            } else if (selectedButton === '/getNewUsers' && 'login' in item) {
                                const user = item as User;
                                return (
                                    <UniversalTableItem
                                        key={user.login}
                                        data={user}
                                        fields={[
                                            { label: "Login", key: "login", type: "text" },
                                            { label: "First Name", key: "firstName", type: "text" },
                                            { label: "Last Name", key: "lastName", type: "text" },
                                            { label: "Email", key: "email", type: "text" },
                                            { label: "Gender", key: "gender", type: "text" },
                                            { label: "Phone", key: "phone", type: "text" }
                                        ]}
                                        allowImageUpload={false}
                                        onUpdate={sendDataToServerUpdate}
                                        onDelete={() => sendDataToServerDelete(user.login)}
                                    />
                                );
                            } else if (selectedButton === '/getUserAccessRights' && 'login' in item) {
                                const permission = item as UserPermission;
                                return (
                                    <UniversalTableItem
                                        key={permission.login}
                                        data={permission}
                                        fields={[
                                            { label: "Login", key: "login", type: "text", readOnly: true },
                                            { label: "Access Level", key: "access_level", type: "text" }
                                        ]}
                                        allowImageUpload={false}
                                        onUpdate={sendDataToServerUpdatePermission}
                                        onDelete={undefined}
                                    />
                                );
                            }
                            return null;
                        })
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
