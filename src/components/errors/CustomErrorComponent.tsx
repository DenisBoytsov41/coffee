import React from 'react';

const CustomErrorComponent = ({ error }: { error: Error }) => {
  let errorMessage = 'Произошла ошибка. Пожалуйста, попробуйте обновить страницу или зайти позже.';

  if (error.message === 'Сервер недоступен') {
    errorMessage = 'Ошибка: Сервер недоступен. Пожалуйста, попробуйте зайти позже.';
  } else if (error.message === 'Ошибка авторизации') {
    errorMessage = 'Ошибка: Неверные учетные данные. Пожалуйста, проверьте логин и пароль.';
  }
  
  console.error(error);

  return (
    <div className="error-message">
      <p>{errorMessage}</p>
    </div>
  );
};

export default CustomErrorComponent;
