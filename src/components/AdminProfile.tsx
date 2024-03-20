import React from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import axios from "axios";

interface MyForm {
    pass: string,
    login: string,
}

function AdminProfile(){

    const sendDataToServer = async (data:{ login: string, pass: string }) => {
        try {
            const res = await axios.post('http://localhost:3001/api/loginAdmin', data);
            console.log(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const {
        register,
        formState: { errors},
        handleSubmit
    } = useForm<MyForm>({mode: "onBlur"});

    const submit: SubmitHandler<MyForm> = data => {
        console.log(data);
        sendDataToServer(data);
        window.localStorage.removeItem("AdminLogin")
        window.location.reload();
    }

    return (
        <div>
            <form onSubmit={handleSubmit(submit)}>
                привет
                <button>ВЫЙТИ</button>
            </form>
        </div>
    );
}

export default AdminProfile;