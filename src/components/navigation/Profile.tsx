import React, { useEffect, useState } from "react";
import Hader from "../Hader";
import Futer from "../Futer";
import '../../styles/Reset.css';
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import ServHost from "../../serverHost.json";

interface MyForm {
    firstname: string,
    lastname: string,
    email: string,
    phone: string,
    gender: string,
    oldPassword: string,
    newPassword: string
}

function Profile() {
    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue
    } = useForm<MyForm>({ mode: "onBlur" });

    const [login, setLogin] = useState<string>('');

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
                console.log('User info updated successfully');
            } else {
                console.error('Failed to update user info');
            }
        } catch (error) {
            console.error('Error updating user info:', error);
        }
    };

    const sendDataToServerCheckToken = async (refreshToken: string) => {
        try {
            const response = await axios.get(`${ServHost.host}/checkToken`, { 
                params: { refreshToken } 
            });

            if (response.status === 200) {
                const userData = response.data;
                //console.log(userData);
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

    useEffect(() => {
        const refreshToken = window.localStorage.getItem('refreshToken');

        if (refreshToken) {
            sendDataToServerCheckToken(refreshToken);
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
                <form onSubmit={handleSubmit(submit)}>
                    <div className="noabsformVhod">
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
                            <select {...register('gender', { required: true })}>
                                <option value="">Выберите пол</option>
                                <option value="Мужской">Мужской</option>
                                <option value="Женский">Женский</option>
                            </select>
                        </div>
                        {errors.gender && <span className="Error">Пол обязателен к заполнению</span>}

                        <label className="lableVhlog">Смена пароля</label>
                        <input type="password" placeholder="Старый Пароль" className="inpVhlog" {...register('oldPassword')} />
                        <input type="password" placeholder="Новый Пароль" className="inpVhlog" {...register('newPassword')} />

                        <div className="warrior_black">Если хотите поменять только Пользовательские данные не затрагивая пароль, оставьте поля с паролями пустыми</div>
                        <div>
                            <button className="ButtonRes">СОХРАНИТЬ</button>
                        </div>
                    </div>
                </form>
            </div>
            <Futer className="footer" />
        </div>
    );
}

export default Profile;
