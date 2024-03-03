import React from "react";
import {Link} from "react-router-dom";
import Hader from "../Hader";
import Katalog from "../Katalog";
import Futer from "../Futer";

class ContactsS extends React.Component {
    render() {
        return(
            <div>
                <Hader/>
                Контакты
                <Futer/>
            </div>
        );
    }
}

export default ContactsS;