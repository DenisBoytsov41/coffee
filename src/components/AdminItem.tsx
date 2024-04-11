import React, {ChangeEvent, useRef, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import "../styles/ItemAdmin.css"
import axios from "axios";
import ServHost from "../serverHost.json"

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
            const res = await axios.post(ServHost.host + '/deleteItem', data);
            console.log(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const sendDataToServerUpdate = async (data:{ mail: string, pass: string , id: number, name: string, opisanie: string, price: number, optprice: number}) => {
        try {
            const res = await axios.post(ServHost.host + '/UpdateItem', data);
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

    const submit: SubmitHandler<Props> = (data, event) => {
        let a = window.localStorage.getItem("AdminLogin")
        if(a){
            // @ts-ignore
            if(event.nativeEvent.submitter === deleteBtn.current){
                let arr = a.split(" ")
                sendDataToServerDelete({ mail: arr[0] , pass: arr[1] , id: props.id})
                window.location.reload();
            }
            else {
                // @ts-ignore
                if(event.nativeEvent.submitter === saveBtn.current){
                    let arr = a.split(" ")
                    sendDataToServerUpdate({ mail: arr[0] , pass: arr[1] , id: props.id, name: data.name, opisanie: data.opisanie, price: data.price, optprice: data.optprice });
                    window.location.reload();
                }
            }
        }
    }

    const deleteBtn = useRef(null);
    const saveBtn = useRef(null);

    const handleChange = (index:number, e: ChangeEvent<HTMLInputElement>) => {
        const newValues = [...data];
        newValues[index] = e.target.value;
        setData(newValues);
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
                               onChange={(e) => handleChange( 1, e)}/>
                    </div>
                    <div className="PoleItem">
                        <label>opisanie</label>
                        <input type="text" placeholder="opisanie" value={data[2]} className="inpItem" {...register('opisanie')}
                               onChange={(e) => handleChange( 2, e)}/>
                    </div>
                    <div className="PoleItem">
                        <label>price</label>
                        <input type="number" placeholder="price" value={data[3]} className="inpItem" {...register('price')}
                               onChange={(e) => handleChange( 3, e)}/>
                    </div>
                    <div className="PoleItem">
                        <label>optprice</label>
                        <input type="number" placeholder="optprice" value={data[4]} className="inpItem" {...register('optprice')}
                               onChange={(e) => handleChange( 4, e)}/>
                    </div>
                    <div className="gapButton">
                        <button ref={deleteBtn} type="submit" className="ButtonAdm">УДАЛИТЬ</button>
                        <button ref={saveBtn} type="submit" className="ButtonAdm">СОХРАНИТЬ</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default AdminItem;