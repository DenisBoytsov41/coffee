import React from 'react';
import ServHost from '../../serverHost.json';
const moment = require('moment-timezone');

const clearLocalStorageAndReload = () => {
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshTokenExpiration');
    localStorage.removeItem('accessTokenExpiration');
    localStorage.removeItem('liked');
    localStorage.setItem('basket', '');
    localStorage.setItem('backCount', '0');
    window.location.reload();
};

const checkRefreshToken = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const localStorageExpiration = localStorage.getItem('refreshTokenExpiration');

    if (!refreshToken || !localStorageExpiration) {
        //console.error('Ошибка при проверке refreshToken: Токен отсутствует');
        return;
    }
    const expirationMoment = moment(localStorageExpiration);
    if (expirationMoment.isValid()) {
        const formattedExpiration = expirationMoment.format('YYYY-MM-DD HH:mm:ss');
        fetch(`${ServHost.host}/checkRefreshToken`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refreshToken: refreshToken,
                refreshTokenExpiration: formattedExpiration
            })
        })
        .then(response => {
            if (response.status === 401 || response.status === 404) {
                clearLocalStorageAndReload();
                throw new Error('Ошибка при проверке refreshToken');
            }
            if (!response.ok) {
                clearLocalStorageAndReload();
                throw new Error('Ошибка при проверке refreshToken');
            }
            return response.json();
        })
        .catch(error => {
            clearLocalStorageAndReload();
            console.error('Ошибка при проверке refreshToken:', error);
        });
    } else {
        clearLocalStorageAndReload();
        console.error('Ошибка при проверке refreshToken: Неверное значение времени в localStorage');
    }
};

export default checkRefreshToken;
