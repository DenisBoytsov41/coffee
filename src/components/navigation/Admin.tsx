import React, {useEffect, useState} from "react";
import AdminLogin from "../AdminLogin";
import AdminProfile from "../AdminProfile";
import axios from "axios";
import ServHost from "../../serverHost.json"

function Admin(){

    const sendDataToServer = async (data:{ mail: string, pass: string }) => {
        try {
            const res = await axios.post(ServHost.host + '/loginAdmin', data);
            console.log(res.data.res);
            if(res.data.res){
                setContent(<AdminProfile/>)
            }
        } catch (error) {
            console.error(error);
        }
    };

    const [content, setContent] = useState(() => {
        const initialState = function () {
            let a = window.localStorage.getItem("AdminLogin")
            if(a){
                let data = a.split(" ")
                sendDataToServer({mail: data[0], pass: data[1]});
            }
            return <AdminLogin/>
        }
        return initialState()
    })

    return (
        <div>
            {content}
        </div>
);
}

export default Admin;