import React, { useEffect, useState } from "react";
import { Button, Input } from "antd";
import { CustomerServiceOutlined, CloseOutlined } from "@ant-design/icons";

const StaffChatWidget = ({ onClose }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: "staff",
            content: "Xin chào! Mình là nhân viên HIEUVINHbook. Giờ làm việc 8:00 - 22:00 mỗi ngày. Bạn cần hỗ trợ về sản phẩm, đơn hàng hay thanh toán ạ?",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState(" ");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("hv_staff_chat");
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length) setMessages(parsed.map(m => ({ ...m, timestamp: new Date(m.timestamp) })));
            }
        } catch (_) { }
    }, []);

    useEffect(() => {
        try { localStorage.setItem("hv_staff_chat", JSON.stringify(messages)); } catch (_) { }
    }, [messages]);

    const quick = ["Tư vấn sản phẩm", "Kiểm tra đơn hàng", "Phí ship", "Phương thức thanh toán", "Gọi lại cho tôi"];

    const gen = (text) => {
        const t = text.toLowerCase();
        const phone = text.match(/(0|\+84)\d{8,10}/g);
        if (phone) return `Mình đã ghi nhận số ${phone[0]}. Nhân viên sẽ liên hệ lại cho bạn sớm nhất nhé!`;
        if (t.includes("xin chào") || t.includes("chào") || t.includes("hello") || t.includes("hi")) return "Chào bạn! Mình là nhân viên HIEUVINHbook. Bạn cần hỗ trợ về sản phẩm, đơn hàng hay thanh toán ạ?";
        if (t.includes("đơn hàng") || t.includes("order") || t.includes("mã đơn")) return "Bạn vui lòng cung cấp mã đơn hàng và số điện thoại đặt hàng, mình sẽ kiểm tra ngay nhé!";
        if (t.includes("sản phẩm") || t.includes("tư vấn") || t.includes("còn hàng")) return "Bạn cần tư vấn dòng sản phẩm nào (sách giáo khoa, tham khảo, văn phòng phẩm...)? Cho mình biết tên/mã sản phẩm để kiểm tra tồn kho giúp bạn nhé!";
        if (t.includes("thanh toán") || t.includes("chuyển khoản") || t.includes("cod")) return "Bên mình hỗ trợ COD, chuyển khoản và ví điện tử. Bạn muốn dùng phương thức nào ạ?";
        if (t.includes("giao hàng") || t.includes("ship") || t.includes("phí ship") || t.includes("vận chuyển")) return "Phí ship nội thành từ 20k, ngoại thành từ 30k, tỉnh khác từ 40k. Thời gian giao 1-3 ngày. Bạn ở đâu để mình báo cụ thể nhé!";
        if (t.includes("liên hệ") || t.includes("hotline") || t.includes("số điện thoại")) return "Hotline: 0966 160 925 / 0989 849 396 (8:00 - 22:00). Bạn để lại số điện thoại, mình sẽ gọi lại hỗ trợ!";
        return "Mình đã nhận tin nhắn của bạn. Bạn mô tả chi tiết hơn để mình hỗ trợ nhanh nhất nhé!";
    };

    const send = () => {
        if (!input.trim()) return;
        const user = { id: Date.now(), type: "user", content: input, timestamp: new Date() };
        setMessages((p) => [...p, user]);
        setInput("");
        setLoading(true);
        setTimeout(() => {
            const reply = gen(user.content);
            const staff = { id: Date.now() + 1, type: "staff", content: reply, timestamp: new Date() };
            setMessages((p) => [...p, staff]);
            setLoading(false);
        }, 800 + Math.random() * 800);
    };

    const key = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    };

    return (
        <div className="ai-chat-widget">
            <div className="ai-chat-header">
                <div className="ai-avatar-container">
                    <div className="ai-avatar-large"><CustomerServiceOutlined /></div>
                </div>
                <div className="ai-header-text">
                    <div className="ai-greeting">Nhân viên hỗ trợ</div>
                    <div className="ai-description">HIEUVINHbook sẵn sàng tư vấn</div>
                </div>
                <div className="ai-header-actions">
                    <Button type="text" icon={<CloseOutlined />} className="ai-header-btn" onClick={onClose} />
                </div>
            </div>

            <div className="ai-chat-messages">
                {messages.map((m) => (
                    <div key={m.id} className={`ai-message ${m.type === "user" ? "user-message" : "ai-message"}`}>
                        {m.type === "staff" && (<div className="ai-avatar-small"><CustomerServiceOutlined /></div>)}
                        <div className="ai-message-content">
                            <div className="ai-message-text">{m.content}</div>
                            <div className="ai-message-time">{m.timestamp.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="ai-message ai-message">
                        <div className="ai-avatar-small"><CustomerServiceOutlined /></div>
                        <div className="ai-message-content"><div className="ai-typing-indicator"><span></span><span></span><span></span></div></div>
                    </div>
                )}
            </div>

            <div className="ai-chat-input">
                <div className="ai-chat-quick-replies">
                    {quick.map((q, i) => (
                        <Button key={i} size="small" onClick={() => { setInput(q); setTimeout(() => send(), 0); }}>{q}</Button>
                    ))}
                </div>
                <div className="ai-chat-input-row">
                    <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={key} placeholder="Nhập nội dung..." className="ai-input-field" disabled={loading} />
                    <Button type="primary" className="ai-send-button" onClick={send} disabled={!input.trim() || loading}>{loading ? "Đang gửi..." : "Gửi"}</Button>
                </div>
            </div>

            <div className="ai-chat-footer">
                <div className="ai-brand">Hỗ trợ nhân viên</div>
                <div className="ai-time">{new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</div>
            </div>
        </div>
    );
};

export default StaffChatWidget;


