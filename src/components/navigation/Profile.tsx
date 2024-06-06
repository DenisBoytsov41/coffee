import React, { useEffect, useState } from "react";
import Hader from "../Hader";
import Futer from "../Futer";
import '../../styles/Reset.css';
import '../../styles/SelectGender.css'
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import ServHost from "../../serverHost.json";
import ChangePassword from "./ChangePassword";
import OrderHistory from "./OrderHistory";

interface MyForm {
    firstname: string,
    lastname: string,
    email: string,
    phone: string,
    gender: string
}

function Profile() {
    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue
    } = useForm<MyForm>({ mode: "onBlur" });

    const [login, setLogin] = useState<string>('');
    const [serverMessage, setServerMessage] = useState<string>('');
    const [messageColor, setMessageColor] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string>('profile');
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const clearLocalStorageTokens = () => {
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshTokenExpiration');
        localStorage.removeItem('accessTokenExpiration');
    };

    const sendDataToServerUpdateInfoUser = async (data: MyForm) => {
        try {
            const refreshToken = window.localStorage.getItem("refreshToken");

            if (!refreshToken) {
                window.location.replace("/login");
                return;
            }

            const response = await axios.post(`${ServHost.host}/updateInfoUser`, {
                ...data,
                refreshToken
            });

            if (response.status === 200) {
                console.log('Информация о пользователе успешно обновлена');
                setServerMessage('Информация о пользователе успешно обновлена');
                setMessageColor('green');
                setTimeout(() => setServerMessage(''), 5000);
            } else {
                console.error('Ошибка при обновлении информации о пользователе');
                setServerMessage('Не удалось обновить информацию о пользователе');
                setMessageColor('red');
                setTimeout(() => setServerMessage(''), 5000);
            }
        } catch (error: any) {
            console.error('Ошибка при обновлении информации о пользователе:', error);
            if (error.response && error.response.data && error.response.data.error) {
                setServerMessage(error.response.data.error.join(' '));
            } else {
                setServerMessage('Произошла ошибка при обновлении информации о пользователе');
            }
            setMessageColor('red');
            setTimeout(() => {
                setServerMessage('');
                window.location.reload();
            }, 5000);
        }
    };

    const sendDataToServerCheckToken = async (refreshToken: string) => {
        try {
            const response = await axios.get(`${ServHost.host}/checkToken`, { 
                params: { refreshToken } 
            });

            if (response.status === 200) {
                const userData = response.data;
                setLogin(userData.login);
                setValue('firstname', userData.firstName);
                setValue('lastname', userData.lastName);
                setValue('email', userData.email);
                setValue('phone', userData.phone);
                setValue('gender', userData.gender);
            } else {
                window.location.replace("/login");
            }
        } catch (error) {
            console.error('Error checking token:', error);
            window.location.replace("/login");
        }
    };

    const checkAdminCredentials = async () => {
        try {
            const refreshToken = window.localStorage.getItem("refreshToken");

            if (!refreshToken) {
                window.location.replace("/login");
                return;
            }

            const response = await axios.post(`${ServHost.host}/checkAdminCredentialsRefreshToken`, {
                refreshToken
            });

            if (response.status === 200 && response.data.status === 'ok') {
                setIsAdmin(true);
            }
        } catch (error) {
            console.error('Ошибка проверки прав пользователя:', error);
        }
    };

    useEffect(() => {
        const refreshToken = window.localStorage.getItem('refreshToken');
        const accessToken = window.localStorage.getItem('accessToken');

        if (refreshToken || (refreshToken && accessToken)) {
            sendDataToServerCheckToken(refreshToken);
            checkAdminCredentials();
        } else {
            window.location.replace("/login");
        }
    }, []);

    const submit: SubmitHandler<MyForm> = (data) => {
        sendDataToServerUpdateInfoUser(data);
    };

    return (
        <div>
            <Hader />
            <div className="contApp">
                <div className="tabs">
                    <button onClick={() => setActiveTab('profile')}>Профиль</button>
                    <button onClick={() => setActiveTab('changePassword')}>Смена пароля</button>
                    <button onClick={() => setActiveTab('orderHistory')}>История заказов</button>
                    {isAdmin && <button onClick={() => window.location.replace("/admin")}>Панель администратора</button>}
                </div>
                {activeTab === 'profile' && (
                    <form onSubmit={handleSubmit(submit)}>
                        <div className="noabsformVhod">
                            {serverMessage && <div className="serverMessage" style={{ color: messageColor }}>{serverMessage}</div>}
                            <label className="lableVhlog">Пользовательские Данные</label>
                            <input type="text" placeholder="Имя" className="inpVhlog" {...register('firstname', { required: true })} />
                            {errors.firstname && <span className="Error">Имя обязательно к заполнению</span>}
                            
                            <input type="text" placeholder="Фамилия" className="inpVhlog" {...register('lastname', { required: true })} />
                            {errors.lastname && <span className="Error">Фамилия обязательна к заполнению</span>}
                            
                            <input type="email" placeholder="E-mail" className="inpVhlog" {...register('email', { required: true })} />
                            {errors.email && <span className="Error">Email обязателен к заполнению</span>}
                            
                            <input type="tel" placeholder="Телефон" className="inpVhlog" {...register('phone', { required: true })} />
                            {errors.phone && <span className="Error">Телефон обязателен к заполнению</span>}
                            
                            <div>
                                <label>Пол:</label>
                                <select {...register('gender', { required: true })} className="select-gender">
                                    <option value="">Выберите пол</option>
                                    <option value="Мужской">Мужской</option>
                                    <option value="Женский">Женский</option>
                                </select>
                            </div>
                            {errors.gender && <span className="Error">Пол обязателен к заполнению</span>}

                            <div>
                                <button className="ButtonRes">СОХРАНИТЬ</button>
                            </div>
                        </div>
                    </form>
                )}
                {activeTab === 'changePassword' && <ChangePassword />}
                {activeTab === 'orderHistory' && <OrderHistory />}
            </div>
            <Futer className="footer" />
        </div>
    );
}

export default Profile;
