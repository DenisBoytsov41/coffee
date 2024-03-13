import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import profile from "../images/Profile.png";
import '../styles/KastomCheckBox.css';
import {SubmitHandler, useForm} from "react-hook-form";

interface MyForm {
    mail: string;
    pass: string;
}


function Vhod(){

    const [isElementVisible, setElementVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

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

    const submit: SubmitHandler<MyForm> = data => {
        console.log('Отправка формы');
    }

    return(
        <div ref={elementRef}>
            <button onClick={handleButtonClick} className="btnVh">
                <img src={profile} alt="profile" className="imgVH"/>
                <div className='linkHeader'>
                    Вход
                </div>
            </button>
            <div className="formVhod" hidden={!isElementVisible}>
                <form onSubmit={handleSubmit(submit)}>
                    <div className="absformVhod">
                        <label className="lableVh">ВХОД НА САЙТ</label>
                        <input type="text" placeholder="E-mail" className="inpVh" {...register('mail', {required: true})}/>
                        <input type="password" placeholder="Пароль" className="inpVh" {...register('pass', {required: true})}/>
                        {(errors?.pass || errors?.mail) && <div className="Error">Не все поля заполнены</div>}
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