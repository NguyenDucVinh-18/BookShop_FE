# BookShop Frontend

Ứng dụng frontend cho hệ thống quản lý cửa hàng sách HIEUVINHbook, được xây dựng bằng React + Vite.

## Tính năng chính

- Quản lý sản phẩm và danh mục
- Hệ thống đăng nhập/đăng ký
- Giỏ hàng và thanh toán
- Chatbot AI hỗ trợ khách hàng
- Quản lý đơn hàng
- Giao diện admin

## Cài đặt và chạy

1. Cài đặt dependencies:
```bash
npm install
```

2. Cấu hình environment variables (tùy chọn):
Tạo file `.env` trong thư mục gốc với nội dung:
```env
# Backend API Configuration  
VITE_API_BASE_URL=http://localhost:8080

# Other environment variables
VITE_ENV=development
```

**Lưu ý**: Chatbot hiện tại sử dụng hardcode responses, không cần API key.

3. Chạy ứng dụng:
```bash
npm run dev
```

## Cấu trúc dự án

- `src/components/` - Các component React
- `src/pages/` - Các trang của ứng dụng
- `src/service/` - Các service API
- `src/styles/` - File CSS
- `src/assets/` - Hình ảnh và tài nguyên

## Chatbot AI

Ứng dụng tích hợp chatbot AI sử dụng Google Gemini API để hỗ trợ khách hàng:
- Trả lời câu hỏi về sản phẩm
- Hướng dẫn đặt hàng
- Thông tin về chính sách giao hàng
- Hỗ trợ khách hàng 24/7

## Công nghệ sử dụng

- React 19.1.0
- Vite 7.0.4
- Ant Design 5.26.7
- Axios 1.11.0
- React Router DOM 7.8.0
- Google AI API (Gemini)
