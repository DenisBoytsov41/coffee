import React, {useEffect, useState} from "react";
import KartTovar from "./KartTovar";
import '../styles/katalog.css';
import KartTovarOpt from "./KartTovOpt";
import KartKorz from "./KartKorz";

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
                <div className="ItemKatalog" key={index}>{el}</div>
            ))}
        </div>
    );
}

export default Katalog;

function LoadKatalog(type:string, count:number, data:any){
    const elementsArray = [];
    if(type === 'opt'){
        let datcount = !data ? 0 : data.length;
        if(count === 0 || count > datcount){
            count = datcount;
        }
        for (let i = 0; i < count; i++) {
            elementsArray.push(<KartTovarOpt name={!data ? "Loading..." : data[i].name} opis={!data ? "Loading..." : data[i].opisanie} price={!data ? "Loading..." : data[i].optprice} id={!data ? "Loading..." : data[i].id}/>);
        }
    }
    if(type === 'liked') {
        let datcount = !data ? 0 : data.length;
        if(count === 0 || count > datcount){
            count = datcount;
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
    if(type === 'korzina') {
        let datcount = !data ? 0 : data.length;
        if(count === 0 || count > datcount){
            count = datcount;
        }
        for (let i = 0; i < count; i++) {
            if(window.localStorage.getItem("basket")){
                // @ts-ignore
                if(window.localStorage.getItem("basket").includes(String(data[i].id)+":")){
                    elementsArray.push(<KartKorz name={!data ? "Loading..." : data[i].name} price={!data ? "Loading..." : data[i].price} id={!data ? "Loading..." : data[i].id}/>);
                }
            }
        }
    }
    if(type === '') {
        let datcount = !data ? 0 : data.length;
        if(count === 0 || count > datcount){
            count = datcount;
        }
        for (let i = 0; i < count; i++) {
            elementsArray.push(<KartTovar name={!data ? "Loading..." : data[i].name} opis={!data ? "Loading..." : data[i].opisanie} price={!data ? "Loading..." : data[i].price} id={!data ? "Loading..." : data[i].id}/>);
        }
    }
    return elementsArray;
}