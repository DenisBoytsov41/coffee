import React from "react";
import Hader from "../Hader";
import Futer from "../Futer";
import "../../styles/FAQ.css";

function Faq() {
    const tel = "+7(915)923-81-62";
    const Email = "info@godinecoffee.ru";

    return (
        <div className="faq-page">
            <Hader />
            <div className="content-wrapper">
                <div className="ContentFAQ">
                    <br />
                    <div className="Zagol1FAQ">
                        Здесь мы собрали ответы на самые популярные вопросы. Вы можете найти свой ответ в списке.
                    </div>
                    <div className="FAQ">
                        <div className="FAQ1">
                            <br />
                            <br />
                            <div className="ZagolFAQ">
                                Доставка
                            </div>
                            <br />
                            <details>
                                <summary className="textFAQ">Доставляете ли вы в мой город?</summary>
                                <p className="textopenFAQ">Все варианты доставки вы можете увидеть в корзине при оформлении заказа. Для этого нужно заполнить поле «Населенный пункт», если он не определился автоматически.</p>
                            </details>
                            <details>
                                <summary className="textFAQ">Какие есть способы доставки?</summary>
                                <p className="textopenFAQ">Мы доставляем заказы курьерской компанией СДЕК до пунктов выдачи. Минимальная сумма заказа — 800 рублей.

                                    Сроки доставки автоматически рассчитываются прямо на странице оформления, когда вы заполните адрес доставки. Например, доставка до Москвы занимает 1–3 рабочих дня, до Санкт-Петербурга — 2–4 рабочих дня.

                                    Стоимость доставки зависит от суммы и веса заказа.</p>
                            </details>
                            <details>
                                <summary className="textFAQ">Когда я получу заказ?</summary>
                                <p className="textopenFAQ">Примерную дату доставки можно увидеть в корзине при оформлении заказа. Для этого нужно просто заполнить адрес. </p>
                            </details>
                            <details>
                                <summary className="textFAQ">Как узнать, где мой заказ?</summary>
                                <p className="textopenFAQ">Статус заказа можно уточнить у менеджера по телефону {tel} или написать на почту {Email}</p>
                            </details>
                            <br />
                            <br />
                            <div className="ZagolFAQ">
                                Оплата
                            </div>
                            <br />
                            <details>
                                <summary className="textFAQ">У меня не прошла оплата, что мне делать?</summary>
                                <p className="textopenFAQ">Если деньги списались с карты, но статус заказа не изменился, скорее всего, это ошибка банка. Мы рекомендуем немного подождать или обратиться в техподдержку банка. Деньги не списываются безвозвратно.

                                    Если деньги не списались, вы можете попробовать оплатить заказ еще раз.</p>
                            </details>
                            <details>
                                <summary className="textFAQ">Как часто меняются цены?</summary>
                                <p className="textopenFAQ">Мы пересматриваем цены всех товаров еженедельно по пятницам после 14:00 по московскому времени. </p>
                            </details>
                            <details>
                                <summary className="textFAQ">Как оформить заказ на юридическое лицо?</summary>
                                <p className="textopenFAQ">Для оформления заказа на юридическое лицо нужно связаться с менеджером по телефону {tel} или написать на почту {Email}</p>
                            </details>
                        </div>
                        <div className="FAQ1">
                            <br />
                            <br />
                            <div className="ZagolFAQ">
                                Хранение
                            </div>
                            <br />
                            <details>
                                <summary className="textFAQ">Как хранить кофе?</summary>
                                <p className="textopenFAQ">В закрытой пачке при комнатной температуре кофе можно хранить 1–2
                                    месяца. После вскрытия упаковки этот срок сокращается, поэтому мы рекомендуем покупать
                                    кофе в том объёме, который вы выпьете за одну-две недели максимум.

                                    Если вам нужно хранить кофе дольше, можно заморозить его в морозилке. Важно, чтобы там
                                    не было посторонних запахов, потому что кофе может легко его впитать. Так кофе можно
                                    хранить до полугода, однако разморозить его можно только один раз при комнатной
                                    температуре в течение 10–12 часов. Замораживать повторно нельзя.</p>
                            </details>
                            <br />
                            <br />
                            <div className="ZagolFAQ">
                                Прочее
                            </div>
                            <br />
                            <details>
                                <summary className="textFAQ">Если мне не понравится кофе?</summary>
                                <p className="textopenFAQ">Если вам не понравился кофе, напишите нам на почту {Email} или
                                    позвоните по телефону {tel}.</p>
                            </details>
                        </div>
                    </div>
                </div>
            </div>
            <Futer className="footer"/>
        </div>
    );
}

export default Faq;
