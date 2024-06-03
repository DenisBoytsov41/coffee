import React, { useEffect } from "react";
import Hader from "../Hader";
import Futer from "../Futer";
import Katalog from "../Katalog";
import { Link } from "react-router-dom";
import "../../App.css";
import "../../styles/Home.css";
import back from "../../images/back.jpg";
import ap from "../../images/AllPrice.jpg";

function Home() {
  useEffect(() => {
    return () => {
      document.title = "Интернет-магазин кофе из Эфиопии, купить от Godinecoffee";
    };
  }, []);

  return (
    <div>
      <Hader />
      <div className="Content">
        <img src={back} alt="ap" className="imgback" />
        <div className="deviz">
          <div className="devizbol">ВКУСНЫЙ КОФЕ ИЗ</div>
          <div className="devizbol">ЭФИОПИИ.</div>
          <div className="devizmal">МЫ ЛЮБИМ ТО, ЧТО ДЕЛАЕМ И ЦЕНИМ ПРОДУКТ, КОТОРЫЙ ПРОДАЁМ.</div>
        </div>
        <div className="contApp">
          <Katalog type={''} katcount={6} pagination={false} itemsPerPage={10} />
          <br />
          <br />
          <Link to={"/buy"} className="linkHome">
            <img src={ap} alt="ap" className="imgbuy" />
            Просмотреть весь кофе
          </Link>
        </div>
      </div>
      <Futer className="footer" />
    </div>
  );
}

export default Home;
