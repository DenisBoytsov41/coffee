import React, { ChangeEvent, useRef, useState } from "react";
import { SubmitHandler, useForm, FieldValues } from "react-hook-form";
import "../styles/ItemAdmin.css";

interface UniversalTableItemProps<T extends FieldValues> {
    data: T;
    onUpdate?: (data: T) => void;
    onDelete?: () => void;
    onAdd?: () => void;
    fields: { label: string; key: keyof T; type: "text" | "number" }[];
    imagePathField?: keyof T;
    allowImageUpload?: boolean;
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
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm<T>({ mode: "onBlur" });

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setImage(files[0]);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(files[0]);
        }
    };

    const submit: SubmitHandler<T> = (data) => {
        if (props.allowImageUpload && props.imagePathField && image) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (props.imagePathField) {
                    data[props.imagePathField] = reader.result as any;
                }
                sendDataToServerUpdate(data);
            };
            reader.readAsDataURL(image);
        } else {
            sendDataToServerUpdate(data);
        }
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
                    {props.allowImageUpload && (
                        <div className="PoleItem">
                            <label className="UploadImageLabel" htmlFor="image">Выберите изображение</label>
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="UploadImageButton"
                            />
                            <label htmlFor="image" className="UploadImageButtonLabel">
                                Выбрать файл
                            </label>
                        </div>
                    )}
                    {props.allowImageUpload && imagePreview && (
                        <div className="PoleItem">
                            <img src={imagePreview} alt="Предварительный просмотр" className="PreviewImage" />
                        </div>
                    )}
                    {props.allowImageUpload && props.imagePathField && formData[props.imagePathField] && !imagePreview && (
                        <div className="PoleItem">
                            <img src={formData[props.imagePathField] as any} alt="Товар" className="PreviewImage" />
                        </div>
                    )}
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
