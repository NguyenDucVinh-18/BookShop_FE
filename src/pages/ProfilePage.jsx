import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Upload,
  Tabs,
  Avatar,
  Tag,
  Card,
  List,
  Space,
  Typography,
  Divider,
  Modal,
  message,
  Popconfirm,
  Radio,
  Rate,
  Tooltip,
  Select,
} from "antd";
import "../styles/ProfilePage.css";
import {
  UploadOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  EnvironmentOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  StarOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  RollbackOutlined,
  StopOutlined,
  DollarCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { AuthContext } from "../components/context/auth.context";
import {
  addAddress,
  changePasswordAPI,
  deleteAddress,
  getAddresses,
  updateAddress,
  updateAvatarAPI,
  updateInFo,
} from "../service/user.service";
import { useNavigate, useParams } from "react-router-dom";
import {
  cancelOrderAPI,
  changeToCODPaymentMethod,
  getOrderAPI,
  refundOrderAPI,
  repaymentOrderAPI,
  updateOrderStatusAPI,
} from "../service/order.service";
import axios from "axios";
import { createReviewAPI } from "../service/review.service";
import { createReturnOrderAPI } from "../service/returnOrder.service";

const { Text, Title } = Typography;
const PROFILE_KEY = "userProfile";

const getStatusText = (status) => {
  const map = {
    PENDING: "Chờ xác nhận",
    PROCESSING: "Đang xử lý",
    SHIPPING: "Đang giao",
    DELIVERED: "Đã giao",
    REFUND_REQUESTED: "Đã yêu cầu hoàn trả",
    REFUND_REJECTED: "Yêu cầu hoàn trả bị từ chối",
    REFUNDING: "Đang hoàn trả",
    REFUNDED: "Đã hoàn trả",
    UNPAID: "Chưa thanh toán",
    CANCELED: "Đã hủy",
  };
  return map[status] || status;
};

// Hàm helper để lấy icon trạng thái đơn hàng
const getStatusIcon = (status) => {
  switch (status) {
    case "UNPAID":
      return <WarningOutlined style={{ color: "#fa541c" }} />;
    case "PENDING":
      return <ClockCircleOutlined style={{ color: "#faad14" }} />;
    case "PROCESSING":
      return <ShoppingCartOutlined style={{ color: "#1890ff" }} />;
    case "SHIPPING":
      return <CarOutlined style={{ color: "#722ed1" }} />;
    case "DELIVERED":
      return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
    case "REFUND_REQUESTED":
      return <RollbackOutlined style={{ color: "#faad14" }} />;
    case "REFUND_REJECTED":
      return <StopOutlined style={{ color: "#ff4d4f" }} />;
    case "REFUNDED":
      return <DollarCircleOutlined style={{ color: "#13c2c2" }} />;
    case "REFUNDING":
      return <SyncOutlined spin style={{ color: "#1890ff" }} />;
    case "CANCELED":
      return <CloseCircleOutlined style={{ color: "#ff4d4f" }} />;
    default:
      return <ClockCircleOutlined />;
  }
};

// Hàm helper để lấy màu trạng thái đơn hàng
const getStatusColor = (status) => {
  switch (status) {
    case "UNPAID":
      return "warning";
    case "PENDING":
      return "orange";
    case "PROCESSING":
      return "processing";
    case "SHIPPING":
      return "cyan";
    case "DELIVERED":
      return "success";
    case "REFUND_REQUESTED":
      return "gold";
    case "REFUND_REJECTED":
      return "error";
    case "REFUNDED":
      return "green";
    case "REFUNDING":
      return "blue";
    case "CANCELED":
      return "error";
    default:
      return "default";
  }
};

const defaultProfile = {
  username: "",
  email: "",
  phone: "",
  avatar: "",
};

// Component hiển thị đơn hàng
const OrderItem = ({ order, onOrderClick }) => {
  return (
    <Card
      style={{ marginBottom: 16, borderRadius: 8, cursor: "pointer" }}
      bodyStyle={{ padding: 16 }}
      onClick={() => onOrderClick(order)}
      hoverable
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <div>
          <Text strong>Mã đơn hàng: {order.orderCode}</Text>
          <br />
          Ngày đặt: {new Date(order?.createdAt).toLocaleString("vi-VN")}
        </div>
        <div style={{ textAlign: "right" }}>
          <Tag
            color={getStatusColor(order.status)}
            icon={getStatusIcon(order.status)}
          >
            {getStatusText(order.status)}{" "}
          </Tag>
          <br />
          <Text strong style={{ fontSize: 16, color: "#1890ff" }}>
            {order.totalAmount.toLocaleString("vi-VN")} ₫
          </Text>
        </div>
      </div>

      <Divider style={{ margin: "12px 0" }} />

      <List
        dataSource={order.orderItems}
        renderItem={(item) => (
          <List.Item style={{ padding: "8px 0" }}>
            <div
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <img
                src={item.productImage}
                alt={item.productName}
                style={{
                  width: 60,
                  height: 80,
                  objectFit: "cover",
                  marginRight: 12,
                  borderRadius: 4,
                }}
              />
              <div style={{ flex: 1 }}>
                <Text strong>{item.productName}</Text>
                <br />
                <Text type="secondary">
                  {item.price.toLocaleString("vi-VN")} ₫ x {item.quantity}
                </Text>
              </div>
            </div>
          </List.Item>
        )}
      />

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          👆 Click để xem chi tiết đơn hàng
        </Text>
      </div>
    </Card>
  );
};

// Component hiển thị danh sách đơn hàng theo trạng thái
const OrdersTab = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [selectedCancelReason, setSelectedCancelReason] = useState("");
  const [customCancelReason, setCustomCancelReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [returnDescription, setReturnDescription] = useState("");
  const [orderReturn, setOrderReturn] = useState(null);

  const { TextArea } = Input;

  // Thêm state vào component
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [isReturnModalVisible, setIsReturnModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [fileList, setFileList] = useState([]);
  const [returnReason, setReturnReason] = useState(null);

  const [notification, setNotification] = useState({
    type: "",
    message: "",
    visible: false,
  });

  const showNotification = (type, message) => {
    setNotification({ type, message, visible: true });
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
      setNotification({ type: "", message: "", visible: false });
    }, 3000);
  };

  // Danh sách lý do hủy đơn hàng
  const cancelReasons = [
    { value: "change_product", label: "🔄 Muốn đổi sản phẩm khác" },
    { value: "change_address", label: "📍 Muốn đổi địa chỉ giao hàng" },
    { value: "change_payment", label: "💳 Muốn đổi phương thức thanh toán" },
    { value: "price_change", label: "💰 Tìm thấy giá tốt hơn ở nơi khác" },
    { value: "no_longer_need", label: "🚫 Không còn cần sản phẩm" },
    { value: "other", label: "📝 Lý do khác" },
  ];

  // Hàm xử lý mở modal chọn lý do hủy
  const handleShowCancelModal = (orderId) => {
    setIsCancelModalVisible(true);
    setSelectedCancelReason("");
    setCustomCancelReason("");
  };

  // Hàm xử lý đóng modal chọn lý do hủy
  const handleCloseCancelModal = () => {
    setIsCancelModalVisible(false);
    setSelectedCancelReason("");
    setCustomCancelReason("");
  };

  const loadOrders = async () => {
    try {
      const ordersData = await getOrderAPI();
      if (ordersData.status === "success") {
        setOrders(ordersData.data || []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const statusOptions = [
    { value: "all", label: "Tất cả", count: orders.length },
    {
      value: "UNPAID",
      label: "Chưa thanh toán",
      count: orders.filter((o) => o.status === "UNPAID").length,
    },
    {
      value: "PENDING",
      label: "Chờ xác nhận",
      count: orders.filter((o) => o.status === "PENDING").length,
    },
    {
      value: "PROCESSING",
      label: "Đang xử lý",
      count: orders.filter((o) => o.status === "PROCESSING").length,
    },
    {
      value: "SHIPPING",
      label: "Đang giao",
      count: orders.filter((o) => o.status === "SHIPPING").length,
    },
    {
      value: "DELIVERED",
      label: "Đã giao",
      count: orders.filter((o) => o.status === "DELIVERED").length,
    },
    {
      value: "CANCELED",
      label: "Đã hủy",
      count: orders.filter((o) => o.status === "CANCELED").length,
    },
    {
      value: "refund",
      label: "Hoàn trả",
      statuses: ["REFUNDED", "REFUND_REQUESTED", "REFUND_REJECTED, REFUNDING"],
      count: orders.filter((o) =>
        ["REFUNDED", "REFUND_REQUESTED", "REFUND_REJECTED", "REFUNDING"].includes(o.status)
      ).length,
    },
  ];

  // const filteredOrders =
  //   selectedStatus === "all"
  //     ? orders
  //     : orders.filter((order) => order.status === selectedStatus);

  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : selectedStatus === "refund"
        ? orders.filter((order) =>
          ["REFUNDED", "REFUND_REQUESTED", "REFUND_REJECTED", "REFUNDING"].includes(
            order.status
          )
        )
        : orders.filter((order) => order.status === selectedStatus);

  // Xử lý click vào đơn hàng để hiển thị modal
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setIsOrderModalVisible(true);
  };

  // Xử lý đóng modal
  const handleCloseOrderModal = () => {
    setIsOrderModalVisible(false);
    setSelectedOrder(null);
  };

  const handleConfirmCancel = async () => {
    if (!selectedCancelReason) {
      showNotification("warning", "Vui lòng chọn lý do hủy đơn hàng");
      return;
    }

    if (selectedCancelReason === "other" && !customCancelReason.trim()) {
      showNotification("warning", "Vui lòng nhập lý do hủy đơn hàng");
      return;
    }

    try {
      const reason =
        selectedCancelReason === "other"
          ? customCancelReason
          : cancelReasons.find((r) => r.value === selectedCancelReason)?.label;

      // Gọi API hủy đơn hàng với lý do

      const resCancelOrder = await cancelOrderAPI(selectedOrder.id, reason);
      if (
        selectedOrder.paymentMethod === "BANKING" &&
        selectedOrder.paymentStatus === "PAID" &&
        selectedOrder.paymentRef
      ) {
        const refundRes = await refundOrderAPI(selectedOrder.paymentRef, "02");
        if (refundRes.status === "success") {
          console.log("Yêu cầu hoàn tiền đã được gửi thành công");
        } else {
          console.error("Yêu cầu hoàn tiền thất bại:", refundRes.message);
        }
      }
      if (resCancelOrder.status === "success") {
        showNotification("success", "Đơn hàng đã được hủy thành công");
        handleCloseCancelModal();
        handleCloseOrderModal();
      } else {
        showNotification(
          "error",
          resCancelOrder.message || "Hủy đơn hàng thất bại"
        );
      }

      loadOrders();
    } catch (error) {
      showNotification("error", "Hủy đơn hàng thất bại, vui lòng thử lại");
    }
  };

  const handleChangeCODPaymentMethod = async (orderId) => {
    try {
      const res = await changeToCODPaymentMethod(orderId);
      if (res.status === "success") {
        showNotification(
          "success",
          "Đã chuyển phương thức thanh toán sang COD"
        );
        handleCloseCancelModal();
        handleCloseOrderModal();
        loadOrders();
      } else {
        showNotification(
          "error",
          res.message || "Chuyển phương thức thanh toán thất bại"
        );
      }
    } catch (error) {
      showNotification("error", "Chuyển phương thức thanh toán thất bại");
    }
  };

  // Hàm mở modal đánh giá
  const handleReviewProduct = (item) => {
    setSelectedProduct(item);
    setIsReviewModalVisible(true);
    setRating(5);
    setReviewText("");
    setFileList([]);
  };

  const handleReturnOrder = (item) => {
    setOrderReturn(item);
    setIsReturnModalVisible(true);
  };

  // Hàm đóng modal
  const handleCancelReview = () => {
    setIsReviewModalVisible(false);
    setSelectedProduct(null);
    setRating(5);
    setReviewText("");
    setFileList([]);
  };

  const handleCancelReturn = () => {
    setIsReturnModalVisible(false);
    setReturnReason(null);
    setReturnDescription("");
    setOrderReturn(null);
    setFileList([]);
  };

  console.log("Order Return:", orderReturn);

  const handleCloseOrderModalReview = () => {
    setIsReviewModalVisible(false);
    setSelectedProduct(null);
  };

  // Xử lý upload file
  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handlePayment = async (orderId) => {
    const res = await repaymentOrderAPI(orderId);
    if (res && res.data) {
      window.location.href = res.data;
    }
  };

  // Kiểm tra file trước khi upload
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      message.error("Bạn chỉ có thể tải lên file ảnh hoặc video!");
      return Upload.LIST_IGNORE;
    }

    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("File phải nhỏ hơn 10MB!");
      return Upload.LIST_IGNORE;
    }

    return false;
  };

  const handleSubmitReview = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      const requestData = {
        orderItemId: selectedProduct.id,
        rating: rating,
        comment: reviewText,
      };

      formData.append(
        "request",
        new Blob([JSON.stringify(requestData)], {
          type: "application/json",
        })
      );

      // Thêm files
      fileList.forEach((file) => {
        formData.append("medias", file.originFileObj);
      });

      const res = await createReviewAPI(formData);
      console.log("Review submitted:", res);

      if (res && res.data) {
        showNotification("success", "Cảm ơn bạn đã gửi đánh giá!");
        handleCancelReview();
        setTimeout(() => {
          handleCloseOrderModal();
        }, 300);

        loadOrders();
      } else {
        showNotification("error", "Gửi đánh giá thất bại, vui lòng thử lại!");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi gửi đánh giá!");
      console.error("Error submitting review:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReturn = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      const requestData = {
        orderId: orderReturn.id,
        reason: returnReason,
        note: returnDescription,
      };

      formData.append(
        "request",
        new Blob([JSON.stringify(requestData)], {
          type: "application/json",
        })
      );
      // Thêm files
      fileList.forEach((file) => {
        formData.append("medias", file.originFileObj);
      });

      const res = await createReturnOrderAPI(formData);

      if (res && res.data) {
        showNotification("success", "Yêu cầu hoàn trả đã được gửi!");
        handleCancelReturn();
        setTimeout(() => {
          handleCloseOrderModal();
        }, 300);
        loadOrders();
      } else {
        showNotification(
          "error",
          "Gửi yêu cầu hoàn trả thất bại, vui lòng thử lại!"
        );
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi gửi yêu cầu hoàn trả!");
      console.error("Error submitting return request:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Notification System */}
      {notification.visible && (
        <div
          className={`notification ${notification.type}`}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "16px 24px",
            borderRadius: "8px",
            color: "white",
            fontWeight: "bold",
            zIndex: 9999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            backgroundColor:
              notification.type === "success"
                ? "#52c41a"
                : notification.type === "error"
                  ? "#ff4d4f"
                  : "#1890ff",
          }}
        >
          {notification.message}
        </div>
      )}
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ marginBottom: 16 }}>
          Theo dõi đơn hàng
        </Title>
        <Space wrap>
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              type={selectedStatus === option.value ? "primary" : "default"}
              onClick={() => setSelectedStatus(option.value)}
              style={{ borderRadius: 20 }}
            >
              {option.label} ({option.count})
            </Button>
          ))}
        </Space>
      </div>

      {filteredOrders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <ShoppingCartOutlined
            style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }}
          />
          <br />
          <Text type="secondary">Không có đơn hàng nào</Text>
        </div>
      ) : (
        <div>
          {filteredOrders.map((order) => (
            <OrderItem
              key={order.id}
              order={order}
              onOrderClick={handleOrderClick}
            />
          ))}
        </div>
      )}

      {/* Modal chi tiết đơn hàng */}
      <Modal
        className="order-detail-modal"
        title={
          <div style={{ textAlign: "center" }}>
            <h3 style={{ margin: 0, color: "#1890ff", fontSize: "20px" }}>
              📋 Chi tiết đơn hàng #{selectedOrder?.orderCode}
            </h3>
          </div>
        }
        open={isOrderModalVisible}
        onCancel={handleCloseOrderModal}
        footer={null}
        width={900}
        centered
      >
        {selectedOrder && (
          <div
            className="order-detail-modal-content"
            style={{ maxHeight: "70vh", overflowY: "auto", padding: "8px" }}
          >
            {/* Header đơn hàng */}
            <div
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                padding: "24px",
                borderRadius: "12px",
                marginBottom: "24px",
                color: "white",
              }}
              className="order-detail-header"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      marginBottom: "8px",
                    }}
                  >
                    Ngày đặt : 📅{" "}
                    {new Date(selectedOrder.createdAt).toLocaleDateString(
                      "vi-VN"
                    )}{" "}
                    • 🕐{" "}
                    {new Date(selectedOrder.createdAt).toLocaleTimeString(
                      "vi-VN"
                    )}
                  </div>

                  {selectedOrder.deliveredAt && (
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        marginBottom: "8px",
                      }}
                    >
                      Ngày nhận : 📦{" "}
                      {new Date(selectedOrder.deliveredAt).toLocaleDateString(
                        "vi-VN"
                      )}{" "}
                      • 🕐{" "}
                      {new Date(selectedOrder.deliveredAt).toLocaleTimeString(
                        "vi-VN"
                      )}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: "right" }}>
                  <Tag
                    color={getStatusColor(selectedOrder.status)}
                    icon={getStatusIcon(selectedOrder.status)}
                    style={{
                      fontSize: "14px",
                      padding: "8px 16px",
                      marginBottom: "8px",
                    }}
                  >
                    {getStatusText(selectedOrder.status)}{" "}
                  </Tag>
                  <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                    {selectedOrder.totalAmount.toLocaleString("vi-VN")} ₫
                  </div>
                </div>
              </div>
            </div>

            <div
              className="order-detail-info-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px",
                marginBottom: "24px",
              }}
            >
              {/* Thông tin khách hàng */}
              <div
                className="order-detail-card"
                style={{
                  background: "#fff",
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #e8e8e8",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <h4
                  style={{
                    color: "#1890ff",
                    marginBottom: "16px",
                    fontSize: "16px",
                  }}
                >
                  👤 Thông tin khách hàng
                </h4>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <div>
                    <Text
                      type="secondary"
                      style={{ fontSize: "12px", display: "block" }}
                    >
                      Họ và tên
                    </Text>
                    <Text strong style={{ fontSize: "14px" }}>
                      {user.username || "Chưa có thông tin"}
                    </Text>
                  </div>
                  <div>
                    <Text
                      type="secondary"
                      style={{ fontSize: "12px", display: "block" }}
                    >
                      Số điện thoại
                    </Text>
                    <Text strong style={{ fontSize: "14px" }}>
                      {selectedOrder.phone || "Chưa có thông tin"}
                    </Text>
                  </div>
                  <div>
                    <Text
                      type="secondary"
                      style={{ fontSize: "12px", display: "block" }}
                    >
                      Email
                    </Text>
                    <Text strong style={{ fontSize: "14px" }}>
                      {user.email || "Chưa có thông tin"}
                    </Text>
                  </div>
                  <div>
                    <Text
                      type="secondary"
                      style={{ fontSize: "12px", display: "block" }}
                    >
                      Địa chỉ giao hàng
                    </Text>
                    <Text strong style={{ fontSize: "14px" }}>
                      {selectedOrder.address || "Chưa có thông tin"}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Thanh toán & Hành động hoặc Thông tin hủy */}
              <div
                className="order-detail-card"
                style={{
                  background: "#fff",
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #e8e8e8",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                {/* Nếu đơn hàng đã bị hủy, hiển thị thông tin hủy */}
                {selectedOrder.status === "CANCELED" ? (
                  <>
                    <h4
                      style={{
                        color: "#ff4d4f",
                        marginBottom: "16px",
                        fontSize: "16px",
                      }}
                    >
                      ❌ Thông tin hủy đơn
                    </h4>

                    <div
                      style={{
                        background: "#fff2f0",
                        padding: "16px",
                        borderRadius: "8px",
                        border: "1px solid #ffccc7",
                        marginBottom: "16px",
                      }}
                    >
                      <div style={{ marginBottom: "12px" }}>
                        <Text
                          type="secondary"
                          style={{ fontSize: "12px", display: "block" }}
                        >
                          Thời gian hủy
                        </Text>
                        <Text
                          strong
                          style={{ fontSize: "14px", color: "#ff4d4f" }}
                        >
                          🕐{" "}
                          {selectedOrder.cancelledAt
                            ? new Date(
                              selectedOrder.cancelledAt
                            ).toLocaleDateString("vi-VN") +
                            " • " +
                            new Date(
                              selectedOrder.cancelledAt
                            ).toLocaleTimeString("vi-VN")
                            : "Không có thông tin"}
                        </Text>
                      </div>

                      <div>
                        <Text
                          type="secondary"
                          style={{ fontSize: "12px", display: "block" }}
                        >
                          Lý do hủy
                        </Text>
                        <Text strong style={{ fontSize: "14px" }}>
                          {selectedOrder.cancelReason ||
                            "Không có lý do cụ thể"}
                        </Text>
                      </div>
                    </div>

                    {/* Thông tin hoàn tiền nếu đã thanh toán */}
                    {selectedOrder.paymentMethod === "BANKING" &&
                      selectedOrder.paymentStatus === "PAID" && (
                        <div
                          style={{
                            background: "#f6ffed",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #b7eb8f",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span style={{ fontSize: "16px" }}>💰</span>
                          <div>
                            <Text
                              style={{ fontSize: "14px", color: "#52c41a" }}
                            >
                              <strong>Trạng thái hoàn tiền:</strong>
                            </Text>
                            <br />
                            <Text
                              style={{ fontSize: "13px", color: "#52c41a" }}
                            >
                              {selectedOrder.refundStatus === "COMPLETED"
                                ? "✅ Đã hoàn tiền thành công"
                                : selectedOrder.refundStatus === "PROCESSING"
                                  ? "⏳ Đang xử lý hoàn tiền"
                                  : "📋 Sẽ được hoàn tiền trong 3-7 ngày làm việc"}
                            </Text>
                          </div>
                        </div>
                      )}
                  </>
                ) : (
                  /* Nếu chưa hủy, hiển thị thông tin thanh toán & hành động */
                  <>
                    <h4
                      style={{
                        color: "#1890ff",
                        marginBottom: "16px",
                        fontSize: "16px",
                      }}
                    >
                      💳 Thanh toán & Hành động
                    </h4>

                    {/* Phương thức thanh toán */}
                    <div style={{ marginBottom: "20px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          marginBottom: "12px",
                        }}
                      >
                        {selectedOrder.paymentMethod === "COD" ? (
                          <>
                            <span style={{ fontSize: "18px" }}>💵</span>
                            <Text strong>Thanh toán khi nhận hàng</Text>
                          </>
                        ) : selectedOrder.paymentMethod === "BANKING" ? (
                          <>
                            <span style={{ fontSize: "18px" }}>🏦</span>
                            <div>
                              <Text strong style={{ display: "block" }}>
                                Chuyển khoản ngân hàng
                              </Text>
                              <Tag
                                color={
                                  selectedOrder.paymentStatus === "PAID"
                                    ? "success"
                                    : "error"
                                }
                                style={{ marginTop: "4px" }}
                              >
                                {selectedOrder.paymentStatus === "PAID"
                                  ? "✅ Đã thanh toán"
                                  : "❌ Chưa thanh toán"}
                              </Tag>
                            </div>
                          </>
                        ) : (
                          <>
                            <span style={{ fontSize: "18px" }}>💳</span>
                            <Text type="secondary">Chưa có thông tin</Text>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {selectedOrder.paymentMethod === "BANKING" &&
                        selectedOrder.paymentStatus !== "PAID" && (
                          <>
                            <Button
                              type="primary"
                              size="middle"
                              style={{
                                borderRadius: "8px",
                                backgroundColor: "#52c41a",
                                borderColor: "#52c41a",
                                fontWeight: "500",
                              }}
                              onClick={() => handlePayment(selectedOrder.id)}
                              block
                            >
                              💳 Thanh toán ngay
                            </Button>
                            <Button
                              type="default"
                              size="middle"
                              style={{ borderRadius: "8px", fontWeight: "500" }}
                              onClick={() =>
                                handleChangeCODPaymentMethod(selectedOrder.id)
                              }
                              block
                            >
                              🔄 Chuyển sang COD
                            </Button>
                          </>
                        )}

                      {(selectedOrder.status === "PENDING" ||
                        selectedOrder.status === "UNPAID") && (
                          <Button
                            danger
                            size="middle"
                            style={{
                              borderRadius: "8px",
                              fontWeight: "500",
                              marginTop: "8px",
                            }}
                            onClick={() =>
                              handleShowCancelModal(selectedOrder.id)
                            }
                            block
                          >
                            ❌ Hủy đơn hàng
                          </Button>
                        )}
                      <>
                        {selectedOrder.status === "DELIVERED" &&
                          (() => {
                            const deliveredAt = new Date(
                              selectedOrder.deliveredAt
                            );
                            const now = new Date();
                            const diffDays =
                              (now - deliveredAt) / (1000 * 60 * 60 * 24);

                            const isWithin3Days = diffDays <= 3;

                            return (
                              <Tooltip title="Chỉ có thể hoàn trả trong vòng 3 ngày sau khi giao">
                                <Button
                                  type="primary"
                                  size="middle"
                                  style={{
                                    borderRadius: "8px",
                                    fontWeight: "500",
                                    marginTop: "8px",
                                    backgroundColor: isWithin3Days
                                      ? "#1677ff"
                                      : "#d9d9d9",
                                    color: isWithin3Days ? "#fff" : "#888",
                                    cursor: isWithin3Days
                                      ? "pointer"
                                      : "not-allowed",
                                  }}
                                  onClick={() =>
                                    isWithin3Days &&
                                    handleReturnOrder(selectedOrder)
                                  }
                                  block
                                  disabled={!isWithin3Days}
                                >
                                  🔁 Hoàn trả hàng
                                </Button>
                              </Tooltip>
                            );
                          })()}

                        {/* Modal hoàn trả hàng */}
                        <Modal
                          title={
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <RollbackOutlined
                                style={{ color: "#faad14", fontSize: "20px" }}
                              />
                              <span>Hoàn trả sản phẩm</span>
                            </div>
                          }
                          open={isReturnModalVisible}
                          onCancel={handleCancelReturn}
                          footer={[
                            <Button key="cancel" onClick={handleCancelReturn}>
                              Hủy
                            </Button>,
                            <Button
                              key="submit"
                              type="primary"
                              onClick={handleSubmitReturn}
                              loading={loading}
                            >
                              Gửi yêu cầu hoàn trả
                            </Button>,
                          ]}
                          width={700}
                        >
                          {selectedOrder && (
                            <div>
                              {/* ✅ Thông tin chung đơn hàng */}
                              <div
                                style={{
                                  background: "#f5f5f5",
                                  padding: "16px",
                                  borderRadius: "8px",
                                  marginBottom: "24px",
                                }}
                              >
                                <div
                                  style={{
                                    fontWeight: 600,
                                    fontSize: "16px",
                                    marginBottom: "8px",
                                  }}
                                >
                                  🧾 Mã đơn hàng:{" "}
                                  <span style={{ color: "#1890ff" }}>
                                    {selectedOrder.orderCode}
                                  </span>
                                </div>

                                <div style={{ marginBottom: "4px" }}>
                                  <strong>📍 Địa chỉ:</strong>{" "}
                                  {selectedOrder.address}
                                </div>
                                <div style={{ marginBottom: "4px" }}>
                                  <strong>📅 Ngày đặt:</strong>{" "}
                                  {new Date(
                                    selectedOrder.createdAt
                                  ).toLocaleString("vi-VN")}
                                </div>
                                {selectedOrder.deliveredAt && (
                                  <div style={{ marginBottom: "4px" }}>
                                    <strong>🚚 Ngày giao:</strong>{" "}
                                    {new Date(
                                      selectedOrder.deliveredAt
                                    ).toLocaleString("vi-VN")}
                                  </div>
                                )}
                                <div style={{ marginBottom: "4px" }}>
                                  <strong>💰 Tổng tiền:</strong>{" "}
                                  {selectedOrder.totalAmount.toLocaleString(
                                    "vi-VN"
                                  )}{" "}
                                  ₫
                                </div>
                                <div style={{ marginBottom: "4px" }}>
                                  <strong>💳 Thanh toán:</strong>{" "}
                                  {selectedOrder.paymentMethod}
                                </div>
                                <div>
                                  <strong>📌 Ghi chú:</strong>{" "}
                                  {selectedOrder.note || "Không có"}
                                </div>
                              </div>

                              {/* ✅ Danh sách sản phẩm */}
                              <div style={{ marginBottom: "24px" }}>
                                <div
                                  style={{
                                    fontWeight: 600,
                                    fontSize: "16px",
                                    marginBottom: "12px",
                                  }}
                                >
                                  🛒 Sản phẩm trong đơn hàng
                                </div>
                                {selectedOrder.orderItems?.map((item) => (
                                  <div
                                    key={item.id}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "16px",
                                      borderBottom: "1px solid #f0f0f0",
                                      padding: "12px 0",
                                    }}
                                  >
                                    <img
                                      src={item.productImage}
                                      alt={item.productName}
                                      style={{
                                        width: "70px",
                                        height: "70px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        border: "1px solid #e8e8e8",
                                      }}
                                    />
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontWeight: 500 }}>
                                        {item.productName}
                                      </div>
                                      <div style={{ color: "#888" }}>
                                        Số lượng: {item.quantity} |{" "}
                                        {item.price.toLocaleString("vi-VN")} ₫
                                      </div>
                                    </div>
                                    <div style={{ fontWeight: 600 }}>
                                      {(
                                        item.price * item.quantity
                                      ).toLocaleString("vi-VN")}{" "}
                                      ₫
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* ✅ Thông tin hoàn trả */}
                              <div>
                                <div
                                  style={{
                                    fontWeight: 600,
                                    fontSize: "16px",
                                    marginBottom: "12px",
                                  }}
                                >
                                  📝 Lý do hoàn trả{" "}
                                  <span style={{ color: "#ff4d4f" }}>*</span>
                                </div>
                                <Select
                                  placeholder="Chọn lý do hoàn trả"
                                  value={returnReason}
                                  onChange={setReturnReason}
                                  style={{
                                    width: "100%",
                                    marginBottom: "16px",
                                  }}
                                >
                                  <Select.Option value="Không còn nhu cầu sử dụng">
                                    Không còn nhu cầu sử dụng
                                  </Select.Option>
                                  <Select.Option value="Sản phẩm bị hư hỏng / lỗi">
                                    Sản phẩm bị hư hỏng / lỗi
                                  </Select.Option>
                                  <Select.Option value="Giao sai sản phẩm">
                                    Giao sai sản phẩm
                                  </Select.Option>
                                  <Select.Option value="Thiếu sản phẩm / phụ kiện">
                                    Thiếu sản phẩm / phụ kiện
                                  </Select.Option>
                                  <Select.Option value="Không đúng mô tả">
                                    Không đúng mô tả
                                  </Select.Option>
                                  <Select.Option value="other">
                                    Lý do khác
                                  </Select.Option>
                                </Select>

                                <TextArea
                                  value={returnDescription}
                                  onChange={(e) =>
                                    setReturnDescription(e.target.value)
                                  }
                                  placeholder="Mô tả chi tiết tình trạng sản phẩm..."
                                  rows={4}
                                  style={{
                                    borderRadius: "8px",
                                    marginBottom: "16px",
                                  }}
                                />

                                <div>
                                  <div
                                    style={{
                                      marginBottom: "12px",
                                      fontWeight: 500,
                                    }}
                                  >
                                    Thêm ảnh/video (Tùy chọn)
                                  </div>
                                  <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    onChange={handleUploadChange}
                                    beforeUpload={beforeUpload}
                                    multiple
                                    maxCount={5}
                                    accept="image/*,video/*"
                                  >
                                    {fileList.length < 5 && (
                                      <div>
                                        <UploadOutlined
                                          style={{
                                            fontSize: "24px",
                                            color: "#1890ff",
                                          }}
                                        />
                                        <div
                                          style={{
                                            marginTop: 8,
                                            fontSize: "13px",
                                          }}
                                        >
                                          Tải lên
                                        </div>
                                      </div>
                                    )}
                                  </Upload>
                                  <div
                                    style={{
                                      color: "#888",
                                      fontSize: "13px",
                                      marginTop: "8px",
                                    }}
                                  >
                                    <PictureOutlined /> Ảnh hoặc{" "}
                                    <VideoCameraOutlined /> Video (Tối đa 5
                                    files, mỗi file &lt; 10MB)
                                  </div>
                                </div>

                                {/* <div
                                  style={{
                                    color: "#888",
                                    fontSize: "13px",
                                    marginTop: "8px",
                                  }}
                                >
                                  <PictureOutlined /> Ảnh hoặc{" "}
                                  <VideoCameraOutlined /> Video (Tối đa 5 files,
                                  mỗi file &lt; 10MB)
                                </div> */}
                              </div>
                            </div>
                          )}
                        </Modal>
                      </>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Danh sách sản phẩm */}
            <>
              <div style={{ marginBottom: "24px" }}>
                <h4
                  style={{
                    color: "#1890ff",
                    marginBottom: "16px",
                    fontSize: "16px",
                  }}
                >
                  🛍️ Sản phẩm đã đặt ({selectedOrder.orderItems.length} sản
                  phẩm)
                </h4>
                <div
                  className="order-detail-product-list"
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    border: "1px solid #e8e8e8",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  {selectedOrder.orderItems.map((item, index) => (
                    <div
                      className="order-detail-product-item"
                      key={index}
                      style={{
                        padding: "20px",
                        borderBottom:
                          index < selectedOrder.orderItems.length - 1
                            ? "1px solid #f0f0f0"
                            : "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        transition: "background-color 0.3s",
                      }}
                    >
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid #e8e8e8",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <Text
                          strong
                          style={{
                            fontSize: "16px",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          {item.productName}
                        </Text>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom:
                              selectedOrder.status === "DELIVERED" &&
                                !item.reviewed
                                ? "12px"
                                : "0",
                          }}
                        >
                          <div>
                            <Text type="secondary" style={{ fontSize: "14px" }}>
                              {item.price.toLocaleString("vi-VN")} ₫
                            </Text>
                            <Text type="secondary" style={{ margin: "0 8px" }}>
                              ×
                            </Text>
                            <Text style={{ fontSize: "14px" }}>
                              {item.quantity}
                            </Text>
                          </div>
                          <Text
                            strong
                            style={{ color: "#1890ff", fontSize: "16px" }}
                          >
                            {(item.price * item.quantity).toLocaleString(
                              "vi-VN"
                            )}{" "}
                            ₫
                          </Text>
                        </div>

                        {/* Nút đánh giá sản phẩm */}
                        {selectedOrder.status === "DELIVERED" &&
                          !item.reviewed && (
                            <Button
                              type="primary"
                              size="small"
                              icon={<StarOutlined />}
                              onClick={() => handleReviewProduct(item)}
                              style={{
                                borderRadius: "6px",
                                fontSize: "13px",
                              }}
                            >
                              Đánh giá sản phẩm
                            </Button>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal đánh giá sản phẩm */}
              <Modal
                title={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <StarOutlined
                      style={{ color: "#faad14", fontSize: "20px" }}
                    />
                    <span>Đánh giá sản phẩm</span>
                  </div>
                }
                open={isReviewModalVisible}
                onCancel={handleCloseOrderModalReview}
                footer={[
                  <Button key="cancel" onClick={handleCloseOrderModalReview}>
                    Hủy
                  </Button>,
                  <Button
                    key="submit"
                    type="primary"
                    onClick={handleSubmitReview}
                    loading={loading}
                  >
                    Gửi đánh giá
                  </Button>,
                ]}
                width={600}
              >
                {selectedProduct && (
                  <div>
                    {/* Thông tin sản phẩm */}
                    <div
                      style={{
                        display: "flex",
                        gap: "16px",
                        padding: "16px",
                        background: "#f5f5f5",
                        borderRadius: "8px",
                        marginBottom: "24px",
                      }}
                    >
                      <img
                        src={selectedProduct.productImage}
                        alt={selectedProduct.productName}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid #e8e8e8",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: "15px",
                            marginBottom: "8px",
                          }}
                        >
                          {selectedProduct.productName}
                        </div>
                        <div style={{ color: "#888", fontSize: "14px" }}>
                          Số lượng: {selectedProduct.quantity}
                        </div>
                      </div>
                    </div>

                    {/* Đánh giá sao */}
                    <div style={{ marginBottom: "24px" }}>
                      <div style={{ marginBottom: "12px", fontWeight: 500 }}>
                        Đánh giá của bạn{" "}
                        <span style={{ color: "#ff4d4f" }}>*</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <Rate
                          value={rating}
                          onChange={setRating}
                          style={{ fontSize: "32px" }}
                        />
                        <span
                          style={{
                            color: "#1890ff",
                            fontSize: "16px",
                            fontWeight: 500,
                          }}
                        >
                          {rating === 1 && "Rất tệ"}
                          {rating === 2 && "Tệ"}
                          {rating === 3 && "Bình thường"}
                          {rating === 4 && "Tốt"}
                          {rating === 5 && "Tuyệt vời"}
                        </span>
                      </div>
                    </div>

                    {/* Viết đánh giá */}
                    <div style={{ marginBottom: "24px" }}>
                      <div style={{ marginBottom: "12px", fontWeight: 500 }}>
                        Nhận xét của bạn{" "}
                        <span style={{ color: "#ff4d4f" }}>*</span>
                      </div>
                      <TextArea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm này..."
                        rows={5}
                        maxLength={1000}
                        showCount
                        style={{ borderRadius: "8px" }}
                      />
                    </div>

                    {/* Upload ảnh/video */}
                    <div>
                      <div style={{ marginBottom: "12px", fontWeight: 500 }}>
                        Thêm ảnh/video (Tùy chọn)
                      </div>
                      <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleUploadChange}
                        beforeUpload={beforeUpload}
                        multiple
                        maxCount={5}
                        accept="image/*,video/*"
                      >
                        {fileList.length < 5 && (
                          <div>
                            <UploadOutlined
                              style={{ fontSize: "24px", color: "#1890ff" }}
                            />
                            <div style={{ marginTop: 8, fontSize: "13px" }}>
                              Tải lên
                            </div>
                          </div>
                        )}
                      </Upload>
                      <div
                        style={{
                          color: "#888",
                          fontSize: "13px",
                          marginTop: "8px",
                        }}
                      >
                        <PictureOutlined /> Ảnh hoặc <VideoCameraOutlined />{" "}
                        Video (Tối đa 5 files, mỗi file &lt; 10MB)
                      </div>
                    </div>
                  </div>
                )}
              </Modal>
            </>

            {/* Tóm tắt đơn hàng */}
            <div
              style={{
                background: "#fff",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid #e8e8e8",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <h4
                style={{
                  color: "#1890ff",
                  marginBottom: "20px",
                  fontSize: "18px",
                }}
              >
                💰 Chi tiết thanh toán
              </h4>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* Tạm tính */}
                <div
                  className="order-detail-total"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: "15px" }}>
                    Tạm tính ({selectedOrder.orderItems.length} sản phẩm)
                  </Text>
                  <Text style={{ fontSize: "15px", fontWeight: 500 }}>
                    {selectedOrder.orderItems
                      .reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      )
                      .toLocaleString("vi-VN")}{" "}
                    ₫
                  </Text>
                </div>

                {/* Phí vận chuyển */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: "15px" }}>Phí vận chuyển</Text>
                  <Text
                    style={{
                      fontSize: "15px",
                      fontWeight: 500,
                      color: "#52c41a",
                    }}
                  >
                    {selectedOrder.shippingFee
                      ? `${selectedOrder.shippingFee.toLocaleString("vi-VN")} ₫`
                      : "Miễn phí"}
                  </Text>
                </div>

                {/* Giảm giá (nếu có) */}
                {selectedOrder.discountPercent > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Text style={{ fontSize: "15px" }}>Giảm giá</Text>
                      {selectedOrder.promotion && (
                        <Tag color="red" style={{ margin: 0 }}>
                          {selectedOrder.promotion.code}
                        </Tag>
                      )}
                      <Tag color="volcano" style={{ margin: 0 }}>
                        -{selectedOrder.discountPercent}%
                      </Tag>
                    </div>
                    <Text
                      style={{
                        fontSize: "15px",
                        fontWeight: 500,
                        color: "#ff4d4f",
                      }}
                    >
                      -
                      {(
                        (selectedOrder.orderItems.reduce(
                          (sum, item) => sum + item.price * item.quantity,
                          0
                        ) *
                          selectedOrder.discountPercent) /
                        100
                      ).toLocaleString("vi-VN")}{" "}
                      ₫
                    </Text>
                  </div>
                )}

                <Divider style={{ margin: "8px 0" }} />

                {/* Tổng thanh toán */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "8px",
                    color: "white",
                  }}
                >
                  <Text className="order-total-label">
                    Tổng thanh toán
                  </Text>
                  <Text className="order-total-value">
                    {selectedOrder.totalAmount.toLocaleString("vi-VN")} ₫
                  </Text>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal chọn lý do hủy đơn hàng */}
      <Modal
        title={
          <div style={{ textAlign: "center" }}>
            <h3 style={{ margin: 0, color: "#ff4d4f", fontSize: "18px" }}>
              ❌ Hủy đơn hàng #{selectedOrder?.id}
            </h3>
            <Text type="secondary" style={{ fontSize: "14px" }}>
              Vui lòng cho chúng tôi biết lý do hủy đơn hàng
            </Text>
          </div>
        }
        open={isCancelModalVisible}
        onCancel={handleCloseCancelModal}
        width={500}
        centered
        footer={[
          <Button key="cancel" onClick={handleCloseCancelModal}>
            Quay lại
          </Button>,
          <Button
            key="confirm"
            type="primary"
            danger
            onClick={handleConfirmCancel}
            disabled={
              !selectedCancelReason ||
              (selectedCancelReason === "other" && !customCancelReason.trim())
            }
          >
            Xác nhận hủy
          </Button>,
        ]}
      >
        <div style={{ padding: "16px 0" }}>
          <Radio.Group
            value={selectedCancelReason}
            onChange={(e) => setSelectedCancelReason(e.target.value)}
            style={{ width: "100%" }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {cancelReasons.map((reason) => (
                <Radio
                  key={reason.value}
                  value={reason.value}
                  style={{
                    padding: "12px",
                    border:
                      selectedCancelReason === reason.value
                        ? "2px solid #1890ff"
                        : "1px solid #d9d9d9",
                    borderRadius: "8px",
                    backgroundColor:
                      selectedCancelReason === reason.value
                        ? "#f6ffed"
                        : "#fff",
                    transition: "all 0.3s",
                  }}
                >
                  <span style={{ fontSize: "14px", fontWeight: "500" }}>
                    {reason.label}
                  </span>
                </Radio>
              ))}
            </div>
          </Radio.Group>

          {/* Ô nhập lý do khác */}
          {selectedCancelReason === "other" && (
            <div style={{ marginTop: "16px" }}>
              <Text strong style={{ display: "block", marginBottom: "8px" }}>
                Vui lòng nhập lý do cụ thể:
              </Text>
              <Input.TextArea
                value={customCancelReason}
                onChange={(e) => setCustomCancelReason(e.target.value)}
                placeholder="Nhập lý do hủy đơn hàng..."
                rows={3}
                maxLength={500}
                showCount
                style={{ borderRadius: "8px" }}
              />
            </div>
          )}

          {/* Thông báo lưu ý */}
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              backgroundColor: "#fff2e8",
              borderRadius: "8px",
              border: "1px solid #ffb366",
            }}
          >
            <Text type="warning" style={{ fontSize: "13px" }}>
              <span style={{ marginRight: "8px" }}>⚠️</span>
              Lưu ý: Đơn hàng đã hủy không thể khôi phục. Nếu bạn muốn mua lại,
              vui lòng đặt đơn hàng mới.
            </Text>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Component quản lý địa chỉ giao hàng
const AddressesTab = () => {
  const [addresses, setAddresses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [form] = Form.useForm();
  const [notification, setNotification] = useState({
    type: "",
    message: "",
    visible: false,
  });

  const showNotification = (type, message) => {
    setNotification({ type, message, visible: true });
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
      setNotification({ type: "", message: "", visible: false });
    }, 3000);
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const resGetAddresses = await getAddresses();

      setAddresses(resGetAddresses.data.addresses || []);
    } catch (error) {
      console.error("Error loading addresses:", error);
      setAddresses([]);
    }
  };

  const saveAddresses = (newAddresses) => {
    try {
      localStorage.setItem("userAddresses", JSON.stringify(newAddresses));
      setAddresses(newAddresses);
    } catch (error) {
      console.error("Error saving addresses:", error);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Hàm lấy địa chỉ hiện tại bằng GPS
  const handleGetCurrentLocation = () => {
    console.log("🚀 handleGetCurrentLocation called");

    try {
      // Mở modal ngay để người dùng thấy
      setEditingAddress(null);
      form.resetFields();
      setIsModalVisible(true);

      if (!navigator.geolocation) {
        console.error("❌ Browser không hỗ trợ geolocation");
        message.error(
          "Trình duyệt của bạn không hỗ trợ định vị GPS! Vui lòng nhập thủ công."
        );
        return;
      }

      console.log(
        "✅ Browser hỗ trợ geolocation, đang yêu cầu quyền truy cập..."
      );
      message.loading(
        "Đang lấy vị trí GPS chính xác (có thể mất 10-15 giây)...",
        0
      );
    } catch (error) {
      console.error("❌ Error in handleGetCurrentLocation:", error);
      message.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      return;
    }

    // Sử dụng watchPosition với timeout để lấy vị trí chính xác nhất
    let watchId;
    let timeoutId;

    const options = {
      enableHighAccuracy: true, // Bắt buộc dùng GPS thật, không dùng IP
      timeout: 20000, // Tăng timeout lên 20 giây
      maximumAge: 0, // Không dùng cache, luôn lấy vị trí mới nhất
    };

    console.log("⏱️ Setting up timeout (20s)");
    timeoutId = setTimeout(() => {
      console.warn("⏰ Timeout: Không lấy được vị trí sau 20s");
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
      message.destroy();
      message.error(
        "Không thể lấy vị trí trong thời gian cho phép. Vui lòng đảm bảo GPS đã bật và thử lại."
      );
    }, 20000);

    console.log("📡 Calling navigator.geolocation.watchPosition...");
    watchId = navigator.geolocation.watchPosition(
      async (position) => {
        console.log("✅ GPS Position received:", position);

        // Clear watch và timeout khi đã có vị trí
        navigator.geolocation.clearWatch(watchId);
        clearTimeout(timeoutId);

        const { latitude, longitude, accuracy } = position.coords;

        console.log("📍 GPS Coordinates:", {
          latitude,
          longitude,
          accuracy: `${accuracy ? accuracy.toFixed(2) : "N/A"}m`,
        });

        // Chỉ lấy vị trí nếu accuracy tốt (dưới 100m) hoặc đã chờ đủ lâu
        if (accuracy && accuracy > 100) {
          console.warn("⚠️ GPS accuracy thấp:", accuracy, "m");
        }

        console.log("🌐 Calling Nominatim API...");
        try {
          // Sử dụng Nominatim API (OpenStreetMap) - miễn phí, không cần API key
          // Lưu ý: Nominatim yêu cầu User-Agent header
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&accept-language=vi&zoom=18`,
            {
              headers: {
                "User-Agent": "HIEUVINHbook/1.0",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Không thể lấy địa chỉ từ tọa độ");
          }

          const data = await response.json();

          if (!data || !data.address) {
            throw new Error("Không tìm thấy địa chỉ");
          }

          console.log("🗺️ Reverse Geocoding Result:", data);

          const address = data.address;

          console.log("🔍 Raw Nominatim Data:", {
            display_name: data.display_name,
            address: address,
          });

          // Parse địa chỉ cho Việt Nam
          // Nominatim trả về format khác nhau, cần xử lý nhiều trường hợp
          let street = "";
          let houseNumber = "";

          // Lấy số nhà nếu có trong address object
          if (address.house_number) {
            houseNumber = address.house_number;
          }

          // Thử parse số nhà từ display_name (số ở đầu phần đầu tiên)
          if (!houseNumber && data.display_name) {
            const firstPart = data.display_name.split(",")[0] || "";
            // Pattern: số có thể có chữ cái hoặc ký tự đặc biệt
            const numberMatch = firstPart.match(
              /^(\d+[A-Za-z]?[\s\/-]?\d*)\s+/
            );
            if (numberMatch) {
              houseNumber = numberMatch[1].trim();
            }
          }

          // Lấy tên đường
          if (address.road) {
            // Nếu có road trong address, kết hợp với số nhà
            if (houseNumber) {
              street = `${houseNumber} ${address.road}`;
            } else {
              street = address.road;
            }
          } else if (houseNumber) {
            // Nếu chỉ có số nhà, thử lấy tên đường từ display_name
            const firstPart = data.display_name.split(",")[0] || "";
            const roadName = firstPart
              .replace(/^\d+[A-Za-z]?[\s\/-]?\d*\s*/, "")
              .trim();
            street = roadName ? `${houseNumber} ${roadName}` : houseNumber;
          } else {
            // Fallback: lấy phần đầu của display_name (có thể chỉ là tên đường)
            street = data.display_name.split(",")[0] || "";
          }

          // Phường/Xã - ưu tiên theo thứ tự
          let ward =
            address.suburb ||
            address.village ||
            address.neighbourhood ||
            address.quarter ||
            address.ward ||
            "";

          // Quận/Huyện - ưu tiên theo thứ tự, parse từ nhiều nguồn
          // Kiểm tra TẤT CẢ các field có thể chứa district
          // Hàm helper để kiểm tra xem giá trị có phải district hợp lệ không
          const isValidDistrict = (value) => {
            if (!value) return false;
            const val = String(value).trim();

            // Loại trừ các giá trị là city
            if (
              val.includes("Thành phố") ||
              val.includes("TP.") ||
              val.includes("Tỉnh") ||
              val.includes("Hồ Chí Minh") ||
              val.includes("Việt Nam") ||
              val.toLowerCase().includes("city")
            ) {
              return false;
            }

            // Loại trừ các giá trị chỉ là số (postal code, mã số)
            // Ví dụ: "72106", "10000", etc.
            if (/^\d+$/.test(val) || /^\d{4,6}$/.test(val)) {
              console.warn(
                "⚠️ Rejected numeric value (likely postal code):",
                val
              );
              return false;
            }

            // Loại trừ các giá trị quá ngắn hoặc chỉ là số
            if (val.length < 3 || /^\d+$/.test(val)) {
              return false;
            }

            return true;
          };

          let district = "";
          // Kiểm tra từng field và validate
          if (isValidDistrict(address.city_district)) {
            district = address.city_district;
          } else if (isValidDistrict(address.district)) {
            district = address.district;
          } else if (isValidDistrict(address.municipality)) {
            district = address.municipality;
          } else if (isValidDistrict(address.county)) {
            district = address.county;
          } else if (isValidDistrict(address.state_district)) {
            district = address.state_district;
          } else if (isValidDistrict(address.suburb_type)) {
            district = address.suburb_type;
          } else if (isValidDistrict(address.town)) {
            district = address.town;
          }

          console.log("🔍 Checking address object for district:", {
            city_district: address.city_district,
            district: address.district,
            municipality: address.municipality,
            county: address.county,
            state_district: address.state_district,
            suburb_type: address.suburb_type,
            town: address.town,
            selected: district || "(none)",
          });

          // Nếu không có district từ address object, parse từ display_name
          if (!district && data.display_name) {
            const parts = data.display_name.split(",").map((p) => p.trim());

            console.log("🔍 Parsing district from display_name parts:", parts);

            // Tìm phần có chứa "Quận" hoặc "Huyện" - duyệt tất cả các phần (ƯU TIÊN)
            // Logic này sẽ parse từ GPS/Nominatim API, hoàn toàn động cho mọi vị trí
            for (let i = 0; i < parts.length; i++) {
              const part = parts[i];

              // Bỏ qua các phần chỉ là số (postal code)
              if (/^\d+$/.test(part)) {
                continue;
              }

              // Kiểm tra pattern "Quận" với số hoặc tên (nhiều pattern hơn)
              if (
                part.match(/Quận\s+\d+/i) ||
                part.match(/^Quận\s+[A-Za-zÀ-ỹ]+/i) ||
                part.match(/Quận\s+[A-Za-zÀ-ỹ\s]+/i) ||
                part.match(/Quận\s+[A-Za-zÀ-ỹ\s\d]+/i)
              ) {
                district = part.trim();
                console.log("✅ Found district (Quận) from API:", district);
                break;
              }

              // Kiểm tra pattern "Huyện"
              if (
                part.match(/Huyện\s+[A-Za-zÀ-ỹ\s]+/i) ||
                part.includes("Huyện")
              ) {
                district = part.trim();
                console.log("✅ Found district (Huyện) from API:", district);
                break;
              }

              // Fallback: tìm bất kỳ phần nào có "Quận" hoặc "Huyện"
              if (part.includes("Quận") || part.includes("Huyện")) {
                district = part.trim();
                console.log("✅ Found district (fallback) from API:", district);
                break;
              }
            }

            // Nếu vẫn không tìm được từ pattern, thử tìm bằng cách loại trừ:
            // Phần không phải ward, không phải city, không phải country -> có thể là district
            if (!district && parts.length > 2) {
              // Ưu tiên tìm phần ở giữa (thường là quận), không phải đầu/cuối
              for (let i = 1; i < parts.length - 1; i++) {
                const part = parts[i].trim();

                // Bỏ qua mã số (postal code)
                if (/^\d+$/.test(part) || /^\d{4,6}$/.test(part)) {
                  continue;
                }

                // Nếu phần này không phải ward, không phải city, và có độ dài hợp lý
                if (
                  !part.includes("Phường") &&
                  !part.includes("Xã") &&
                  !part.includes("TP.") &&
                  !part.includes("Thành phố") &&
                  !part.includes("Tỉnh") &&
                  !part.includes("Hồ Chí Minh") &&
                  !part.includes("Việt Nam") &&
                  !part.includes("Vietnam") &&
                  part.length > 5 &&
                  part.length < 30
                ) {
                  // Kiểm tra nếu có từ "Quận" hoặc "Huyện"
                  if (part.indexOf("Quận") >= 0 || part.indexOf("Huyện") >= 0) {
                    district = part;
                    console.log(
                      "✅ Found district (smart fallback):",
                      district
                    );
                    break;
                  }
                  // Nếu không có "Quận"/"Huyện" nhưng vẫn có thể là quận (tên riêng)
                  // Ví dụ: "Tân Bình", "Gò Vấp" - nhưng cần cẩn thận
                  // Chỉ dùng nếu đã loại trừ hết các khả năng khác
                }
              }
            }
          }

          // Nếu VẪN không có district, cảnh báo và gợi ý
          if (!district) {
            console.warn("⚠️ Could not find district from API!");
            console.warn(
              "📋 Full address data:",
              JSON.stringify(address, null, 2)
            );
            console.warn("📋 Full display_name:", data.display_name);

            // Mapping đặc biệt cho một số phường -> quận (FALLBACK CUỐI CÙNG)
            // CHỈ dùng khi tất cả các phương pháp parse từ GPS/API đều thất bại
            const wardToDistrictMap = {
              "Bảy Hiền": "Quận Tân Bình",
              "Phường Bảy Hiền": "Quận Tân Bình",
              "Bảy Hiền,": "Quận Tân Bình",
            };

            const displayNameLower = (data.display_name || "").toLowerCase();

            // Kiểm tra mapping nếu có
            for (const [wardKey, districtValue] of Object.entries(
              wardToDistrictMap
            )) {
              if (displayNameLower.includes(wardKey.toLowerCase())) {
                district = districtValue;
                console.log(
                  "⚠️ Using district mapping (last resort fallback):",
                  district
                );
                break;
              }
            }

            // Nếu vẫn không có, thử lấy từ phần giữa của display_name
            if (!district && data.display_name) {
              const allParts = data.display_name
                .split(",")
                .map((p) => p.trim());
              // Bỏ qua phần đầu (đường) và phần cuối (city)
              for (let i = 1; i < allParts.length - 1; i++) {
                const part = allParts[i];

                // Bỏ qua mã số (postal code)
                if (/^\d+$/.test(part) || /^\d{4,6}$/.test(part)) {
                  continue;
                }

                // QUAN TRỌNG: Loại trừ các phần có "Thành phố", "TP.", "Tỉnh"
                if (
                  part &&
                  !part.includes("Phường") &&
                  !part.includes("Xã") &&
                  !part.includes("Thành phố") &&
                  !part.includes("TP.") &&
                  !part.includes("Tỉnh") &&
                  !part.includes("Hồ Chí Minh") &&
                  !part.includes("Việt Nam") &&
                  part.length > 3
                ) {
                  // Đảm bảo có độ dài hợp lý
                  // Có thể là district, thử dùng
                  district = part;
                  console.log(
                    "⚠️ Using potential district (very last resort):",
                    district
                  );
                  break;
                }
              }
            }
          }

          // KIỂM TRA AN TOÀN: Đảm bảo district KHÔNG phải là city hoặc mã số
          if (district) {
            const districtStr = String(district).trim();

            // Kiểm tra nếu là mã số (postal code)
            if (/^\d+$/.test(districtStr) || /^\d{4,6}$/.test(districtStr)) {
              console.warn("⚠️ District là mã số, đang reset:", district);
              district = "";
            }
            // Kiểm tra nếu là city
            else if (
              districtStr.includes("Thành phố") ||
              districtStr.includes("TP.") ||
              districtStr.includes("Tỉnh") ||
              districtStr.includes("Hồ Chí Minh") ||
              districtStr.includes("Việt Nam")
            ) {
              console.warn(
                "⚠️ District bị nhầm với city, đang reset:",
                district
              );
              district = ""; // Reset về rỗng để người dùng tự điền
            }
          }

          // Tỉnh/Thành phố
          let city = address.state || address.region || address.province || "";

          // Parse city từ display_name nếu chưa có
          if (!city && data.display_name) {
            const parts = data.display_name.split(",");
            for (const part of parts) {
              const trimmed = part.trim();
              if (
                trimmed.includes("TP.") ||
                trimmed.includes("Thành phố") ||
                trimmed.includes("Tỉnh") ||
                trimmed.includes("Hồ Chí Minh")
              ) {
                city = trimmed;
                break;
              }
            }
          }

          console.log("📍 Parsed Address:", {
            street,
            houseNumber,
            ward,
            district,
            city,
            rawAddress: address,
            displayName: data.display_name,
          });

          // Nếu vẫn không có ward, thử parse từ display_name
          if (!ward && data.display_name) {
            const parts = data.display_name.split(",");
            for (const part of parts) {
              const trimmed = part.trim();
              if (
                trimmed.includes("Phường") ||
                trimmed.includes("Xã") ||
                trimmed.includes("Ward")
              ) {
                ward = trimmed;
                break;
              }
            }
          }

          // Điền vào form (modal đã được mở trước đó)
          form.setFieldsValue({
            street: street || data.display_name.split(",")[0] || "",
            ward: ward || "",
            district: district || "",
            city: city || "TP. Hồ Chí Minh", // Fallback nếu không có
            note: "", // Không điền vào ghi chú
          });

          message.destroy();
          message.success(
            `Đã lấy vị trí GPS! Độ chính xác: ${accuracy ? accuracy.toFixed(0) + "m" : "N/A"
            }. Bạn có thể chỉnh sửa nếu cần.`
          );
        } catch (error) {
          console.error("Error reverse geocoding:", error);
          message.destroy();
          message.error(
            "Không thể lấy địa chỉ. Vui lòng thử lại hoặc nhập thủ công."
          );
        }
      },
      (error) => {
        console.error("❌ Geolocation Error:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);

        navigator.geolocation.clearWatch(watchId);
        clearTimeout(timeoutId);
        message.destroy();

        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.error("🔒 PERMISSION_DENIED - Người dùng từ chối quyền");
            message.error(
              "Bạn đã từ chối quyền truy cập vị trí. Vui lòng cho phép trong cài đặt trình duyệt để sử dụng tính năng này."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            console.error("📡 POSITION_UNAVAILABLE - Không thể lấy vị trí");
            message.error(
              "Không thể lấy vị trí. Vui lòng kiểm tra GPS đã bật và kết nối mạng ổn định."
            );
            break;
          case error.TIMEOUT:
            console.error("⏰ TIMEOUT - Hết thời gian chờ");
            message.error(
              "Hết thời gian chờ lấy vị trí. Vui lòng thử lại hoặc đảm bảo GPS đã bật."
            );
            break;
          default:
            console.error("❓ Unknown error:", error);
            message.error("Đã xảy ra lỗi khi lấy vị trí: " + error.message);
            break;
        }
      },
      options
    );
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    form.setFieldsValue(address);
    setIsModalVisible(true);
  };

  const handleDeleteAddress = async (addressId) => {
    const resDeleteAddress = await deleteAddress(addressId);
    if (resDeleteAddress.status === "success") {
      showNotification("success", "Xóa địa chỉ thành công!");
      loadAddresses();
    } else {
      showNotification("error", "Lỗi khi xóa địa chỉ!");
    }
  };

  const handleSetDefault = (addressId) => {
    const newAddresses = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === addressId,
    }));
    saveAddresses(newAddresses);
    message.success("Đã đặt địa chỉ mặc định!");
  };

  const handleSubmitAddress = async (values) => {
    try {
      if (editingAddress) {
        const resUpdateAddress = await updateAddress(
          editingAddress.id,
          values.street,
          values.ward,
          values.district,
          values.city,
          values.note
        );
        if (resUpdateAddress && resUpdateAddress.data) {
          setIsModalVisible(false);
          showNotification("success", "Cập nhật địa chỉ thành công!");
          loadAddresses();
        } else {
          showNotification("error", "Lỗi khi cập nhật địa chỉ!");
        }
      } else {
        const resAddAddress = await addAddress(
          values.street,
          values.ward,
          values.district,
          values.city,
          values.note
        );
        if (resAddAddress && resAddAddress.data) {
          setIsModalVisible(false);
          showNotification("success", "Thêm địa chỉ thành công!");
          loadAddresses();
        }
      }
    } catch (error) {
      console.error("Error saving address:", error);
      showNotification("error", "Có lỗi khi lưu địa chỉ!");
    }
  };

  // Lắng nghe sự thay đổi của địa chỉ từ Profile
  useEffect(() => {
    const handleAddressesUpdated = () => {
      console.log("AddressesUpdated event received, reloading addresses...");
      loadAddresses();
    };

    window.addEventListener("addressesUpdated", handleAddressesUpdated);
    return () =>
      window.removeEventListener("addressesUpdated", handleAddressesUpdated);
  }, []);

  return (
    <div>
      {/* Notification System */}
      {notification.visible && (
        <div
          className={`notification ${notification.type}`}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "16px 24px",
            borderRadius: "8px",
            color: "white",
            fontWeight: "bold",
            zIndex: 9999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            backgroundColor:
              notification.type === "success"
                ? "#52c41a"
                : notification.type === "error"
                  ? "#ff4d4f"
                  : "#1890ff",
          }}
        >
          {notification.message}
        </div>
      )}
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ marginBottom: 16 }}>
          Quản lý địa chỉ giao hàng
        </Title>
        <p style={{ color: "#666", marginBottom: 16 }}>
          Quản lý các địa chỉ giao hàng của bạn. Địa chỉ mặc định sẽ được tự
          động chọn khi đặt hàng.
        </p>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddAddress}
          >
            Thêm địa chỉ mới
          </Button>
          <Button
            type="default"
            icon={<EnvironmentOutlined />}
            onClick={handleGetCurrentLocation}
          >
            Địa chỉ hiện tại
          </Button>
        </div>
      </div>

      {addresses.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <EnvironmentOutlined
            style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }}
          />
          <br />
          <Text type="secondary">Bạn chưa có địa chỉ nào</Text>
          <br />
          <Button type="link" onClick={handleAddAddress}>
            Thêm địa chỉ đầu tiên
          </Button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {addresses.map((address) => (
            <Card
              key={address.id}
              style={{
                border: address.isDefault
                  ? "2px solid #52c41a"
                  : "1px solid #d9d9d9",
                borderRadius: 8,
              }}
              bodyStyle={{ padding: 16 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Text strong style={{ fontSize: 16, marginRight: 16 }}>
                      {address.fullName}
                    </Text>
                    <Text type="secondary">{address.phone}</Text>
                    {address.isDefault && (
                      <Tag color="success" style={{ marginLeft: 12 }}>
                        Mặc định
                      </Tag>
                    )}
                  </div>

                  <div style={{ marginBottom: 8 }}>
                    <Text>{address.street}</Text>
                    <br />
                    <Text type="secondary">
                      {address.ward}, {address.district}, {address.city}
                    </Text>
                  </div>

                  {address.note && (
                    <Text type="secondary" style={{ fontStyle: "italic" }}>
                      Ghi chú: {address.note}
                    </Text>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    marginLeft: 16,
                  }}
                >
                  {/* {!address.isDefault && (
                                        <Button
                                            size="small"
                                            onClick={() => handleSetDefault(address.id)}
                                        >
                                            Đặt mặc định
                                        </Button>
                                    )} */}
                  <Button
                    size="small"
                    onClick={() => handleEditAddress(address)}
                  >
                    Chỉnh sửa
                  </Button>
                  <Popconfirm
                    title="Xóa địa chỉ"
                    description="Bạn có chắc muốn xóa địa chỉ giao hàng này không?"
                    onConfirm={() => handleDeleteAddress(address.id)}
                    okText="Có"
                    cancelText="Không"
                    okButtonProps={{ danger: true }}
                  >
                    <Button size="small" danger>
                      Xóa
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        title={editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitAddress}>
          <Form.Item
            name="street"
            label="Số nhà, tên đường"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input placeholder="Ví dụ: 123 Nguyễn Văn Linh" />
          </Form.Item>

          <div style={{ display: "flex", gap: 16 }}>
            <Form.Item
              name="ward"
              label="Phường/Xã"
              rules={[{ required: true, message: "Vui lòng nhập phường/xã!" }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Ví dụ: Phường 7" />
            </Form.Item>
            <Form.Item
              name="district"
              label="Quận/Huyện"
              rules={[{ required: true, message: "Vui lòng nhập quận/huyện!" }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Ví dụ: Quận 8" />
            </Form.Item>
          </div>

          <Form.Item
            name="city"
            label="Tỉnh/Thành phố"
            rules={[
              { required: true, message: "Vui lòng nhập tỉnh/thành phố!" },
            ]}
          >
            <Input placeholder="Ví dụ: TP. Hồ Chí Minh" />
          </Form.Item>

          <Form.Item name="note" label="Ghi chú (không bắt buộc)">
            <Input.TextArea
              placeholder="Ví dụ: Địa chỉ nhà riêng, công ty..."
              rows={2}
            />
          </Form.Item>

          <Form.Item>
            <div
              style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}
            >
              <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {editingAddress ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [profile, setProfile] = useState(defaultProfile);
  const { user, setUser, fetchUserInfor } = useContext(AuthContext);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { tab } = useParams();
  const [notification, setNotification] = useState({
    type: "",
    message: "",
    visible: false,
  });
  const [activeTab, setActiveTab] = useState(tab || "info");

  // Hàm hiển thị thông báo
  const showNotification = (type, message) => {
    setNotification({ type, message, visible: true });
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
      setNotification({ type: "", message: "", visible: false });
    }, 3000);
  };

  useEffect(() => {
    try {
      // Đọc thông tin từ authUser (người dùng đã đăng nhập)
      const authUser = localStorage.getItem("access_token");
      if (authUser) {
        const userData = user;
        // Cập nhật profile state với thông tin người dùng
        const userProfile = {
          username: userData.username || "",
          email: userData.email || "",
          phone: userData.phone || "",
          avatar: userData.avatarUrl || "",
        };

        setProfile(userProfile);
        form.setFieldsValue(userProfile);

        setAvatarUrl(userData.avatarUrl || "");
      } else {
        console.log("No authUser found, user not logged in");
      }
    } catch (e) {
      console.error("Error loading user profile:", e);
    }
  }, [user, form]);

  // Cập nhật activeTab khi URL thay đổi
  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    } else {
      setActiveTab("info");
    }
  }, [tab]);

  // Function để xử lý khi người dùng chuyển tab
  const handleTabChange = (activeKey) => {
    setActiveTab(activeKey);
    // Cập nhật URL khi chuyển tab
    if (activeKey === "info") {
      navigate("/profile");
    } else {
      navigate(`/profile/${activeKey}`);
    }
  };

  // Hàm xử lý upload tùy chỉnh
  const customRequest = ({ file, onSuccess, onError }) => {
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
    setFile(file);
    setPreviewUrl("");
    onSuccess();
  };

  // Khi chọn file
  const handleAvatarChange = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} đã được tải lên thành công!`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} tải lên thất bại!`);
    }
  };

  // Xử lý lưu ảnh
  const handleSave = async () => {
    if (!file) {
      alert("Vui lòng chọn ảnh trước khi lưu!");
      return;
    }

    setLoading(true);
    try {
      const resUpdateAvatar = await updateAvatarAPI(file);
      if (resUpdateAvatar.status === "success") {
        // setUser(resUpdateAvatar.data.user);
        setAvatarUrl(resUpdateAvatar.data.user.avatarUrl);
        showNotification("success", "Cập nhật ảnh đại diện thành công!");
        setFile(null);
        await fetchUserInfor();
      } else {
        showNotification(
          "error",
          resUpdateAvatar.message || "Lỗi khi cập nhật ảnh đại diện!"
        );
      }
    } catch (error) {
      showNotification("error", "Lỗi khi cập nhật ảnh đại diện!");
      setAvatarUrl(user.avatarUrl || null);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý hủy bỏ
  const handleCancel = () => {
    setFile(null);
    setAvatarUrl(user.avatarUrl || null);
    setPreviewUrl("");
    message.info("Hủy bỏ thay đổi ảnh!");
  };

  const onSaveProfile = async (value) => {
    try {
      const resUpdateInfo = await updateInFo(value.username, value.phone);
      if (resUpdateInfo.status === "success") {
        showNotification("success", "Cập nhật thông tin thành công!");
        await fetchUserInfor();
      } else {
        showNotification("error", resUpdateInfo.message || "Lỗi khi cập nhật");
      }
    } catch (error) {
      showNotification("error", "Lỗi khi cập nhật");
    }
  };

  const onChangePassword = async (values) => {
    try {
      const resChangePassword = await changePasswordAPI(
        values.currentPassword,
        values.newPassword
      );
      console.log("Change password response:", resChangePassword);

      if (resChangePassword.status === "success") {
        passwordForm.resetFields();
        showNotification("success", "Đổi mật khẩu thành công!");
        setTimeout(() => {
          // Đăng xuất người dùng
          localStorage.removeItem("access_token");
          localStorage.removeItem("role");
          navigate("/login");
        }, 1000);
      } else {
        showNotification(
          "error",
          resChangePassword.message || "Lỗi khi đổi mật khẩu"
        );
      }
    } catch (e) {
      console.error("Error in change password:", e);
      showNotification("error", "Lỗi khi đổi mật khẩu");
    }
  };

  return (
    <div className="profile-page">
      {/* Notification System */}
      {notification.visible && (
        <div
          className={`notification ${notification.type}`}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "16px 24px",
            borderRadius: "8px",
            color: "white",
            fontWeight: "bold",
            zIndex: 9999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            backgroundColor:
              notification.type === "success"
                ? "#52c41a"
                : notification.type === "error"
                  ? "#ff4d4f"
                  : "#1890ff",
          }}
        >
          {notification.message}
        </div>
      )}
      <div className="container">
        <h1>Hồ sơ của tôi</h1>

        {/* Notification System */}
        {notification.visible && (
          <div
            className={`notification ${notification.type}`}
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              padding: "16px 24px",
              borderRadius: "8px",
              color: "white",
              fontWeight: "bold",
              zIndex: 9999,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              backgroundColor:
                notification.type === "success"
                  ? "#52c41a"
                  : notification.type === "error"
                    ? "#ff4d4f"
                    : "#1890ff",
            }}
          >
            {notification.message}
          </div>
        )}

        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={[
            {
              key: "info",
              label: "Thông tin cá nhân",
              children: (
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onSaveProfile}
                  // onFinishFailed={onSaveProfileFailed}
                  validateTrigger="onBlur"
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 24,
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ minWidth: 200, textAlign: "center" }}>
                      <Avatar
                        size={120}
                        src={avatarUrl}
                        style={{ marginBottom: 12 }}
                      />
                      <Form.Item
                        // label="Ảnh đại diện"
                        style={{ marginBottom: 0 }}
                      >
                        <div>
                          <Upload
                            name="avatar"
                            showUploadList={false}
                            customRequest={customRequest}
                            onChange={handleAvatarChange}
                            className="avatar-uploader"
                          >
                            <Button icon={<UploadOutlined />} size="small">
                              Thay đổi ảnh
                            </Button>
                          </Upload>
                          {file && (
                            <div style={{ marginTop: "10px" }}>
                              <Button
                                type="primary"
                                onClick={handleSave}
                                loading={loading}
                                style={{ marginRight: "10px" }}
                              >
                                Lưu
                              </Button>
                              <Button onClick={handleCancel} disabled={loading}>
                                Hủy bỏ
                              </Button>
                            </div>
                          )}
                        </div>
                      </Form.Item>
                    </div>

                    <div style={{ flex: 1, minWidth: 280 }}>
                      <Form.Item
                        name="username"
                        label="Họ và tên"
                        rules={[
                          { required: true, message: "Vui lòng nhập họ tên" },
                        ]}
                      >
                        <Input placeholder="Nhập họ tên" />
                      </Form.Item>
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          { type: "email", message: "Email không hợp lệ" },
                        ]}
                      >
                        <Input placeholder="Nhập email" readOnly />
                      </Form.Item>
                      <Form.Item name="phone" label="Số điện thoại">
                        <Input placeholder="Nhập số điện thoại" />
                      </Form.Item>

                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="profile-save-btn"
                        >
                          Lưu thay đổi
                        </Button>
                      </Form.Item>
                    </div>
                  </div>
                </Form>
              ),
            },
            {
              key: "password",
              label: "Đổi mật khẩu",
              children: (
                <Form
                  form={passwordForm}
                  layout="vertical"
                  onFinish={onChangePassword}
                  style={{ maxWidth: 420 }}
                >
                  <Form.Item
                    name="currentPassword"
                    label="Mật khẩu hiện tại"
                    rules={[
                      { required: true, message: "Nhập mật khẩu hiện tại" },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item
                    name="newPassword"
                    label="Mật khẩu mới"
                    rules={[
                      { required: true, message: "Nhập mật khẩu mới" },
                      { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item
                    name="confirmPassword"
                    dependencies={["newPassword"]}
                    label="Xác nhận mật khẩu"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập lại mật khẩu!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            !value ||
                            getFieldValue("newPassword") === value
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Xác nhận mật khẩu không khớp!")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Đổi mật khẩu
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: "orders",
              label: "Đơn hàng của tôi",
              children: <OrdersTab />,
            },
            {
              key: "addresses",
              label: "Địa chỉ giao hàng",
              children: <AddressesTab />,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ProfilePage;