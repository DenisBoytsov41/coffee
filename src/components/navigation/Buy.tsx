import React, { useEffect, useState } from "react";
import Hader from "../Hader";
import Futer from "../Futer";
import Katalog from "../Katalog";

function Buy() {
    return (
        <div>
            <Hader />
            <br />
            <br />
            <div className="contApp">
                <Katalog type={''} katcount={0} pagination={true} itemsPerPage={10} searchEnabled={true} />
            </div>
            <Futer className="footer" />
        </div>
    );
}

export default Buy;
