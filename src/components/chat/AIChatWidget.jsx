import React, { useState, useRef, useEffect } from "react";
import { Button, Input, message } from "antd";
import { RobotOutlined, CloseOutlined } from "@ant-design/icons";
import { sendChatboxMessageAPI } from "../../service/chatboxAI.service";

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
    const messagesEndRef = useRef(null); // Tham chiếu đến cuối danh sách tin nhắn

    const send = async () => {
        if (!input.trim()) return;
        const user = { id: Date.now(), type: "user", content: input, timestamp: new Date() };
        setMessages((p) => [...p, user]);
        setInput("");
        setLoading(true);
        try {
            const context = messages
                .map(msg => `${msg.type === "user" ? "User" : "AI"}: ${msg.content}`)
                .join("\n");
            const res = await sendChatboxMessageAPI({
                message: input,
                context: context
            });
            const reply = res?.data?.reply;

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

    // Cuộn xuống sau khi tin nhắn được thêm
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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
                            <div
                                className="ai-message-text"
                                dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br>') }}
                            />
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
                <div ref={messagesEndRef} /> {/* Tham chiếu đến cuối danh sách */}
            </div>

            <div className="ai-chat-input">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKey}
                    placeholder="Nhập nội dung..."
                    className="ai-input-field"
                    disabled={loading}
                />
                <Button
                    type="primary"
                    className="ai-send-button"
                    onClick={send}
                    disabled={!input.trim() || loading}
                >
                    {loading ? "Đang gửi..." : "Gửi"}
                </Button>
            </div>

            <div className="ai-chat-footer">
                <div className="ai-brand">HIEUVINHbook AI</div>
                <div className="ai-time">{new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</div>
            </div>

            <style jsx>{`
                .ai-chat-input {
                    display: flex;
                    flex-direction: row;
                    gap: 8px;
                    align-items: center;
                    padding: 12px;
                }

                .ai-input-field {
                    flex: 1;
                    order: 1;
                }

                .ai-send-button {
                    flex-shrink: 0;
                    order: 2;
                }
            `}</style>
        </div>
    );
};

export default AIChatWidget;