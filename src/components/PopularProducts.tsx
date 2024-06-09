import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ServHost from "../serverHost.json";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Product {
  PhotoPath: string;
  name: string;
  description: string;
}

const ProductOfTheDay = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get(ServHost.host + '/product-of-the-day')
      .then(response => {
        if (response.data.length === 0) {
          setError('Сегодня заказов не было');
        } else {
          setProduct(response.data[0]);
        }
      })
      .catch(error => {
        console.error('При получении товара дня произошла ошибка!', error);
        setError('Ошибка при получении данных');
      });
  }, []);

  if (error) return <div>{error}</div>;
  if (!product) return <div>Loading...</div>;


  return (
    <div className="top-3-products">
      <h2>Продукт дня</h2>
      <div className="products-row">
        <div className="top-product">
          <img src={product.PhotoPath} alt={product.name} />
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
};


const Top3Products7Days = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get(ServHost.host + '/top-3-products-7-days')
      .then(response => {
        if (response.data.length === 0) {
          setError('Нет данных за последние 7 дней');
        } else {
          setProducts(response.data);
        }
      })
      .catch(error => {
        console.error('Не удалось получить 3 самых популярных товара за последние 7 дней!', error);
        setError('Ошибка при получении данных');
      });
  }, []);

  if (error) return <div>{error}</div>;
  if (products.length === 0) return <div>Loading...</div>;

  return (
    <div className="top-3-products">
      <h2>Топ-3 товаров за последние 7 дней</h2>
      <div className="products-row">
        {products.map((product, index) => (
          <div key={index} className="top-product">
            <img src={product.PhotoPath} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Top3ProductsDay = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get(ServHost.host + '/top-3-products-day')
      .then(response => {
        if (response.data.length === 0) {
          setError('Нет данных за последние день');
        } else {
          setProducts(response.data);
        }
      })
      .catch(error => {
        console.error('Не удалось получить 3 самых популярных товара за последний день!', error);
        setError('Ошибка при получении данных');
      });
  }, []);

  if (error) return <div>{error}</div>;
  if (products.length === 0) return <div>Loading...</div>;

  return (
    <div className="top-3-products">
      <h2>Топ-3 товаров за последний день</h2>
      <div className="products-row">
        {products.map((product, index) => (
          <div key={index} className="top-product">
            <img src={product.PhotoPath} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};


const Top3ProductsMonth = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get(ServHost.host + '/top-3-products-month')
      .then(response => {
        if (response.data.length === 0) {
          setError('Нет данных за последний месяц');
        } else {
          setProducts(response.data);
        }
      })
      .catch(error => {
        console.error('Не удалось получить 3 лучших продукта за последний месяц!', error);
        setError('Ошибка при получении данных');
      });
  }, []);

  if (error) return <div>{error}</div>;
  if (products.length === 0) return <div>Loading...</div>;

  return (
    <div className="top-3-products">
      <h2>Топ-3 товаров за последний месяц</h2>
      <div className="products-row">
        {products.map((product, index) => (
          <div key={index} className="top-product">
            <img src={product.PhotoPath} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};


const ProductSlider = () => {
  const settings = {
    dots: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    centerPadding: '25%',
    swipe: true
  };
  

  return (
    <div className="product-slider">
      <Slider {...settings}>
        <div className="slider-item">
          <Top3ProductsDay />
        </div>
        <div className="slider-item">
          <Top3Products7Days />
        </div>
        <div className="slider-item">
          <Top3ProductsMonth />
        </div>
      </Slider>
    </div>
  );
};

export default ProductSlider;
