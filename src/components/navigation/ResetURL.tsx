import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Header from "../Hader";
import Footer from "../Futer";
import '../../styles/Reset.css';
import axios from "axios";
import ServHost from "../../serverHost.json";
import { useForm, SubmitHandler } from "react-hook-form";

interface MyForm {
    password: string;
    confirmPassword: string;
}

const ResetURL: React.FC = () => {
    const { email, token } = useParams<{ email: string, token: string }>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { register, formState: { errors }, handleSubmit, watch } = useForm<MyForm>({});
    const password = useRef({});
    password.current = watch("password", "");

    const onSubmit: SubmitHandler<MyForm> = async ({ password, confirmPassword }) => {
        // Проверяем, что email и token не undefined перед использованием decodeURIComponent
        if (!email || !token) {
            setErrorMessage("Некорректная ссылка для сброса пароля.");
            return;
        }

        try {
            const res = await axios.post(`${ServHost.host}/resetPassword`, {
                email: decodeURIComponent(email),
                token: decodeURIComponent(token),
                password,
                confirmPassword
            });
            console.log(res.data);
            // Обработка успешного ответа сервера (если необходимо)
            setSuccessMessage("Пароль успешно сброшен!");
            window.location.replace("/");
        } catch (error: any) {
            setErrorMessage(error?.response?.data?.error||"Ошибка при сбросе пароля. Пожалуйста, попробуйте еще раз.");
            console.error("Ошибка при сбросе пароля:", error);

        }
    };

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    useEffect(() => {
        register("password", {
            required: "Поле обязательно к заполнению!",
            minLength: {
                value: 8,
                message: "Пароль должен содержать минимум 8 символов"
            }
        });
        register("confirmPassword", {
            validate: value =>
                value === password.current || "Пароли не совпадают"
        });
    }, [register]);

    return (
        <div>
            <Header />
            <div className="contApp">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="noabsformVhod">
                        <label className="labelVhlog">ВОССТАНОВЛЕНИЕ ПАРОЛЯ</label>
                        {errors.confirmPassword && <div className="Error">{errors.confirmPassword.message}</div>}
                        {errorMessage && (
                            <div className="Error">{errorMessage}</div>
                        )}
                        {successMessage && (
                            <div className="Success">{successMessage}</div>
                        )}
                        <input
                            type="password"
                            placeholder="* Новый пароль"
                            className="inpVhlog"
                            {...register('password')}
                        />
                        {errors.password && <div className="Error">{errors.password.message}</div>}
                        <input
                            type="password"
                            placeholder="* Повторите пароль"
                            className="inpVhlog"
                            {...register('confirmPassword')}
                        />

                        <button type="submit" className="ButtonRes">СОХРАНИТЬ</button>
                    </div>
                </form>
            </div>
            <Footer className="footer" />
        </div>
    );
}

export default ResetURL;
