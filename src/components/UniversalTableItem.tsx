import React, { ChangeEvent, useRef, useState } from "react";
import { SubmitHandler, useForm, FieldValues } from "react-hook-form";
import "../styles/ItemAdmin.css";
import axios from "axios";

interface UniversalTableItemProps<T extends FieldValues> {
    data: T;
    onUpdate?: (data: T) => void;
    onDelete?: () => void;
    onAdd?: () => void;
    fields: { label: string; key: keyof T; type: "text" | "number" }[];
}

function UniversalTableItem<T extends FieldValues>(props: UniversalTableItemProps<T>) {
    const sendDataToServerDelete = async () => {
        try {
            if (props.onDelete) {
                await props.onDelete();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const sendDataToServerUpdate = async (data: T) => {
        try {
            if (props.onUpdate) {
                await props.onUpdate(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const [formData, setFormData] = useState<T>(props.data);

    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm<T>({ mode: "onBlur" });

    const submit: SubmitHandler<T> = (data) => {
        sendDataToServerUpdate(data);
    };

    const deleteBtn = useRef<HTMLButtonElement>(null);

    return (
        <div>
            <form onSubmit={handleSubmit(submit)}>
                <div className="Items">
                    {props.fields.map((field, index) => (
                        <div className="PoleItem" key={index}>
                            <label>{field.label}</label>
                            <input
                                type={field.type}
                                placeholder={field.label}
                                value={formData[field.key] as any}
                                className="inpItem"
                                {...register(field.key as any)}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setFormData({ ...formData, [field.key]: e.target.value })
                                }
                            />
                        </div>
                    ))}
                    <div className="gapButton">
                        {props.onDelete && (
                            <button ref={deleteBtn} type="button" onClick={sendDataToServerDelete} className="ButtonAdm">
                                УДАЛИТЬ
                            </button>
                        )}
                        <button type="submit" className="ButtonAdm">
                            СОХРАНИТЬ
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default UniversalTableItem;
