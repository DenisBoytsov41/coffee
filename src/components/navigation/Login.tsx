import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import '../../styles/Login.css';
import '../../styles/KastomCheckBox.css';
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import ServHost from "../../serverHost.json";
import Hader from "../Hader";
import Futer from "../Futer";
import { useAuth } from './AuthContext';

interface MyForm {
    loginOrEmail: string;
    pass: string;
}

declare global {
    interface Window {
        grecaptcha: any;
    }
}

function Login() {
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

    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm<MyForm>({ mode: "onBlur" });

   

    const sendDataToServer = async (data: MyForm) => {
        try {
            const requestData = { ...data/*, captcha: captchaToken*/ };
            const response = await axios.post(ServHost.host + '/checkUser', requestData);
            if (response.status == 200) {
                console.log(response.data.message);
                setLoginMessage(response.data.message);
                login(response.data.refreshToken, response.data.accessToken);
                window.location.replace("/");
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
    

    const submit: SubmitHandler<MyForm> = (data) => {
        sendDataToServer(data);
    };

    return (
        <div>
            <Hader />
            <div className="contApp">
                <form id="logForm" onSubmit={handleSubmit(submit)}>
                    <div className="noabsformVhod">
                        <label className="lableVhlog">АВТОРИЗАЦИЯ</label>
                        {loginMessage && <div className="alert alert-success">{loginMessage}</div>}
                        {loginError && <div className="alert alert-danger">{loginError}</div>}
                        <input
                            type="text"
                            placeholder="Введите E-mail или Логин"
                            className="inpVhlog"
                            {...register('loginOrEmail', { required: 'Поле обязательно к заполнению!' })}
                        />
                        {errors?.loginOrEmail && <div className="Error">{errors.loginOrEmail.message}</div>}
                        <input
                            type="password"
                            placeholder="Введите Пароль"
                            className="inpVhlog"
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
                            <div><input type="checkbox" id="cb2" /> <label htmlFor="cb2">Чужой компьютер</label></div>
                        </div>
                        <div className="line1"></div>
                        <Link to={'/reg'} className='linkHeader'>Регистрация</Link>
                    </div>
                </form>
            </div>
            <Futer className="footer"/>
        </div>
    );
}

export default Login;
