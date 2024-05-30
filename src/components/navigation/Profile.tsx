import React, { useEffect, useState } from "react";
import Hader from "../Hader";
import Futer from "../Futer";
import '../../styles/Reset.css';
import '../../styles/SelectGender.css'
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import ServHost from "../../serverHost.json";
import ChangePassword from "./ChangePassword"; // Импортируем новый компонент

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
    const [activeTab, setActiveTab] = useState<string>('profile'); // Добавляем состояние для активной вкладки

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
                //clearLocalStorageTokens();
                return;
            }

            const response = await axios.post(`${ServHost.host}/updateInfoUser`, {
                ...data,
                refreshToken
            });

            if (response.status === 200) {
                console.log('User info updated successfully');
                setServerMessage('Информация о пользователе успешно обновлена');
                setMessageColor('green');
                setTimeout(() => setServerMessage(''), 5000);
            } else {
                console.error('Failed to update user info');
                setServerMessage('Не удалось обновить информацию о пользователе');
                setMessageColor('red');
                //clearLocalStorageTokens();
                setTimeout(() => setServerMessage(''), 5000);
            }
        } catch (error) {
            console.error('Error updating user info:', error);
            setServerMessage('Произошла ошибка при обновлении информации о пользователе');
            setMessageColor('red');
            //clearLocalStorageTokens();
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
                //clearLocalStorageTokens();
                window.location.replace("/login");
            }
        } catch (error) {
            //clearLocalStorageTokens();
            console.error('Error checking token:', error);
            window.location.replace("/login");
        }
    };

    useEffect(() => {
        const refreshToken = window.localStorage.getItem('refreshToken');
        const accessToken = window.localStorage.getItem('accessToken');;

        if (refreshToken || (refreshToken && accessToken)) {
            sendDataToServerCheckToken(refreshToken);
        } else {
            //clearLocalStorageTokens();
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
            </div>
            <Futer className="footer" />
        </div>
    );
}

export default Profile;
