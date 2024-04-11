import React, {useEffect, useState} from "react";
import axios from "axios";
import AdminItem from "./AdminItem";
import ServHost from "../serverHost.json"
import "../styles/ItemAdmin.css"

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
            <br/>
            <br/>
            <br/>
            <div className="Error">При внесении изменений не забывайте их СОХРАНЯТЬ</div>
            <br/>
            <div className="Error">По нажатию на СОХРАНИТЬ происходить изменение только того товара, рядом с которым
                была нажата кнопка, после чего страница обновится
            </div>
            <br/>
            <div className="Error">!!! ВНОСИТЕ ИЗМЕНЕНИЯ КАЖДОГО ТОВАРА ОТДЕЛЬНО !!!</div>
            <br/>
            <div className="Error">!!! Поля NAME и OPISANIE имеют ОГРАНИЧЕНИЯ максимум 100 и 120 символов соответственно !!!</div>
            <br/>
            <br/>
            <br/>
            {LoadKatalog(0, data).map((el, index) => (
                <div key={index}>{el}</div>
            ))}
            <br/>
            <br/>
            <div className="gapButton">
                <button onClick={Add} className="ButtonAdm">ДОБАВИТЬ</button>
                <button onClick={Exit} className="ButtonAdm">ВЫЙТИ</button>
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
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