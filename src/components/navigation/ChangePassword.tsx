import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import ServHost from "../../serverHost.json";

interface PasswordForm {
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
}

function ChangePassword() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<PasswordForm>({ mode: "onBlur" });

    const [serverMessage, setServerMessage] = useState<string>('');
    const [messageColor, setMessageColor] = useState<string>('');

    const clearLocalStorageTokens = () => {
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshTokenExpiration');
        localStorage.removeItem('accessTokenExpiration');
    };

    const sendPasswordChangeRequest = async (data: PasswordForm) => {
        if (data.newPassword !== data.confirmPassword) {
            setServerMessage('Новый пароль и подтверждение пароля не совпадают');
            setMessageColor('red');
            setTimeout(() => setServerMessage(''), 5000);
            return;
        }

        try {
            const refreshToken = window.localStorage.getItem("refreshToken");

            if (!refreshToken) {
                window.location.replace("/login");
                return;
            }

            const response = await axios.post(`${ServHost.host}/changePassword`, {
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
                refreshToken
            });

            if (response.status === 200) {
                setServerMessage('Пароль успешно изменен');
                setMessageColor('green');
                setTimeout(() => {
                    setServerMessage('');
                    window.location.reload();
                }, 5000);
            } else {
                setServerMessage('Не удалось изменить пароль');
                setMessageColor('red');
                //clearLocalStorageTokens();
                setTimeout(() => {
                    setServerMessage('');
                    window.location.reload();
                }, 5000);
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setServerMessage('Произошла ошибка при изменении пароля');
            setMessageColor('red');
            //clearLocalStorageTokens();
            setTimeout(() => {
                setServerMessage('');
                window.location.reload();
            }, 5000);
        }
    };

    const submit: SubmitHandler<PasswordForm> = (data) => {
        sendPasswordChangeRequest(data);
    };

    return (
        <form onSubmit={handleSubmit(submit)}>
            <div className="noabsformVhod">
                {serverMessage && <div className="serverMessage" style={{ color: messageColor }}>{serverMessage}</div>}
                <label className="lableVhlog">Смена пароля</label>
                <input type="password" placeholder="Старый Пароль" className="inpVhlog" {...register('oldPassword', { required: true })} />
                {errors.oldPassword && <span className="Error">Старый пароль обязателен</span>}
                
                <input type="password" placeholder="Новый Пароль" className="inpVhlog" {...register('newPassword', { required: true })} />
                {errors.newPassword && <span className="Error">Новый пароль обязателен</span>}
                
                <input type="password" placeholder="Подтверждение Нового Пароля" className="inpVhlog" {...register('confirmPassword', { required: true })} />
                {errors.confirmPassword && <span className="Error">Подтверждение нового пароля обязательно</span>}

                <div>
                    <button className="ButtonRes">СМЕНИТЬ ПАРОЛЬ</button>
                </div>
            </div>
        </form>
    );
}

export default ChangePassword;
