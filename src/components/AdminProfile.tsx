import React, {useEffect, useState} from "react";
import axios from "axios";
import AdminItem from "./AdminItem";
import ServHost from "../serverHost.json"

function AdminProfile(){

    const sendDataToServerAddItem = async (data:{ mail: string, pass: string }) => {
        try {
            const res = await axios.post(ServHost.host + '/addItem', data);
            console.log(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const Exit = () =>{
        window.localStorage.removeItem("AdminLogin")
        window.location.reload();
    }

    const Add = () =>{
        let a = window.localStorage.getItem("AdminLogin")
        if(a){
            let arr = a.split(" ")
            sendDataToServerAddItem({ mail: arr[0] , pass: arr[1] })
            window.location.reload();
        }
    }

    const [data, setData] = useState(null);

    useEffect(()=>{
        fetch(ServHost.host + '/tovar')
            .then(res => res.json())
            .then(res => setData(res))
    }, [])

    return(
        <div>
            {LoadKatalog(0, data).map((el, index) => (
                <div key={index}>{el}</div>
            ))}
            <button onClick={Add}>ДОБАВИТЬ</button>
            <button onClick={Exit}>ВЫЙТИ</button>
        </div>
    );
}

export default AdminProfile;

function LoadKatalog(count: number, data: any) {
    const elementsArray = [];
    let datcount = !data ? 0 : data.length;
    if(count === 0 || count > datcount){
        count = datcount;
    }
    for (let i = 0; i < count; i++) {
        elementsArray.push(<AdminItem name={!data ? "Loading..." : data[i].name} opisanie={!data ? "Loading..." : data[i].opisanie} price={!data ? "Loading..." : data[i].price} id={!data ? "Loading..." : data[i].id} optprice={!data ? "Loading..." : data[i].optprice}/>);
    }
    return elementsArray;
}