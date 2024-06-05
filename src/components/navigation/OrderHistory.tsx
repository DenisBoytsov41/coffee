import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ServHost from "../../serverHost.json";
import '../../styles/OrderHistory.css';

interface Order {
    id: string;
    date: string;
    status: string;
    total: number;
    items: Array<{ name: string; quantity: number; price: number }>;
}

function OrderHistory() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const refreshToken = window.localStorage.getItem("refreshToken");

                if (!refreshToken) {
                    window.location.replace("/login");
                    return;
                }

                const response = await axios.get(`${ServHost.host}/orderHistory`, { 
                    params: { refreshToken }
                });

                if (response.status === 200) {
                    const ordersData = await Promise.all(response.data.orders.map(async (order: any) => {
                        const items = await Promise.all(order.items.split(',').map(async (item: string) => {
                            const [id, quantity] = item.split(':');
                            const { data: { price } } = await axios.get(`${ServHost.host}/getItemPrice`, {
                                params: { itemId: id }
                            });
                            return {
                                name: `Товар ${id}`, // Предположим, что у вас есть база данных товаров и вы можете получить имя товара по его id
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

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="order-history">
            <h2>История заказов</h2>
            {orders.length === 0 ? (
                <div>У вас нет заказов.</div>
            ) : (
                orders.map(order => (
                    <div key={order.id} className="order">
                        <h3>Заказ {order.id}</h3>
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
        </div>
    );
}

export default OrderHistory;
