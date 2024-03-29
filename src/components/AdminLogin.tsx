import React from "react";
import {SubmitHandler, useForm} from "react-hook-form";

interface MyForm {
    pass: string,
    mail: string,
}

function AdminLogin(){

    const {
        register,
        formState: { errors},
        handleSubmit
    } = useForm<MyForm>({mode: "onBlur"});

    const submit: SubmitHandler<MyForm> = data => {
        window.localStorage.setItem("AdminLogin", data.mail + " " + data.pass)
        window.location.reload();
    }

    return (
        <div>
            <form onSubmit={handleSubmit(submit)}>
                <input type="text" placeholder="mail"
                       className="inpVhlog" {...register('mail', {required: true})}/>
                {errors?.mail && <div className="Error">Поле обязательно к заполнению!</div>}
                <input type="password" placeholder="Пароль"
                       className="inpVhlog" {...register('pass', {required: true})}/>
                {errors?.pass && <div className="Error">Поле обязательно к заполнению!</div>}
                <button>ВОЙТИ</button>
            </form>
        </div>
    );
}

export default AdminLogin;