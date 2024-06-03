import React, { ChangeEvent, useRef, useState } from "react";
import { SubmitHandler, useForm, FieldValues } from "react-hook-form";
import "../styles/ItemAdmin.css";


interface UniversalTableItemProps<T extends FieldValues> {
    data: T;
    onUpdate?: (data: T, PhotoPath: File | null) => void;
    onDelete?: () => void;
    onAdd?: () => void;
    onDownloadImage?: (PhotoPath: string) => void;
    onDeleteImage?: () => void;
    fields: { label: string; key: keyof T; type: "text" | "number"; readOnly?: boolean }[];
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

    const sendDataToServerUpdate = async (itemData: T, PhotoPath: File | null) => {
        try {
            if (props.onUpdate) {
                await props.onUpdate(itemData, PhotoPath);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const [formData, setFormData] = useState<T>(props.data);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [images, setImages] = useState<{ [key: string]: { file: File | null, preview: string | null } }>({});

    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm<T>({ mode: "onBlur" });

    const updateImageState = (key: string, file: File | null, preview: string | null) => {
        setImages(prevState => ({
            ...prevState,
            [key]: { file, preview }
        }));
    };
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            console.log(files);
            setImage(files[0]);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                // Используем уникальный ключ для каждого элемента таблицы
                console.log(props);
                console.log(props.data.id);
                updateImageState(props.data.id.toString(), files[0], reader.result as string);
            };
            reader.readAsDataURL(files[0]);
        }
    };

    const submit: SubmitHandler<T> = (data) => {
        if (props.allowImageUpload && props.imagePathField && image) {
            sendDataToServerUpdate(data, image);
        } else {
            sendDataToServerUpdate(data, null);
        }
    };

    const handleDownloadImage = () => {
        console.log("Кнопка 'Скачать изображение' нажата");
        if (props.onDownloadImage && props.imagePathField && formData[props.imagePathField]) {
            props.onDownloadImage(formData[props.imagePathField] as string);
        } else {
            console.error("Функция загрузки изображения или путь к изображению не определены");
        }
    };

    const handleDeleteImage = () => {
        console.log("Кнопка 'Удалить изображение' нажата");
        if (props.onDeleteImage && props.imagePathField) {
            props.onDeleteImage();
            setImage(null);
            setImagePreview(null);
            setFormData({ ...formData, [props.imagePathField]: "" } as T);
        } else {
            console.error("Функция удаления изображения или поле пути изображения не определены");
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
                                readOnly={field.readOnly}
                            />
                        </div>
                    ))}
                    {props.allowImageUpload && (
                        <div className="PoleItem">
                            <label className="UploadImageLabel" htmlFor={`image-${props.data.id}`}>Выберите изображение</label>
                            <input
                                type="file"
                                id={`image-${props.data.id}`}
                                accept="image/*"
                                onChange={(e) => handleImageChange?.(e)}
                                className="UploadImageButton"
                            />
                            <label htmlFor={`image-${props.data.id}`} className="UploadImageButtonLabel">
                                Выбрать файл
                            </label>
                        </div>
                    )}
                    {props.allowImageUpload && imagePreview && (
                        <div className="PoleItem">
                            <img src={imagePreview} alt="Предварительный просмотр" className="PreviewImage" />
                        </div>
                    )}
                    {props.allowImageUpload && props.imagePathField && formData[props.imagePathField as keyof T] && !imagePreview && (
                        <div className="PoleItem">
                            <img src={formData[props.imagePathField as keyof T] as any} alt="Товар" className="PreviewImage" />
                        </div>
                    )}
                    {props.allowImageUpload && props.imagePathField && formData[props.imagePathField as keyof T] && (
                        <div className="PoleItem">
                            <button type="button" onClick={handleDownloadImage} className="ButtonAd">
                                СКАЧАТЬ ИЗОБРАЖЕНИЕ
                            </button>
                            <button type="button" onClick={handleDeleteImage} className="ButtonAd">
                                УДАЛИТЬ ИЗОБРАЖЕНИЕ
                            </button>
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
