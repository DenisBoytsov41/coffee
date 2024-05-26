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
    const [captchaToken, setCaptchaToken] = useState('');
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

    const handleButtonClick = () => {
        setElementVisible(!isElementVisible);
    };

    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm<MyForm>({});

    const sendDataToServer = async (data: MyForm) => {
        try {
            const requestData = { ...data/*, captcha: captchaToken*/ };
            const response = await axios.post(ServHost.host + '/checkUser', requestData);
            if (response.status == 200) {
                console.log(response.data.message);
                setLoginMessage(response.data.message);
                login(response.data.refreshToken, response.data.accessToken);
            } else {
                console.error(response.data.message);
                setLoginError(response.data.message);
            }
        }
        catch (error: any) {
            console.error('Ошибка при отправке запроса: ', error);
            if (error.response && error.response.data && error.response.data.error) {
                setLoginError(error.response.data.error);
            } else {
                setLoginError('Ошибка при входе. Пожалуйста, попробуйте еще раз или обратитесь за помощью.');
            }
          }
    };

    const submit: SubmitHandler<MyForm> = data => {
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
            <div className="formVhod" hidden={!isElementVisible}>
                <form onSubmit={handleSubmit(submit)}>
                    <div className="absformVhod Comissioner">
                        <label className="lableVh">ВХОД НА САЙТ</label>
                        {loginMessage && <div className="alert alert-success">{loginMessage}</div>}
                        {loginError && <div className="alert alert-danger">{loginError}</div>}
                        <input type="text" placeholder="E-mail или Логин" className="inpVh" {...register('loginOrEmail', { required: 'Поле обязательно к заполнению!' })} />
                        {errors?.loginOrEmail && <div className="Error">{errors.loginOrEmail.message}</div>}
                        <input type="password" placeholder="Пароль" className="inpVh" {...register('pass', { required: 'Поле обязательно к заполнению!', minLength: { value: 8, message: 'Пароль должен содержать минимум 8 символов' } })} />
                        {errors?.pass && <div className="Error">{errors.pass.message}</div>}
                        <div className="Error" hidden={isErrVisible}>Пользователь не найден</div>
                        <div>
                            <button className="ButtonVh">ВОЙТИ</button>
                        </div>
                        <div>
                            <Link to={'/reset'} className='linkHeader'>Забыли пароль?</Link>
                        </div>
                        <div className="Comp">
                            <div><input type="checkbox" id="cb1" /> <label htmlFor="cb1">Чужой компьютер</label></div>
                        </div>
                        <div className="line1"></div>
                        <Link to={'/reg'} className='linkHeader'>Регистрация</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Vhod;
