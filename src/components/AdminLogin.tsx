import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import ServHost from "../serverHost.json";
import "../styles/ItemAdmin.css";
import { v4 as uuidv4 } from 'uuid';
import Cookies from "js-cookie";


interface MyForm {
    password: string;
    login: string;
}

interface AdminLoginProps {
    onLogin: (token: string) => void;
}

function AdminLogin({ onLogin }: AdminLoginProps) {
    const [error, setError] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm<MyForm>({ mode: "onBlur" });

    const submit: SubmitHandler<MyForm> = async (data) => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
    
            if (!refreshToken) {
                throw new Error('Отсутствует refreshToken');
            }
    
            const response = await axios.post(ServHost.host + "/checkAdminCredentials", { ...data, refreshToken });
    
            if (response.status !== 200) {
                throw new Error(response.data);
            }

            const authToken = uuidv4(); // Генерация уникального токена
            Cookies.set("authToken", authToken, { expires: 1 }); // Установка токена в куки на 1 день
            setSuccessMessage("Успешный вход");
            setTimeout(() => setSuccessMessage(""), 5000);
            onLogin(authToken);  // Вызов onLogin с токеном
        } catch (error: any) {
            //console.log(error);
            if (error.message === 'Отсутствует refreshToken') {
                setError('Отсутствует refreshToken');
                setTimeout(() => setError(""), 5000);
            } else {
                setError(error.response.data.error as string);
                setTimeout(() => setError(""), 5000);
            }
        }
    };

    const handleAddUserAdmin: SubmitHandler<MyForm> = async (data) => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
    
            if (!refreshToken) {
                throw new Error('Отсутствует refreshToken');
            }
    
            const responseCheckRights = await axios.post(ServHost.host + "/checkAdminCredentialsRefreshToken", { refreshToken });
    
            if (responseCheckRights.status !== 200) {
                throw new Error(responseCheckRights.data.error || 'Ошибка при проверке прав пользователя');
            }
    
            const responseAddUserAdmin = await axios.post(ServHost.host + "/addUserAdmin", data);
    
            if (responseAddUserAdmin.status !== 200) {
                console.log(responseAddUserAdmin.data.error);
                throw new Error(responseAddUserAdmin.data.error || 'Произошла ошибка сервера');
            }
    
            setSuccessMessage("Пользователь успешно зарегистрирован");
            setTimeout(() => setSuccessMessage(""), 5000);
        } catch (error: any) {
            console.log(error);
            const errorMessage = error.response ? error.response.data.error as string : error.message || 'Произошла ошибка сервера';
            setError(errorMessage);
            setTimeout(() => setError(""), 5000);
        }
    };
    const redirectToHome = () => {
        window.location.href = "/"
    };

    return (
        <div className="admin-login-container">
            <form onSubmit={handleSubmit(submit)} className="admin-login-form">
                <div className="CenteredMessages">
                    {error && <div className="Error">{error}</div>}
                    {successMessage && <div className="Success">{successMessage}</div>}
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Логин"
                        className="inpVhlog"
                        {...register("login", { required: true })}
                    />
                    {errors?.login && <div className="Error">Поле обязательно к заполнению!</div>}
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Пароль"
                        className="inpVhlog"
                        {...register("password", { required: true })}
                    />
                    {errors?.password && <div className="Error">Поле обязательно к заполнению!</div>}
                </div>
                <div className="ButtonsContainer">
                    <button type="submit" className="ButtonAdm" style={{ marginTop: "10px" }}>Войти</button>
                    <button onClick={handleSubmit(handleAddUserAdmin)} className="ButtonAdm" style={{ marginTop: "10px" }}>Добавить пользователя администратора</button>
                    <button onClick={redirectToHome} className="ButtonAdm" style={{ marginTop: "10px" }}>На главную страницу</button>
                </div>
                
            </form>
        </div>
    );
}

export default AdminLogin;
