import React, { useEffect, useState, ChangeEvent } from "react";
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
    PhotoPath: string;
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

interface OrderHistory {
    id: number;
    login: string;
    orderId: string;
    date: string;
    status: 'В обработке' | 'Оплачен' | 'Отменен' | 'Доставлен';
    total: string;
    items: string;
}


type DataType = Product[] | User[] | UserPermission[] | OrderHistory[];

function AdminProfile({ onLogout }: AdminProfileProps) {
    const [data, setData] = useState<DataType | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedButton, setSelectedButton] = useState('/tovar');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState<DataType | null>(null);
    const [currentItems, setCurrentItems] = useState<DataType | null>(null);
    const [totalPages, setTotalPages] = useState(0);
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
                setErrorMessage(error?.response?.data?.error || error?.response?.data || 'Ошибка');
                setTimeout(() => {
                    setErrorMessage(null);
                }, 2000);
                console.error(error);
            }
        };
        fetchData();
    }, [selectedButton]);


    const filterProducts = (data: DataType, searchQuery: string): Product[] => {
        return (data as Product[]).filter((item: Product) => {
            return (item.id && item.id.toString().includes(searchQuery)) ||
                   (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                   (item.opisanie && item.opisanie.toLowerCase().includes(searchQuery.toLowerCase())) ||
                   (item.price && item.price.toString().includes(searchQuery)) ||
                   (item.optprice && item.optprice.toString().includes(searchQuery));
        });
    };
   
    
    const filterUsers = (data: DataType, searchQuery: string): User[] => {
        return (data as User[]).filter((item: User) => {
            return (item.login && item.login.toLowerCase().includes(searchQuery.toLowerCase())) ||
                   (item.firstName && item.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                   (item.lastName && item.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                   (item.email && item.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                   (item.gender && item.gender.toLowerCase().includes(searchQuery.toLowerCase())) ||
                   (item.phone && item.phone.toLowerCase().includes(searchQuery.toLowerCase()));
        });
    };
    
    
    const filterPermissions = (data: DataType, searchQuery: string): UserPermission[] => {
        return (data as UserPermission[]).filter((item: UserPermission) => {
            return (item.login && item.login.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (item.access_level && item.access_level.toLowerCase().includes(searchQuery.toLowerCase()));
        });
    };

    const filterOrder = (data: DataType, searchQuery: string): OrderHistory[] => {
        return (data as OrderHistory[]).filter((item: OrderHistory) => {
            return (item.id && item.id.toString().includes(searchQuery))  ||
                   (item.login && item.login.toLowerCase().includes(searchQuery.toLowerCase())) ||
                   (item.orderId && item.orderId.toLowerCase().includes(searchQuery.toLowerCase())) ||
                   (item.date && item.date.toLowerCase().includes(searchQuery.toLowerCase())) ||
                   (item.status && item.status.toLowerCase().includes(searchQuery.toLowerCase())) ||
                   (item.total && item.total.toLowerCase().includes(searchQuery.toLowerCase())) ||
                   (item.items && item.items.toLowerCase().includes(searchQuery.toLowerCase()));
        });
    };
    
    useEffect(() => {
        if (!data) return;

        //console.log(data);        
        let filtered: DataType;
        
        switch (selectedButton) {
            case '/tovar':
                filtered = filterProducts(data, searchQuery);
                //console.log(searchQuery);
                //console.log(filtered);
                break;
            case '/getNewUsers':
                filtered = filterUsers(data, searchQuery);
                break;
            case '/getUserAccessRights':
                filtered = filterPermissions(data, searchQuery);
                break;
            case '/getOrderHistoryAdmin':
                filtered = filterOrder(data, searchQuery);
                break;
            default:
                filtered = data;
                break;
        }
    
        setFilteredData(filtered);
    }, [data, searchQuery, selectedButton]);


    useEffect(() => {
        if (!filteredData) {
            setCurrentItems(null);
            setTotalPages(0);
        } else {
            let indexOfLastItem = currentPage * itemsPerPage;
            let indexOfFirstItem = indexOfLastItem - itemsPerPage;
            setCurrentItems((filteredData as DataType).slice(indexOfFirstItem, indexOfLastItem));
            setTotalPages(Math.ceil((filteredData?.length || 0) / itemsPerPage));
        }
    }, [filteredData, currentPage]);
    
      

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
            setErrorMessage(error?.response?.data?.error || error?.response?.data || 'Ошибка');
            setTimeout(() => {
                setErrorMessage(null);
            }, 2000);
            console.error(error);
        }
    };
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
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
            setErrorMessage(error?.response?.data?.error || error?.response?.data || 'Ошибка');
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
            console.log(response.data);
            setLoading(false);
            setSuccessMessage('Запрос успешно выполнен');
            setTimeout(() => {
                setSuccessMessage(null);
            }, 2000);
        } catch (error: any) {
            setErrorMessage(error?.response?.data?.error || error?.response?.data || 'Ошибка');
            setTimeout(() => {
                setErrorMessage(null);
            }, 2000);
            setLoading(false);
            console.error(error);
        }
    };

    const sendDataToServerUpdate = async (itemData: Product, selectedFile: File | null | undefined) => {
        try {
            if (itemData.price < 0 || itemData.optprice < 0) {
                console.error('Цена не может быть отрицательной.');
                return;
            }
    
            const token = Cookies.get("authToken");
            const refreshToken = window.localStorage.getItem('refreshToken');
            const updatedData = { ...itemData };
    
            if (selectedFile) {
                const formData = new FormData();
                formData.append('image', selectedFile);
                console.log(formData);
                console.log(selectedFile);
    
                // Отправляем файл на сервер и получаем путь к нему
                const response = await axios.post(ServHost.host + '/uploadImage', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });
    
                // Используем путь к файлу изображения
                updatedData.PhotoPath = response.data.filePath;
            }
    
            const res = await axios.post(ServHost.host + '/UpdateItem', { ...updatedData, refreshToken }, {
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
            setErrorMessage(error?.response?.data?.error || error?.response?.data || 'Ошибка');
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
            setErrorMessage(error?.response?.data?.error || error?.response?.data || 'Ошибка');
            setTimeout(() => {
                setErrorMessage(null);
            }, 2000);
            console.error(error);
        }
    };
    const sendDataToServerDeleteUser = async (loginToDelete: string) => {
        try {
            const token = Cookies.get("authToken");
            const refreshToken = window.localStorage.getItem('refreshToken');
            const res = await axios.post(ServHost.host + '/deleteNewUser', { refreshToken, loginToDelete }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(res.data);
            setSuccessMessage('Пользователь успешно удален');
            setTimeout(() => {
                setSuccessMessage(null);
            }, 2000);
            fetchData(selectedButton);
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || 'Произошла ошибка');
            setTimeout(() => {
                setErrorMessage(null);
            }, 2000);
            console.error(error);
        }
    };
    const sendDataToServerUpdateUser = async (userData: User) => {
        try {
            const token = Cookies.get("authToken");
            const refreshToken = window.localStorage.getItem('refreshToken');
            
            const { login, firstName, lastName, gender, phone, email } = userData;
            const requestData = { refreshToken, login, firstname: firstName, lastname: lastName, gender, phone, email };
            //console.log(requestData);
    
            const res = await axios.post(ServHost.host + '/updateNewUserAdminInfo', requestData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            console.log(res.data);
            fetchData(selectedButton);
            setSuccessMessage('Информация о пользователе обновлена');
            setTimeout(() => {
                setSuccessMessage(null);
            }, 2000);
        } catch (error: any) {
            setErrorMessage(error?.response?.data?.error || error?.response?.data || 'Ошибка');
            setTimeout(() => {
                setErrorMessage(null);
            }, 2000);
            console.error(error);
        }
    };
    const sendDataToServerDeleteOrder = async (orderIdToDelete: number) => {
        try {
            const token = Cookies.get("authToken");
            const refreshToken = window.localStorage.getItem('refreshToken');
            const res = await axios.post(ServHost.host + '/deleteOrder', { refreshToken, orderIdToDelete }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(res.data);
            setSuccessMessage('Заказ успешно удален');
            setTimeout(() => {
                setSuccessMessage(null);
            }, 2000);
            fetchData(selectedButton);
        } catch (error: any) {
            setErrorMessage(error?.response?.data?.error || error?.response?.data || 'Ошибка');
            setTimeout(() => {
                setErrorMessage(null);
            }, 2000);
            console.error(error);
        }
    };
    const sendDataToServerUpdateOrder = async (orderId: number, updatedData: Partial<OrderHistory>) => {
        try {
            const token = Cookies.get("authToken");
            const refreshToken = window.localStorage.getItem('refreshToken');
            const res = await axios.post(ServHost.host + '/updateOrder', { ...updatedData, refreshToken, id: orderId }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(res.data);
            setSuccessMessage('Информация о заказе обновлена');
            setTimeout(() => {
                setSuccessMessage(null);
            }, 2000);
            fetchData(selectedButton);
        } catch (error: any) {
            setErrorMessage(error?.response?.data?.error || error?.response?.data || 'Ошибка');
            setTimeout(() => {
                setErrorMessage(null);
            }, 2000);
            console.error(error);
        }
    };
       
   
    const handleDownloadImage = async (imagePath: string) => {
        console.log(`Загрузка изображения с пути: ${imagePath}`);
        try {
            const response = await fetch(imagePath);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = imagePath.split('/').pop() || 'image';
            link.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Ошибка загрузки файла:', error);
        }
    };
        
    
    const handleDeleteImage = () => {
        console.log("Изображение удалено");
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

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (!data || !filteredData) {
        return <div>Нет данных для отображения</div>;
    }

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
                    <button onClick={() => fetchData('/getOrderHistoryAdmin')} className="admin-profile-button">Таблица заказов</button>
                </div>
                <div className="admin-profile-search">
                    <input
                        type="text"
                        placeholder="Поиск..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="admin-profile-search-input"
                    />
                </div>
                <div className="admin-profile-add-button">
                    {selectedButton === '/tovar' && <button onClick={AddItem} className="admin-profile-button">ДОБАВИТЬ ТОВАР</button>}
                </div>
                {successMessage && <div className="success-message">{successMessage}</div>}
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <div className="admin-profile-items">
                {!loading && (
                    <div className="admin-profile-items">
                        {(currentItems as (Product | User | UserPermission | OrderHistory)[])
                            ?.map((item: Product | User | UserPermission | OrderHistory) => {
                                if (selectedButton === "/tovar" && "id" in item) {
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
                                                { label: "OptPrice", key: "optprice", type: "number" },
                                            ]}
                                            imagePathField="PhotoPath"
                                            allowImageUpload={true}
                                            onUpdate={sendDataToServerUpdate}
                                            onDelete={() => sendDataToServerDelete(product.id)}
                                            onDownloadImage={handleDownloadImage}
                                            onDeleteImage={handleDeleteImage}
                                        />
                                    );
                                } else if (selectedButton === "/getNewUsers" && "login" in item) {
                                    const user = item as User;
                                    return (
                                        <UniversalTableItem
                                            key={user.login}
                                            data={user}
                                            fields={[
                                                { label: "Login", key: "login", type: "text", readOnly: true },
                                                { label: "First Name", key: "firstName", type: "text" },
                                                { label: "Last Name", key: "lastName", type: "text" },
                                                { label: "Email", key: "email", type: "text", readOnly: true },
                                                { label: "Gender", key: "gender", type: "text" },
                                                { label: "Phone", key: "phone", type: "text" },
                                            ]}
                                            allowImageUpload={false}
                                            onUpdate={(updatedData) => sendDataToServerUpdateUser(updatedData)}
                                            onDelete={() => sendDataToServerDeleteUser(user.login)}
                                        />
                                    );
                                } else if (selectedButton === "/getUserAccessRights" && "login" in item) {
                                    const permission = item as UserPermission;
                                    return (
                                        <UniversalTableItem
                                            key={permission.login}
                                            data={permission}
                                            fields={[
                                                { label: "Login", key: "login", type: "text", readOnly: true },
                                                { label: "Access Level", key: "access_level", type: "text" },
                                            ]}
                                            allowImageUpload={false}
                                            onUpdate={sendDataToServerUpdatePermission}
                                            onDelete={undefined}
                                        />
                                    );
                                }
                                else if (selectedButton === "/getOrderHistoryAdmin" && "id" in item) {
                                    const order = item as OrderHistory;
                                    return (
                                        <UniversalTableItem
                                            key={order.id}
                                            data={order}
                                            fields={[
                                                { label: "Id", key: "id", type: "number", readOnly: true  },
                                                { label: "Login", key: "login", type: "text", readOnly: true },
                                                { label: "Order ID", key: "orderId", type: "text", readOnly: true  },
                                                { label: "Date", key: "date", type: "text", readOnly: true  },
                                                { label: "Status", key: "status", type: "text"},
                                                { label: "Total", key: "total", type: "text", readOnly: true  },
                                                { label: "Items", key: "items", type: "text", readOnly: true  },
                                            ]}
                                            allowImageUpload={false}
                                            onUpdate={(updatedData) => sendDataToServerUpdateOrder(order.id, updatedData)}
                                            onDelete={() => sendDataToServerDeleteOrder(order.id)}
                                        />
                                    );
                                }
                                return null;
                            })}
                    </div>
                )}
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
