import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import ServHost from "../serverHost.json";
import "../styles/ItemAdmin.css";

interface MyForm {
    pass: string;
    mail: string;
}

function AdminLogin() {
    const [error, setError] = useState<string>("");

    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm<MyForm>({ mode: "onBlur" });

    const submit: SubmitHandler<MyForm> = async (data) => {
        try {
            const response = await axios.post(ServHost.host + "checkAdminAccess", data);

            if (response.status !== 200) {
                throw new Error(response.data);
            }

            window.location.href = "/admin";
        } catch (error: any) {
            setError(error.message as string);
        }
    };

    return (
        <div className="admin-login-container">
            <form onSubmit={handleSubmit(submit)} className="admin-login-form">
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Mail"
                        className="inpVhlog"
                        {...register("mail", { required: true })}
                    />
                    {errors?.mail && <div className="Error">Поле обязательно к заполнению!</div>}
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Пароль"
                        className="inpVhlog"
                        {...register("pass", { required: true })}
                    />
                    {errors?.pass && <div className="Error">Поле обязательно к заполнению!</div>}
                </div>
                <button type="submit" className="ButtonAdm">Войти</button>
                {error && <div className="Error">{error}</div>}
            </form>
        </div>
    );
    
    
}

export default AdminLogin;
