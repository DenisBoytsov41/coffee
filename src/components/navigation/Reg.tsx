import React, {useEffect} from "react";
import Hader from "../Hader";
import Futer from "../Futer";
import {SubmitHandler, useForm} from "react-hook-form";
import IMask from "imask";

interface MyForm {
    name: string,
    mail: string,
    pass: string,
    passp: string,
    tel: string,
}

function Reg(){

    useEffect(() => {
        return () => {
            document.title = "Регистрация нового аккаунта";
            if (document.getElementById('tel')){
                const element = document.getElementById('tel');
                const maskOptions = {
                    mask: '+7(000)000-00-00',
                    lazy: false
                }
                // @ts-ignore
                const mask = new IMask(element, maskOptions);
            }
        };
    }, []);

    const {
        register,
        watch,
        formState: { errors},
        handleSubmit
    } = useForm<MyForm>({mode: "onBlur"});

    const submit: SubmitHandler<MyForm> = data => {
        console.log(data);
    }

    const confPass = (value:string) => {
        const sameValue = watch('pass');
        return value === sameValue || 'Пароли не совпадают';
    };

    return(
        <div>
            <Hader/>
            <div className="contApp">
                <form onSubmit={handleSubmit(submit)}>
                    <div className="noabsformReg">
                        <label className="lableVhlog">РЕГИСТРАЦИЯ</label>
                        <div>Основные данные</div>
                        <input type="text" placeholder="* Имя и Фамилия"
                               className="inpVhlog" {...register('name', {
                            required: true,
                            minLength: {
                                value: 5,
                                message: 'Минимальное количество символов 5'
                            }
                        })}/>
                        {errors?.name && <div className="Error">{errors?.name?.message || 'Поле обязательно к заполнению!'}</div>}
                        <input type="text" placeholder="* E-mail"
                               className="inpVhlog" {...register('mail', {
                            required: true,
                            pattern: {
                                value: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu,
                                message: 'Почта неправильного вида'
                            }
                        })}/>
                        {errors?.mail && <div className="Error">{errors?.mail?.message || 'Поле обязательно к заполнению!'}</div>}
                        <input type="text" placeholder="* Телефон" id="tel"
                               className="inpVhlog" {...register('tel')}/>
                        <div>Ваш пароль</div>
                        <input type="password" placeholder="* Пароль"
                               className="inpVhlog" {...register('pass', {
                            required: true,
                            minLength: {
                                value: 5,
                                message: 'Min length is 5 characters'
                            },
                            maxLength: {
                                value: 10,
                                message: 'Max length is 10 characters'
                            }
                        })}/>
                        {errors?.pass && <div className="Error">{errors?.pass?.message || 'Поле обязательно к заполнению!'}</div>}
                        <input type="password" placeholder="* Подтвердите Пароль"
                               className="inpVhlog" {...register('passp', {
                            required: true,
                            validate: confPass
                        })}/>
                        {errors?.passp && <div className="Error">{errors?.passp?.message || 'Поле обязательно к заполнению!'}</div>}
                        <div>
                            <button className="ButtonReg">Зарегистрироваться</button>
                        </div>
                        <div className="warrior"> При создании нового аккаунта, вы даёте согласие на обработку персональных данных</div>
                    </div>
                </form>
            </div>
            <Futer/>
        </div>
    );
}

export default Reg;