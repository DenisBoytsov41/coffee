import React, {ChangeEvent, useEffect, useState} from "react";
import Hader from "../Hader";
import Futer from "../Futer";
import '../../styles/Reset.css';
import {SubmitHandler, useForm} from "react-hook-form";
import axios from "axios";
import profile from "../../images/Profile.jpg";
import {Link} from "react-router-dom";
import Vhod from "../Vhod";
import ServHost from "../../serverHost.json"

interface MyForm {
    name: string,
    mail: string,
    pass: string,
    passp: string,
    tel: string,
    maillog: string,
    passlog: string
}

function Profile() {

    useEffect(() => {
        return () => {
            document.title = "Профиль";
        };
    }, []);

    const {
        register,
        watch,
        formState: { errors},
        handleSubmit
    } = useForm<MyForm>({mode: "onBlur"});

    const [data,setData] = useState(() => {
        const initialState = function () {
            return ["", "", ""]
        }
        return initialState()
    })

    const handleChange = ( index:number, e: ChangeEvent<HTMLInputElement>) => {
        const newValues = [...data];
        newValues[index] = e.target.value;
        setData(newValues);
    }

    const submit: SubmitHandler<MyForm> = data1 => {
        sendDataToServerUpdateInfoUser(data1)
    }

    const sendDataToServerUpdateInfoUser = async (data1:{name: string, mail: string, pass: string, passp: string, tel: string, maillog: string, passlog: string}) => {
        try {
            let a = window.localStorage.getItem("Login")
            if(a){
                data1.maillog = a.split(" ")[0]
                data1.passlog = a.split(" ")[1]
            }
            if(data1.name === ""){
                data1.name = data[0]
            }
            if(data1.mail === ""){
                data1.mail = data[1]
            }
            if(data1.tel === ""){
                data1.tel = data[2]
            }
            console.log(data1)
            window.localStorage.setItem("Login",String(data1.mail) + " " + String(data1.passlog))
            if(data1.pass !== "" && data1.passp !== ""){
                window.localStorage.setItem("Login",String(data1.mail) + " " + String(data1.passp))
            }
            const res = await axios.post(ServHost.host + '/UpdateInfoUser', data1);
        } catch (error) {
            console.error(error);
        }
    };

    const sendDataToServerCheckUser = async (data1:{ mail: string, pass: string }) => {
        try {
            const res = await axios.post(ServHost.host + '/checkUser', data1);
            if(!res.data.res){
                window.location.replace("/login")
            }
        } catch (error) {
            console.error(error);
        }
    };

    const sendDataToServerGetInfoUser = async (data1:{ mail: string, pass: string }) => {
        try {
            const res = await axios.post(ServHost.host + '/GetInfoUser', data1);
            setData([res.data.name,res.data.mail,res.data.tel])
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        let a = window.localStorage.getItem('Login')
        if(a){
            sendDataToServerCheckUser({ mail: a.split(" ")[0], pass: a.split(" ")[1] })
            sendDataToServerGetInfoUser({ mail: a.split(" ")[0], pass: a.split(" ")[1] })
        }
        else {
            window.location.replace("/login")
        }
    }, []);

    return(
        <div>
            <Hader/>
            <div className="contApp">
                <form onSubmit={handleSubmit(submit)}>
                    <div className="noabsformVhod">
                        <label className="lableVhlog">Пользовательские Данные</label>
                        <input type="text" placeholder="Имя" value={data[0]} className="inpVhlog" {...register('name')}
                               onChange={(e) => handleChange( 0, e)}/>
                        <input type="text" placeholder="E-mail" value={data[1]} className="inpVhlog" {...register('mail')}
                               onChange={(e) => handleChange( 1, e)}/>
                        <input type="text" placeholder="Телефон" value={data[2]} className="inpVhlog" {...register('tel')}
                               onChange={(e) => handleChange( 2, e)}/>
                        <label className="lableVhlog">Смена пароля</label>
                        <input type="text" placeholder="Старый Пароль" className="inpVhlog" {...register('pass')}/>
                        <input type="text" placeholder="Новый Пароль" className="inpVhlog" {...register('passp')}/>
                        <div className="warrior_black">Если хотите поменять только Пользовательские данные не затрагивая пароль, оставьте поля с паролями пустыми</div>
                        <div>
                            <button className="ButtonRes">СОХРАНИТЬ</button>
                        </div>
                    </div>
                </form>
            </div>
            <Futer/>
        </div>
    );
}

export default Profile;