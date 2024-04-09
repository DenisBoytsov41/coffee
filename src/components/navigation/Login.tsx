import React, {useEffect, useState} from "react";
import Hader from "../Hader";
import Futer from "../Futer";
import {Link} from "react-router-dom";
import '../../styles/Login.css';
import '../../styles/KastomCheckBox.css';
import {SubmitHandler, useForm} from "react-hook-form";
import axios from "axios";
import AdminProfile from "../AdminProfile";
import ServHost from "../../serverHost.json"

interface MyForm {
    mail: string;
    pass: string;
}

function Login(){

    const [isErrVisible, setErrVisible] = useState(true);

    useEffect(() => {
        let a = window.localStorage.getItem("Login")
        if(a){
            sendDataToServer({ mail: a.split(' ')[0], pass: a.split(' ')[1] });
        }
        return () => {
            document.title = "Вход в аккаунт";
        };
    }, []);

    const {
        register,
        formState: { errors},
        handleSubmit
    } = useForm<MyForm>({mode: "onBlur"});

    const sendDataToServer = async (data:{ mail: string, pass: string }) => {
        try {
            const res = await axios.post(ServHost.host + '/checkUser', data);
            if(res.data.res){
                window.localStorage.setItem("Login", data.mail + " " + data.pass)
                window.location.replace("/");
            }
            else {
                setErrVisible(false)
            }
        } catch (error) {
            console.error(error);
        }
    };

    const submit: SubmitHandler<MyForm> = data => {
        sendDataToServer(data);
    }

    return(
        <div>
            <Hader/>
            <div className="contApp">
                <form onSubmit={handleSubmit(submit)}>
                    <div className="noabsformVhod">
                        <label className="lableVhlog">АВТОРИЗАЦИЯ</label>
                        <input type="text" placeholder="Введите E-mail"
                               className="inpVhlog" {...register('mail', {required: true})}/>
                        {errors?.mail && <div className="Error">Поле обязательно к заполнению!</div>}
                        <input type="password" placeholder="Введите Пароль"
                               className="inpVhlog" {...register('pass', {required: true})}/>
                        {errors?.pass && <div className="Error">Поле обязательно к заполнению!</div>}
                        <div className="Error" hidden={isErrVisible}>Пользователь не найден</div>
                        <div>
                            <button className="ButtonVh">ВОЙТИ</button>
                        </div>
                        <div>
                            <Link to={'/reset'} className='linkHeader'>Забыли пароль?</Link>
                        </div>
                        <div className="Comp">
                            <div><input type="checkbox" id="cb2"/> <label htmlFor="cb2">Чужой компьютер</label></div>
                        </div>
                        <div className="line1"></div>
                        <Link to={'/reg'} className='linkHeader'>Регистрация</Link>
                    </div>
                </form>
            </div>
            <Futer/>
        </div>
    );
}

export default Login;