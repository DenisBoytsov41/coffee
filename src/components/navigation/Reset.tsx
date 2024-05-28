import React, { useState, useEffect, useRef } from "react";
import Header from "../Hader";
import Footer from "../Futer";
import '../../styles/Reset.css';
import axios from "axios";
import ServHost from "../../serverHost.json";
import { useForm, SubmitHandler } from "react-hook-form";

interface MyForm {
    email: string;
    phone: string;
    login: string;
    smsCode: string;
}

const Reset: React.FC = () => {
    const [resetMethod, setResetMethod] = useState<"email" | "login" | "phone" | "sms">("email");
    const [loginExists, setLoginExists] = useState<boolean>(false);
    const [showSmsInput, setShowSmsInput] = useState<boolean>(false);
    const [resendTimeout, setResendTimeout] = useState<number>(0);
    const [smsCode, setSmsCode] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [validResetCode, setValidResetCode] = useState<boolean | null>(null);
    const [resetCodeValid, setResetCodeValid] = useState<boolean | null>(null);
    const [phone, setPhone] = useState<string>("");
    const [login, setLogin] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    

    const { register, formState: { errors }, handleSubmit, setValue } = useForm<MyForm>({});

    useEffect(() => {
        if (resendTimeout > 0) {
            const timerId = setTimeout(() => {
                setResendTimeout(prevTime => prevTime - 1);
            }, 1000);

            return () => clearTimeout(timerId);
        }
    }, [resendTimeout]);

    useEffect(() => {
        const errorTimeout = setTimeout(() => {
            setErrorMessage(null);
        }, 3000);
        return () => clearTimeout(errorTimeout);
    }, [errorMessage]);

    useEffect(() => {
        const errorTimeout = setTimeout(() => {
            setEmail("");
            setPhone("");
            setLogin("");
            setSmsCode("");
            setResetMethod("email"); // Сброс метода сброса пароля до значения по умолчанию
            setLoginExists(false); // Сброс состояния проверки существования логина
            setShowSmsInput(false); // Сброс состояния отображения поля для ввода SMS
            setResendTimeout(0); // Обнуление таймера
            setErrorMessage(null); // Сброс сообщения об ошибке
            if (timerRef.current) {
                clearTimeout(timerRef.current); // Очистка таймера, если он был запущен
            }
            setValidResetCode(null);
        }, 3000);
        return () => clearTimeout(errorTimeout);
    }, [validResetCode]);
    

    const sendDataToServer = async (data: { email: string }) => {
        try {
            const res = await axios.post(`${ServHost.host}/SendMailReset`, data);
            if (res.data.res !== "") {
                //console.log(res.data.res);
            }
        } catch (error) {
            setErrorMessage("Ошибка при отправке данных на сервер.");
            console.error(error);
        }
    };

    const checkLoginExistence = async (data: { login: string }) => {
        try {
            const res = await axios.post(`${ServHost.host}/checkLoginExistence`, data);
            if (res.data.exists) {
                setLoginExists(true);
                setResetMethod("phone");
                setErrorMessage(null);
                setValidResetCode(null);
            } else {
                setErrorMessage("Логин не найден.");
            }
        } catch (error) {
            setErrorMessage("Ошибка при проверке логина.");
            console.error(error);
        }
    };

    const comparePhoneNumberAndLogin = async (data: { login: string, phone: string }) => {
        try {
            const res = await axios.post(`${ServHost.host}/comparePhoneNumberAndLogin`, data);
            if (res.data.match) {
                setShowSmsInput(true);
                setResetMethod("sms");
                setErrorMessage(null);
                setValidResetCode(null);
            } else {
                setErrorMessage("Номер телефона не совпадает.");
            }
        } catch (error) {
            setErrorMessage("Ошибка при проверке номера телефона.");
            console.error(error);
        }
    };

    const sendSmsCode = async () => {
        try {
            const res = await axios.post(`${ServHost.host}/sendPasswordResetSMS`, { phone: phone, login: login });
            setResendTimeout(60);
            console.log(res.data);
            setSmsCode(res.data.code); // Сохраняем код SMS
        } catch (error) {
            setErrorMessage("Ошибка при отправке кода СМС.");
            console.error(error);
        }
    };
    
    
    const checkResetCode = async (data: { login: string, resetCode: string }) => {
        try {
            const res = await axios.post(`${ServHost.host}/checkResetCode`, data);
            setResetCodeValid(res.data.valid);
            console.log(res.data);
            if (!res.data.match) {
                setErrorMessage("Неправильный код сброса.");
            } else {
                setErrorMessage(null);
                setValidResetCode(true);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) { // Проверяем, является ли ошибка объектом AxiosError
                // Обрабатываем ошибку AxiosError
                setErrorMessage("Ошибка при проверке кода сброса: " + (error.response?.data?.error || error.message));
            } else if (error instanceof Error) {
                setErrorMessage("Ошибка при проверке кода сброса: " + error.message);
            } else {
                setErrorMessage("Ошибка при проверке кода сброса: " + String(error));
            }
            console.error(error);
        }
    };
    
    
    
    
    

    const onSubmit: SubmitHandler<MyForm> = async (data) => {
        console.log(data);
        if (resetMethod === "email") {
            setEmail(data.email)
            await sendDataToServer(data);
        } else if (resetMethod === "login") {
            setLogin(data.login)
            await checkLoginExistence(data);
        } else if (resetMethod === "phone") {
            setPhone(data.phone)
            await comparePhoneNumberAndLogin(data);
        } else if (resetMethod === "sms") {
            await checkResetCode({ login: login,resetCode: data.smsCode });
        }
    };


    const handleForgotEmail = () => {
        setResetMethod("email");
        setErrorMessage(null);
        setValidResetCode(null);
    };

    const handleForgotLogin = () => {
        setResetMethod("login");
        setErrorMessage(null);
        setValidResetCode(null);
    };

    const handleBack = () => {
        setResetMethod("email");
        setLoginExists(false);
        setShowSmsInput(false);
        setResendTimeout(0);
        setErrorMessage(null);
        setValidResetCode(null);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    };

    return (
        <div>
            <Header />
            <div className="contApp">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="noabsformVhod">
                        <label className="labelVhlog">ВОССТАНОВЛЕНИЕ ПАРОЛЯ</label>
                        {resetMethod === "email" && (
                            <>
                                <input
                                    type="text"
                                    placeholder="* E-mail"
                                    className="inpVhlog"
                                    {...register('email', {
                                        required: "Поле обязательно к заполнению!",
                                        pattern: {
                                            value: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu,
                                            message: 'Почта неправильного вида'
                                        }
                                    })}
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                />
                                {errors.email && <div className="Error">{errors.email.message}</div>}
                            </>
                        )}
                        {resetMethod === "login" && (
                            <>
                                <input
                                    type="text"
                                    placeholder="* Логин пользователя"
                                    className="inpVhlog"
                                    {...register('login', {
                                        required: "Поле обязательно к заполнению!"
                                    })}
                                    onChange={(e) => setLogin(e.target.value)}
                                    value={login}
                                />
                                {errors.login && <div className="Error">{errors.login.message}</div>}
                                <button type="button" onClick={handleSubmit(onSubmit)}>Проверить логин</button>
                            </>
                        )}
                        {resetMethod === "phone" && loginExists && !showSmsInput && (
                            <>
                                <input
                                    type="text"
                                    placeholder="* Номер телефона"
                                    className="inpVhlog"
                                    {...register('phone', {
                                        required: "Поле обязательно к заполнению!",
                                        pattern: {
                                            value: /^\+?[1-9]\d{1,14}$/u,
                                            message: 'Номер телефона должен быть валидным'
                                        }
                                    })}
                                    onChange={(e) => setPhone(e.target.value)}
                                    value={phone}
                                />
                                {errors.phone && <div className="Error">{errors.phone.message}</div>}
                                <button type="button" onClick={handleSubmit(onSubmit)}>Проверить номер телефона</button>
                            </>
                        )}
                        {resetMethod === "sms" && showSmsInput && (
                            <>
                                <input
                                    type="text"
                                    placeholder="* Код из СМС"
                                    className="inpVhlog"
                                    {...register('smsCode', {
                                        required: "Поле обязательно к заполнению!"
                                    })}
                                />
                                {errors.smsCode && <div className="Error">{errors.smsCode.message}</div>}
                                <button type="button" onClick={()=> sendSmsCode()} disabled={resendTimeout > 0}>
                                    {resendTimeout > 0 ? `Отправить повторно через ${resendTimeout} секунд` : "Отправить код по СМС"}
                                </button>
                            </>
                        )}
                        <div className="ResText">
                            {resetMethod === "email" && (
                                <>
                                    Введите адрес электронной почты, чтобы восстановить пароль.
                                    <button type="button" onClick={handleForgotLogin}>Восстановить по логину</button>
                                </>
                            )}
                            {resetMethod === "login" && (
                                <>
                                    Введите логин пользователя, чтобы восстановить пароль.
                                    {loginExists && <span> Логин найден. Введите номер телефона.</span>}
                                    <button type="button" onClick={handleForgotEmail}>Восстановить по почте</button>
                                </>
                            )}
                            {resetMethod === "phone" && loginExists && (
                                <>
                                    {showSmsInput ? (
                                        <>
                                            Введите код из СМС, чтобы продолжить.
                                        </>
                                    ) : (
                                        <>
                                            Введите номер телефона, чтобы восстановить пароль.
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                        {resendTimeout > 0 && (
                            <p>Код можно отправить повторно через {resendTimeout} секунд</p>
                        )}
                        {errorMessage && (
                            <div className="Error">{errorMessage}</div>
                            )}
                            <button type="submit" className="ButtonRes">ПРОДОЛЖИТЬ</button>
                            <button type="button" onClick={handleBack} className="ButtonRes">Назад</button>
                        </div>
                    </form>
                </div>
                <Footer className="footer" />
            </div>
        );
    }
    
    export default Reset;
    