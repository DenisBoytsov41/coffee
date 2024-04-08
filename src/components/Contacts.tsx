import React, {useEffect, useRef, useState} from "react";
import tg from "../images/TG.png";

function Contacts(){

    const [isElementVisible, setElementVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (elementRef.current && !elementRef.current.contains(event.target as Node | null)) {
            setElementVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleButtonClick = () => {
        setElementVisible(!isElementVisible);
    };

    return(
        <div ref={elementRef}>
            <button onClick={handleButtonClick} className="btnCont">
                <div className='linkHeader Comissioner'>
                    Контакты
                </div>
            </button>
            <div className="formCont Comissioner" hidden={!isElementVisible}>
                <div className="absformCont">
                    <div className="contText">
                        info@godinecoffee.ru
                    </div>
                    <div className="line1"></div>
                    <div className="contText">
                        +7(915)923-81-62
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contacts;