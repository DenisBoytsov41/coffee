import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ServHost from '../../serverHost.json';
import Hader from "../Hader";
import Futer from "../Futer";
import IMask from "imask";

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  gender: string;
}

function Reg() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [registrationError, setRegistrationError] = useState('');
  const [isErrVisible, setErrVisible] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    gender: ''
  });

  useEffect(() => {
    const element = document.getElementById('phone');
    if (element) {
      const maskOptions = {
        mask: '+7 000 000 00 00',
        lazy: false
      };
      const mask = IMask(element, maskOptions);
      mask.on('accept', () => {
        setFormData((prevData) => ({
          ...prevData,
          phone: mask.value
        }));
      });
    }
  }, []);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'phone' ? value.replace(/\D/g, '') : value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setRegistrationError('Пароли не совпадают');
      setTimeout(() => setRegistrationError(''), 5000);
      return;
    }
    try {
      const response = await axios.post(`${ServHost.host}/RegUser`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phone,
        gender: formData.gender
      });
      if (response.data.message) {
        setRegistrationMessage(response.data.message);
        setRegistrationError('');
        setTimeout(() => setRegistrationMessage(''), 5000);
        window.localStorage.setItem("Login", `${formData.username} ${formData.password}`);
        window.location.replace("/");
      } else if (response.data.error) {
        // Обработка ошибки от сервера
        const errorMsg = Array.isArray(response.data.error) ? response.data.error.join(' ') : response.data.error;
        setRegistrationError(errorMsg);
        setErrVisible(false);
        setTimeout(() => setRegistrationError(''), 5000);
      }
    } catch (error: any) {
      console.error('Ошибка при отправке запроса: ', error);
      if (error.response && error.response.data && error.response.data.error) {
        const errorMsg = Array.isArray(error.response.data.error) ? error.response.data.error.join(' ') : error.response.data.error;
        setRegistrationError(errorMsg);
      } else {
        setRegistrationError('Ошибка при регистрации. Пожалуйста, попробуйте еще раз или обратитесь за помощью.');
      }
      setTimeout(() => setRegistrationError(''), 5000);
    }
  };

  return (
    <div>
      <Hader />
      <div className="contApp">
        <form id="registrationForm" onSubmit={handleSubmit}>
          <div className="noabsformReg">
            <label className="lableVhlog">РЕГИСТРАЦИЯ</label>
            {registrationError && <div className="Error">{registrationError}</div>}
            {registrationMessage && <div className="Message">{registrationMessage}</div>}
            <div>Основные данные</div>
            <input
              type="text"
              placeholder="* Имя"
              className="inpVhlog"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={15}
            />
            <input
              type="text"
              placeholder="* Фамилия"
              className="inpVhlog"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={15}
            />
            <input
              type="tel"
              placeholder="* Телефон"
              className="inpVhlog"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              placeholder="* E-mail"
              className="inpVhlog"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              placeholder="* Логин"
              className="inpVhlog"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={6}
            />
            <div>Ваш пароль</div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="* Пароль"
              className="inpVhlog"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              maxLength={16}
            />
            <button type="button" onClick={handleTogglePassword}>
              {showPassword ? 'Скрыть' : 'Показать'}
            </button>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="* Подтвердите Пароль"
              className="inpVhlog"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={8}
              maxLength={16}
            />
            <button type="button" onClick={handleToggleConfirmPassword}>
              {showConfirmPassword ? 'Скрыть' : 'Показать'}
            </button>
            <div>
              <label>Пол:</label>
              <div>
                <input
                  type="radio"
                  id="maleGender"
                  name="gender"
                  value="Мужской"
                  checked={formData.gender === "Мужской"}
                  onChange={handleChange}
                />
                <label htmlFor="maleGender">Мужской</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="femaleGender"
                  name="gender"
                  value="Женский"
                  checked={formData.gender === "Женский"}
                  onChange={handleChange}
                />
                <label htmlFor="femaleGender">Женский</label>
              </div>
            </div>
            <div>
              <button className="ButtonReg" type="submit">Зарегистрироваться</button>
            </div>
            <div className="warrior">При создании нового аккаунта, вы даёте согласие на обработку персональных данных</div>
          </div>
        </form>
      </div>
      <Futer className="footer"/>
    </div>
  );
}

export default Reg;
