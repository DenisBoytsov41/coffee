import React from "react";
import Hader from "../Hader";
import Futer from "../Futer";

class Liked extends React.Component {
    render() {
        return(
            <div>
                <Hader/>
                Избраное
                <Futer/>
            </div>
        );
    }
}

export default Liked;