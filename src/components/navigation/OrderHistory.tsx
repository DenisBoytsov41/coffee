import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ServHost from "../../serverHost.json";
import '../../styles/OrderHistory.css';
import Pagination from '../../components/navigation/Pagination';

interface Order {
    id: string;
    orderId: string;
    date: string;
    status: string;
    total: number;
    items: Array<{ name: string; quantity: number; price: number }>;
}

function OrderHistory() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [ordersPerPage] = useState<number>(5);
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const refreshToken = window.localStorage.getItem("refreshToken");
        
                if (!refreshToken) {
                    window.location.replace("/login");
                    return;
                }
        
                const response = await axios.get(`${ServHost.host}/getOrderHistory`, { 
                    params: { refreshToken }
                });
        
                if (response.status === 200) {
                    const ordersData = await Promise.all(response.data.orders.map(async (order: any) => {
                        const items = await Promise.all(order.items.split(',').map(async (item: string) => {
                            const [id, quantity] = item.split(':');
                            const { data: { name, price } } = await axios.get(`${ServHost.host}/getItemPrice`, {
                                params: { itemId: id }
                            });
                            return {
                                name: name || `Товар ${id}`,
                                quantity: parseInt(quantity),
                                price: price || 0
                            };
                        }));
                        return { ...order, items };
                    }));
                    setOrders(ordersData);
                } else {
                    setError('Не удалось загрузить историю заказов.');
                }
            } catch (error) {
                setError('Произошла ошибка при загрузке истории заказов.');
                console.error('Error fetching order history:', error);
            } finally {
                setLoading(false);
            }
        };
        

        fetchOrderHistory();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
    };

    const filteredOrders = searchQuery ? orders.filter(order =>
        (order.id.toString().toLowerCase().includes(searchQuery)) ||
        order.items.some(item => item.name.toLowerCase().includes(searchQuery)) ||
        order.orderId.toLowerCase().includes(searchQuery) ||
        order.status.toLowerCase().includes(searchQuery)
    ) : orders;
    
    

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="order-history">
            <h2>История заказов</h2>
            <div className="search">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Поиск по заказам..."
                    className="search-input"
                />
            </div>
            {currentOrders.length === 0 ? (
                <div>Нет заказов соответствующих критериям поиска.</div>
            ) : (
                currentOrders.map(order => (
                    <div key={order.id} className="order">
                        <h3>Заказ {order.id}</h3>
                        <p>Номер заказа: {order.orderId}</p>
                        <p>Дата: {order.date}</p>
                        <p>Статус: {order.status}</p>
                        <p>Сумма: {order.total} руб.</p>
                        <h4>Товары:</h4>
                        <ul>
                            {order.items.map((item, index) => (
                                <li key={index}>
                                    {item.name} - {item.quantity} x {item.price} руб.
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredOrders.length / ordersPerPage)}
                onPageChange={paginate}
            />
        </div>
    );
}

export default OrderHistory;
        
