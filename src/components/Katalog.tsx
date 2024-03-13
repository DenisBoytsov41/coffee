import React, {useEffect, useState} from "react";
import KartTovar from "./KartTovar";
import '../styles/katalog.css';
import KartTovarOpt from "./KartTovOpt";

interface Props {
    type: string;
    katcount: number;
}

function Katalog(props: Props) {

    const [data, setData] = useState(null);

    useEffect(()=>{
        fetch('http://localhost:3001/api/tovar')
            .then(res => res.json())
            .then(res => setData(res))
    }, [])

    return(
        <div className='katalog'>
            {LoadKatalog(props.type,props.katcount, data).map((el, index) => (
                <div key={index}>{el}</div>
            ))}
        </div>
    );
}

export default Katalog;

function LoadKatalog(type:string, count:number, data:any){
    const elementsArray = [];
    if(type === 'opt'){
        if(count===0){
            count = !data ? 0 : data.length;
        }
        for (let i = 0; i < count; i++) {
            elementsArray.push(<KartTovarOpt name={!data ? "Loading..." : data[i].name} opis={!data ? "Loading..." : data[i].opisanie} price={!data ? "Loading..." : data[i].optprice} id={!data ? "Loading..." : data[i].id}/>);
        }
    }
    if(type === 'liked') {
        if(count===0){
            count = !data ? 0 : data.length;
        }
        for (let i = 0; i < count; i++) {
            if(window.localStorage.getItem("liked")){
                // @ts-ignore
                if(window.localStorage.getItem("liked").includes(String(data[i].id))){
                    elementsArray.push(<KartTovar name={!data ? "Loading..." : data[i].name} opis={!data ? "Loading..." : data[i].opisanie} price={!data ? "Loading..." : data[i].price} id={!data ? "Loading..." : data[i].id}/>);
                }
            }
        }
    }
    if(type === '') {
        if(count===0){
            count = !data ? 0 : data.length;
        }
        for (let i = 0; i < count; i++) {
            elementsArray.push(<KartTovar name={!data ? "Loading..." : data[i].name} opis={!data ? "Loading..." : data[i].opisanie} price={!data ? "Loading..." : data[i].price} id={!data ? "Loading..." : data[i].id}/>);
        }
    }
    return elementsArray;
}