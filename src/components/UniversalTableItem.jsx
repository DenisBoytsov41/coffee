import React, { ChangeEvent, useRef, useState } from "react";
import axios from "axios";
import ServHost from "../serverHost.json";
import "../styles/AdminItem.css";

function UniversalTableItem({ data, onSubmit, onDelete }) {
    const deleteBtn = useRef(null);
    const saveBtn = useRef(null);

    const handleChange = (index, e) => {
        const newData = { ...data };
        newData[index] = e.target.value;
        setData(newData);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let a = window.localStorage.getItem("AdminLogin");
        if (a) {
            if (event.nativeEvent.submitter === deleteBtn.current) {
                let arr = a.split(" ");
                onDelete({ mail: arr[0], pass: arr[1], id: data.id });
                window.location.reload();
            } else if (event.nativeEvent.submitter === saveBtn.current) {
                let arr = a.split(" ");
                onSubmit({ ...data, mail: arr[0], pass: arr[1] });
                window.location.reload();
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="Items">
                    {Object.entries(data).map(([key, value]) => (
                        <div className="PoleItem" key={key}>
                            <label>{key}</label>
                            <input type="text" value={value} className="inpItem" onChange={(e) => handleChange(key, e)} />
                        </div>
                    ))}
                    <div className="gapButton">
                        <button ref={deleteBtn} type="submit" className="ButtonAdm">
                            DELETE
                        </button>
                        <button ref={saveBtn} type="submit" className="ButtonAdm">
                            SAVE
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default UniversalTableItem;
