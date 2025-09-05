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
import { useNavigate } from "react-router-dom";
import { cancelOrderAPI, getAllOrderAPI } from "../service/order.service";
import axios from "axios";

const { Text, Title } = Typography;
const PROFILE_KEY = "userProfile";

// Hàm helper để lấy icon trạng thái đơn hàng
const getStatusIcon = (status) => {
  switch (status) {
    case "UNPAID":
      return <WarningOutlined style={{ color: "#fa541c" }} />;
    case "PENDING":
      return <ClockCircleOutlined style={{ color: "#faad14" }} />;
    case "processing":
      return <ShoppingCartOutlined style={{ color: "#1890ff" }} />;
    case "SHIPPING":
      return <CarOutlined style={{ color: "#722ed1" }} />;
    case "DELIVERED":
      return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
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
      return "orange";
    case "PENDING":
      return "warning";
    case "processing":
      return "processing";
    case "SHIPPING":
      return "purple";
    case "DELIVERED":
      return "success";
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
          <Text strong>Mã đơn hàng: {order.id}</Text>
          <br />
          Ngày đặt: {new Date(order?.createdAt).toLocaleString("vi-VN")}
        </div>
        <div style={{ textAlign: "right" }}>
          <Tag
            color={getStatusColor(order.status)}
            icon={getStatusIcon(order.status)}
          >
            {order.status}
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
      const ordersData = await getAllOrderAPI();
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
      label: "Đang xử lý",
      count: orders.filter((o) => o.status === "PENDING").length,
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
  ];

  const filteredOrders =
    selectedStatus === "all"
      ? orders
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
        title={
          <div style={{ textAlign: "center" }}>
            <h3 style={{ margin: 0, color: "#1890ff", fontSize: "20px" }}>
              📋 Chi tiết đơn hàng #{selectedOrder?.id}
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
          <div style={{ maxHeight: "70vh", overflowY: "auto", padding: "8px" }}>
            {/* Header đơn hàng */}
            <div
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                padding: "24px",
                borderRadius: "12px",
                marginBottom: "24px",
                color: "white",
              }}
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
                    📅{" "}
                    {new Date(selectedOrder.createdAt).toLocaleDateString(
                      "vi-VN"
                    )}{" "}
                    • 🕐{" "}
                    {new Date(selectedOrder.createdAt).toLocaleTimeString(
                      "vi-VN"
                    )}
                  </div>
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
                    {selectedOrder.status}
                  </Tag>
                  <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                    {selectedOrder.totalAmount.toLocaleString("vi-VN")} ₫
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px",
                marginBottom: "24px",
              }}
            >
              {/* Thông tin khách hàng */}
              <div
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
                                handleChangePaymentMethod(selectedOrder.id)
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
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div style={{ marginBottom: "24px" }}>
              <h4
                style={{
                  color: "#1890ff",
                  marginBottom: "16px",
                  fontSize: "16px",
                }}
              >
                🛍️ Sản phẩm đã đặt ({selectedOrder.orderItems.length} sản phẩm)
              </h4>
              <div
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
                          {(item.price * item.quantity).toLocaleString("vi-VN")}{" "}
                          ₫
                        </Text>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tóm tắt đơn hàng */}
            <div
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                padding: "24px",
                borderRadius: "12px",
                color: "white",
                textAlign: "center",
              }}
            >
              <h4
                style={{
                  color: "white",
                  marginBottom: "16px",
                  fontSize: "18px",
                }}
              >
                💰 Tổng thanh toán
              </h4>
              <div style={{ fontSize: "32px", fontWeight: "bold" }}>
                {selectedOrder.totalAmount.toLocaleString("vi-VN")} ₫
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
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddAddress}
          style={{ marginBottom: 16 }}
        >
          Thêm địa chỉ mới
        </Button>
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
  const [notification, setNotification] = useState({
    type: "",
    message: "",
    visible: false,
  });
  const [activeTab, setActiveTab] = useState("info");


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

  // Function để xử lý khi người dùng chuyển tab
  const handleTabChange = (activeKey) => {
    setActiveTab(activeKey);
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
      if(resUpdateAvatar.status === "success") {
        // setUser(resUpdateAvatar.data.user); 
        setAvatarUrl(resUpdateAvatar.data.user.avatarUrl); 
        showNotification("success", "Cập nhật ảnh đại diện thành công!");
        setFile(null);
        await fetchUserInfor();
      } else {
        showNotification("error", resUpdateAvatar.message || "Lỗi khi cập nhật ảnh đại diện!");
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
