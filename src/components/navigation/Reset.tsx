import React, {useEffect} from "react";
import Hader from "../Hader";
import Futer from "../Futer";
import '../../styles/Reset.css';
import axios from "axios";
import ServHost from "../../serverHost.json";
import {SubmitHandler, useForm} from "react-hook-form";

interface MyForm {
    mail: string;
}

function Reset() {

    const sendDataToServer = async (data:{ mail: string }) => {
        try {
            const res = await axios.post(ServHost.host + '/SendMailReset', data);
            if(res.data.res !== ""){
                console.log(res.data.res)

            }
        } catch (error) {
            console.error(error);
        }
    };

    const submit: SubmitHandler<MyForm> = data => {
        sendDataToServer(data);
    }

    const {register,
        formState: { errors},
        handleSubmit
    } = useForm<MyForm>({});

    return(
        <div>
            <Hader/>
            <div className="contApp">
                <form onSubmit={handleSubmit(submit)}>
                    <div className="noabsformVhod">
                        <label className="lableVhlog">ВОССТАНОВЛЕНИЕ ПАРОЛЯ</label>

                        <input type="text" placeholder="* E-mail"
                               className="inpVhlog" {...register('mail', {
                            required: true,
                            pattern: {
                                value: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu,
                                message: 'Почта неправильного вида'
                            }
                        })}/>
                        {errors?.mail && <div className="Error">{errors?.mail?.message || 'Поле обязательно к заполнению!'}</div>}
                        <div className="ResText">
                            Введите адрес электронной почты, и мы отправим на него ваш пароль.
                        </div>
                        <div>
                            <button className="ButtonRes">ПРОДОЛЖИТЬ</button>
                        </div>
                    </div>
                </form>
            </div>
            <Futer/>
        </div>
    );
}

export default Reset;