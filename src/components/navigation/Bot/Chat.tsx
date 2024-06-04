import React, { useState } from "react";
import { useBot } from "./BotContext";
import "../../../styles/Chat.css";

const Chat: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { messages, sendMessage } = useBot();
    const [input, setInput] = useState<string>("");

    const handleSend = () => {
        if (input.trim()) {
            sendMessage(input);
            setInput("");
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSend();
        }
    };

    return (
        <div className="chat-container">
            <div className="close-button" onClick={onClose}>
                X
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button onClick={handleSend}>Отправить</button>
            </div>
        </div>
    );
};

export default Chat;
