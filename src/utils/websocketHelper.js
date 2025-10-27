/**
 * Helper function để tạo WebSocket URL động
 * Tự động detect protocol (HTTP/HTTPS) và host từ URL hiện tại
 */
export const getWebSocketUrl = (path = '/chat-websocket') => {
    // Trong môi trường development (localhost)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return `http://localhost:8080${path}`;
    }

    // Trong môi trường production
    // Auto-detect protocol từ URL hiện tại
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
    const host = window.location.host; // Lấy host (ví dụ: yourdomain.com)

    // Sử dụng wss:// cho HTTPS và ws:// cho HTTP
    // Hoặc dùng SockJS với URL tương ứng
    if (protocol === 'https:') {
        // Nếu HTTPS, dùng https:// cho SockJS
        return `${protocol}//${host}${path}`;
    } else {
        return `http://${host}${path}`;
    }
};

/**
 * Helper để tạo SockJS URL
 */
export const getSockJSUrl = (path = '/chat-websocket') => {
    return getWebSocketUrl(path);
};

