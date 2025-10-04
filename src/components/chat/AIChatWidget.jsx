import React, { useState } from "react";
import { Button, Input, message } from "antd";
import { RobotOutlined, CloseOutlined } from "@ant-design/icons";

const AIChatWidget = ({ onClose }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: "ai",
            content:
                "Xin chào! Tôi là AI Assistant của HIEUVINHbook. Tôi có thể giúp bạn tìm hiểu về sản phẩm, đặt hàng, hoặc trả lời các câu hỏi về dịch vụ của chúng tôi. Bạn cần hỗ trợ gì?",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const callGemini = async (text) => {
        const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;
        const API_URL =
            "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent";
        if (!API_KEY) throw new Error("Thiếu API key. Hãy đặt VITE_GOOGLE_AI_API_KEY trong .env");
        const body = {
            contents: [
                { parts: [{ text: `Bạn là trợ lý của HIEUVINHbook, trả lời ngắn gọn, hữu ích, tiếng Việt.\nCâu hỏi: ${text}` }] },
            ],
        };
        const res = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const t = await res.text();
            throw new Error(`Gemini API error ${res.status}: ${t}`);
        }
        const data = await res.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!reply) throw new Error("Phản hồi AI không hợp lệ");
        return reply;
    };

    const send = async () => {
        if (!input.trim()) return;
        const user = { id: Date.now(), type: "user", content: input, timestamp: new Date() };
        setMessages((p) => [...p, user]);
        setInput("");
        setLoading(true);
        try {
            const reply = await callGemini(user.content);
            const ai = { id: Date.now() + 1, type: "ai", content: reply, timestamp: new Date() };
            setMessages((p) => [...p, ai]);
        } catch (e) {
            console.error(e);
            message.error("Có lỗi khi gọi AI. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    const handleKey = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    };

    return (
        <div className="ai-chat-widget">
            <div className="ai-chat-header">
                <div className="ai-avatar-container">
                    <div className="ai-avatar-large">
                        <RobotOutlined />
                    </div>
                </div>
                <div className="ai-header-text">
                    <div className="ai-greeting">Xin chào!</div>
                    <div className="ai-description">Em ở đây để hỗ trợ cho mình</div>
                </div>
                <div className="ai-header-actions">
                    <Button type="text" icon={<CloseOutlined />} className="ai-header-btn" onClick={onClose} />
                </div>
            </div>

            <div className="ai-chat-messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`ai-message ${msg.type === "user" ? "user-message" : "ai-message"}`}>
                        {msg.type === "ai" && (
                            <div className="ai-avatar-small">
                                <RobotOutlined />
                            </div>
                        )}
                        <div className="ai-message-content">
                            <div className="ai-message-text">{msg.content}</div>
                            <div className="ai-message-time">
                                {msg.timestamp.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                            </div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="ai-message ai-message">
                        <div className="ai-avatar-small">
                            <RobotOutlined />
                        </div>
                        <div className="ai-message-content">
                            <div className="ai-typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="ai-chat-input">
                <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKey} placeholder="Nhập nội dung..." className="ai-input-field" disabled={loading} />
                <Button type="primary" className="ai-send-button" onClick={send} disabled={!input.trim() || loading}>{loading ? "Đang gửi..." : "Gửi"}</Button>
            </div>

            <div className="ai-chat-footer">
                <div className="ai-brand">HIEUVINHbook AI</div>
                <div className="ai-time">{new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</div>
            </div>
        </div>
    );
};

export default AIChatWidget;


