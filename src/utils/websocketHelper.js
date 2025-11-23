/**
 * URL CƠ SỞ CỦA BACKEND (Đã có HTTPS và không có cổng)
 * Đây là tên miền đã được cấu hình Nginx Reverse Proxy
 * SỬ DỤNG: https://vps.hieuvinhbook-shop.id.vn (BỎ CỔNG 8080)
 */
const BACKEND_BASE_URL = 'https://vps.hieuvinhbook-shop.id.vn';


/**
 * Helper function để tạo WebSocket URL động
 * Đảm bảo luôn trỏ đến tên miền BACKEND.
 *
 * @param {string} path - Endpoint WebSocket (mặc định: /chat-websocket)
 * @returns {string} WebSocket URL hoàn chỉnh
 */
export const getWebSocketUrl = (path = '/chat-websocket') => {
    // Trong môi trường development (localhost)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // Trong môi trường dev, chúng ta sẽ trỏ thẳng đến domain production
        // để đảm bảo kiểm tra kết nối SockJS với BE đang chạy trên VPS.
        return `${BACKEND_BASE_URL}${path}`;
        
        /* * Nếu bạn muốn test cục bộ, hãy bỏ comment dòng dưới và test
        * return `http://localhost:8080${path}`;
        */
    }

    // Trong môi trường production (Vercel), LUÔN LUÔN trỏ đến domain BE HTTPS đã được Reverse Proxy
    return `${BACKEND_BASE_URL}${path}`;
};

/**
 * Helper để tạo SockJS URL
 * SockJS client sẽ tự động chọn wss:// hoặc ws:// dựa trên protocol của URL gốc.
 */
export const getSockJSUrl = (path = '/chat-websocket') => {
    return getWebSocketUrl(path);
};