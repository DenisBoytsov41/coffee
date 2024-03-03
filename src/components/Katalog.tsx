import React, {useEffect, useState} from "react";
import KartTovar from "./KartTovar";
import '../styles/katalog.css';

interface Props {
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
            {LoadKatalog(props.katcount, data).map((el, index) => (
                <div key={index}>{el}</div>
            ))}
        </div>
    );
}

export default Katalog;

function LoadKatalog(count:number, data:any){
    if(count===0){
        count = !data ? 0 : data.length;
    }
    const elementsArray = [];
    for (let i = 0; i < count; i++) {
        elementsArray.push(<KartTovar name={!data ? "Loading..." : data[i].name} opis={!data ? "Loading..." : data[i].opisanie} price={!data ? "Loading..." : data[i].price} id={!data ? "Loading..." : data[i].id}/>);
    }
    return elementsArray;
}