import React, {ChangeEvent, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import "../styles/ItemAdmin.css"
import axios from "axios";

interface Props {
    id: number,
    name: string,
    opisanie: string,
    price: number,
    optprice: number,
}

function AdminItem(props: Props){

    const sendDataToServerDelete = async (data:{ mail: string, pass: string , id: number}) => {
        try {
            const res = await axios.post('http://localhost:3001/api/deleteItem', data);
            console.log(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const sendDataToServerUpdate = async (data:{ mail: string, pass: string , id: number, pole:string, value:string}) => {
        try {
            const res = await axios.post('http://localhost:3001/api/UpdateItem', data);
            console.log(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const initialValues = [props.id, props.name, props.opisanie, props.price, props.optprice];
    const [data, setData] = useState(initialValues);

    const {
        register,
        formState: { errors},
        handleSubmit
    } = useForm<Props>({mode: "onBlur"});

    const submit: SubmitHandler<Props> = data => {
        let a = window.localStorage.getItem("AdminLogin")
        if(a){
            let arr = a.split(" ")
            sendDataToServerDelete({ mail: arr[0] , pass: arr[1] , id: props.id})
            window.location.reload();
        }
    }

    const handleChange = (pole:string, index:number, e: ChangeEvent<HTMLInputElement>) => {
        const newValues = [...data];
        newValues[index] = e.target.value;
        setData(newValues);
        let a = window.localStorage.getItem("AdminLogin")
        if(a){
            let arr = a.split(" ")
            sendDataToServerUpdate({ mail: arr[0] , pass: arr[1] , id: props.id, pole: pole, value:e.target.value})
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(submit)}>
                <div className="Items">
                    <div className="PoleItem">
                        <label>Id</label>
                        <input type="number" placeholder="id" value={data[0]} className="inpItem" {...register('id')}/>
                    </div>
                    <div className="PoleItem">
                        <label>name</label>
                        <input type="text" placeholder="name" value={data[1]} className="inpItem" {...register('name')}
                               onChange={(e) => handleChange("name", 1, e)}/>
                    </div>
                    <div className="PoleItem">
                        <label>opisanie</label>
                        <input type="text" placeholder="opisanie" value={data[2]} className="inpItem" {...register('opisanie')}
                               onChange={(e) => handleChange("opisanie", 2, e)}/>
                    </div>
                    <div className="PoleItem">
                        <label>price</label>
                        <input type="number" placeholder="price" value={data[3]} className="inpItem" {...register('price')}
                               onChange={(e) => handleChange("price", 3, e)}/>
                    </div>
                    <div className="PoleItem">
                        <label>optprice</label>
                        <input type="number" placeholder="optprice" value={data[4]} className="inpItem" {...register('optprice')}
                               onChange={(e) => handleChange("optprice", 4, e)}/>
                    </div>
                    <button>УДАЛИТЬ</button>
                </div>
            </form>
        </div>
    );
}

export default AdminItem;