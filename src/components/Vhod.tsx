import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import profile from "../images/Profile.png";
import '../styles/KastomCheckBox.css';
import {SubmitHandler, useForm} from "react-hook-form";
import axios from "axios";
import ServHost from "../serverHost.json"

interface MyForm {
    mail: string;
    pass: string;
}


function Vhod(){

    const [isElementVisible, setElementVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);
    const [isErrVisible, setErrVisible] = useState(true);

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

    const {register,
        formState: { errors},
        handleSubmit
    } = useForm<MyForm>({});

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
        <div ref={elementRef}>
            <button onClick={handleButtonClick} className="btnVh">
                <img src={profile} alt="profile" className="imgVH"/>
                <div className='linkHeader Comissioner'>
                    Вход
                </div>
            </button>
            <div className="formVhod" hidden={!isElementVisible}>
                <form onSubmit={handleSubmit(submit)}>
                    <div className="absformVhod Comissioner">
                        <label className="lableVh">ВХОД НА САЙТ</label>
                        <input type="text" placeholder="E-mail" className="inpVh" {...register('mail', {required: true})}/>
                        <input type="password" placeholder="Пароль" className="inpVh" {...register('pass', {required: true})}/>
                        {(errors?.pass || errors?.mail) && <div className="Error">Не все поля заполнены</div>}
                        <div className="Error" hidden={isErrVisible}>Пользователь не найден</div>
                        <div>
                            <button className="ButtonVh">ВОЙТИ</button>
                        </div>
                        <div>
                            <Link to={'/reset'} className='linkHeader'>Забыли пароль?</Link>
                        </div>
                        <div className="Comp">
                            <div><input type="checkbox" id="cb1"/> <label htmlFor="cb1">Чужой компьютер</label></div>
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