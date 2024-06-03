import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import profile from "../images/Profile.jpg";
import '../styles/KastomCheckBox.css';
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import ServHost from "../serverHost.json";
import { useAuth } from '../components/navigation/AuthContext';

interface MyForm {
    loginOrEmail: string;
    pass: string;
    isPublicComputer: boolean;
}

declare global {
    interface Window {
        grecaptcha: any;
    }
}

function Vhod() {
    const [isElementVisible, setElementVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);
    const [isErrVisible, setErrVisible] = useState(true);
    const [loginMessage, setLoginMessage] = useState('');
    const [loginError, setLoginError] = useState('');
    const { login, isLoggedIn } = useAuth(); 

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoginMessage('');
            setLoginError('');
        }, 5000);

        return () => clearTimeout(timer);
    }, [loginMessage, loginError]);

    const handleClickOutside = (event: MouseEvent) => {
        if (elementRef.current && !elementRef.current.contains(event.target as Node | null)) {
            setElementVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            let logged = window.localStorage.getItem("isLoggedIn");
            let refresh = window.localStorage.getItem("refreshToken");
            const timer = setTimeout(async () => {
                if (!logged) {
                    await UpdateDBBasket();
                    await UpdateDBLiked();
                } else if (logged && refresh === "") {
                    window.localStorage.setItem("isLoggedIn", "false");
                    window.location.replace("/");
                }
            }, 1000);
            return () => clearTimeout(timer);
        };
    
        fetchData();
    }, [isLoggedIn]);
    
    const handleButtonClick = () => {
        setElementVisible(!isElementVisible);
    };

    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm<MyForm>({ mode: "onBlur" });

    const sendDataToServer = async (data: MyForm) => {
        try {
            const requestData = { ...data /*, captcha: captchaToken*/ };
            const response = await axios.post(ServHost.host + '/checkUser', requestData);
            if (response.status == 200) {
                console.log(response.data.message);
                setLoginMessage(response.data.message);
                login(response.data.refreshToken, response.data.accessToken, data.isPublicComputer);
                await UpdateDBBasket();
                await UpdateDBLiked();
            } else {
                console.error(response.data.message);
                setLoginError(response.data.message);
            }
        } catch (error: any) {
            console.error('Ошибка при отправке запроса: ', error);
            if (error.response && error.response.data && error.response.data.error) {
                setLoginError(error.response.data.error);
            } else {
                setLoginError('Ошибка при входе. Пожалуйста, попробуйте еще раз или обратитесь за помощью.');
            }
        }
    };
    
    const sendDataToServerUpdateBasket = async (refreshToken: string | null, basket: string | null) => {
        try {
            if (!refreshToken) {
                console.error('Refresh token is missing');
                return;
            }
            // Проверяем токен на сервере
            const resCheckToken = await axios.get(ServHost.host + '/checkToken', {
                params: { refreshToken }
            });
            if (resCheckToken.status === 200 && resCheckToken.data) {
                const login = resCheckToken.data.login;
                // Отправляем данные для обновления корзины
                const res = await axios.post(ServHost.host + '/MergeBasket', { login, items: basket || "" });
                if (res.data.res !== "") {
                    console.log(res.data.res);
                    window.location.replace("/");
                }
            } else {
                console.error('Invalid or expired refresh token');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const UpdateDBBasket = async () => {
        const refreshToken = window.localStorage.getItem('refreshToken');
        const basket = window.localStorage.getItem('basket');
        if (refreshToken) {
            await sendDataToServerUpdateBasket(refreshToken, basket || "");
        }
    };

    const sendDataToServerUpdateLiked= async (refreshToken: string | null, liked: string | null) => {
        try {
            if (!refreshToken) {
                console.error('Refresh token is missing');
                return;
            }
            // Проверяем токен на сервере
            const resCheckToken = await axios.get(ServHost.host + '/checkToken', {
                params: { refreshToken }
            });
            if (resCheckToken.status === 200 && resCheckToken.data) {
                const login = resCheckToken.data.login;
                // Отправляем данные для обновления корзины
                const res = await axios.post(ServHost.host + '/MergeLiked', { login, items: liked || "" });
                if (res.data.res !== "") {
                    console.log(res.data.res);
                    let logged = window.localStorage.getItem("isLoggedIn");
                    if (logged)
                    {
                        window.location.replace("/");
                    }
                }
            } else {
                console.error('Invalid or expired refresh token');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const UpdateDBLiked = async (likedParam?: string) => {
        const refreshToken = window.localStorage.getItem('refreshToken');
        const liked = likedParam ?? window.localStorage.getItem('liked');
        if (refreshToken) {
            await sendDataToServerUpdateLiked(refreshToken, liked || "");
        }
    };
    

    const submit: SubmitHandler<MyForm> = (data) => {
        sendDataToServer(data);
    };

    return (
        <div ref={elementRef}>
            <button onClick={handleButtonClick} className="btnVh">
                <img src={profile} alt="profile" className="imgVH" />
                <div className='linkHeader Comissioner'>
                    Вход
                </div>
            </button>
            {isElementVisible && (
                <div className="formVhod">
                    <form onSubmit={handleSubmit(submit)}>
                        <div className="absformVhod Comissioner">
                            <label className="lableVh">ВХОД НА САЙТ</label>
                            {loginMessage && <div className="alert alert-success">{loginMessage}</div>}
                            {loginError && <div className="alert alert-danger">{loginError}</div>}
                            <input
                                type="text"
                                placeholder="E-mail или Логин"
                                className="inpVh"
                                {...register('loginOrEmail', { required: 'Поле обязательно к заполнению!' })}
                            />
                            {errors?.loginOrEmail && <div className="Error">{errors.loginOrEmail.message}</div>}
                            <input
                                type="password"
                                placeholder="Пароль"
                                className="inpVh"
                                {...register('pass', { required: 'Поле обязательно к заполнению!', minLength: { value: 8, message: 'Пароль должен содержать минимум 8 символов' } })}
                            />
                            {errors?.pass && <div className="Error">{errors.pass.message}</div>}
                            <div className="Error" hidden={isErrVisible}>Пользователь не найден</div>
                            <div>
                                <button className="ButtonVh">ВОЙТИ</button>
                            </div>
                            <div>
                                <Link to={'/reset'} className='linkHeader'>Забыли пароль?</Link>
                            </div>
                            <div className="Comp">
                                <div>
                                    <input type="checkbox" id="cb2" {...register('isPublicComputer')} /> 
                                    <label htmlFor="cb2">Чужой компьютер</label>
                                </div>
                            </div>
                            <div className="line1"></div>
                            <Link to={'/reg'} className='linkHeader'>Регистрация</Link>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Vhod;
