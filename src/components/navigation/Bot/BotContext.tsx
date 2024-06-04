import React, { createContext, useState, useContext, FC, ReactNode } from "react";

interface Message {
    text: string;
    sender: "user" | "bot";
}

interface BotContextType {
    messages: Message[];
    sendMessage: (message: string) => void;
}

const BotContext = createContext<BotContextType | undefined>(undefined);

export const useBot = (): BotContextType => {
    const context = useContext(BotContext);
    if (!context) {
        throw new Error("useBot must be used within a BotProvider");
    }
    return context;
};

interface BotProviderProps {
    children: ReactNode;
}

export const BotProvider: FC<BotProviderProps> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([]);

    const sendMessage = (message: string): void => {
        const userMessage: Message = { text: message, sender: "user" };
        const botMessage: Message = { text: getBotResponse(message), sender: "bot" };
        setMessages([...messages, userMessage, botMessage]);
    };

    const getBotResponse = (message: string): string => {
        if (message.includes("Доставка")) {
            return "Все варианты доставки вы можете увидеть в корзине при оформлении заказа...";
        } else if (message.includes("Оплата")) {
            return "Если деньги списались с карты, но статус заказа не изменился, скорее всего, это ошибка банка...";
        } else if (message.includes("Хранение")) {
            return "В закрытой пачке при комнатной температуре кофе можно хранить 1–2 месяца...";
        } else {
            return "Извините, я не понимаю ваш вопрос. Попробуйте задать его иначе.";
        }
    };

    return (
        <BotContext.Provider value={{ messages, sendMessage }}>
            {children}
        </BotContext.Provider>
    );
};
