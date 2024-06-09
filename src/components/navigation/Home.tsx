import React, { useEffect } from "react";
import Hader from "../Hader";
import Futer from "../Futer";
import Katalog from "../Katalog";
import { Link } from "react-router-dom";
import "../../App.css";
import "../../styles/Home.css";
import ap from "../../images/AllPrice.jpg";
import { BotProvider } from "./Bot/BotContext"
import ProductSlider from "../PopularProducts";

function Home() {
  useEffect(() => {
    document.title = "Интернет-магазин кофе из Эфиопии, купить от Godinecoffee";
  }, []);

  return (
    <div className="Content">
      <Hader />
      <div className="bg-container">
        <div className="imgback" />
        <div className="deviz">
          <div className="devizbol">ВКУСНЫЙ КОФЕ ИЗ</div>
          <div className="devizbol">ЭФИОПИИ.</div>
          <div className="devizmal">МЫ ЛЮБИМ ТО, ЧТО ДЕЛАЕМ И ЦЕНИМ ПРОДУКТ, КОТОРЫЙ ПРОДАЁМ.</div>
        </div>
      </div>
      <div className="contApp">
        <ProductSlider />
        <Katalog type={''} katcount={6} pagination={false} itemsPerPage={10} />
        <br />
        <br />
        <Link to={"/buy"} className="linkHome">
          <img src={ap} alt="ap" className="imgbuy" />
          Просмотреть весь кофе
        </Link>
      </div>
      <BotProvider><Futer className="footer" /> </BotProvider>
    </div>
  );
}

export default Home;
