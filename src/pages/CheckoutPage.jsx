import React, { useState, useEffect, useContext, use } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Form,
  Radio,
  Select,
  Divider,
  Modal,
  Card,
  Space,
  Typography,
  Badge,
  Alert,
  Spin,
  Tooltip,
  Tag,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  TruckOutlined,
  CreditCardOutlined,
  QrcodeOutlined,
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
  ArrowRightOutlined,
  TagOutlined,
  RightOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  GiftOutlined,
  SafetyOutlined,
  BankOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import "../styles/CheckoutPage.css";
import { AuthContext } from "../components/context/auth.context";
import { getAddresses } from "../service/user.service";
import { placeOrderAPI } from "../service/order.service";
import { getProductByIdAPI } from "../service/product.service";
import { getPromotionByCodeAPI } from "../service/promotion.service";

const { Option } = Select;
const { Title, Text } = Typography;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];
  const [form] = Form.useForm();
  const { user } = useContext(AuthContext);

  console.log("Checkout cartItems:", cartItems);

  // State management
  const [cartNotes, setCartNotes] = useState("");
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [promotionCode, setPromotionCode] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [finalAmount, setFinalAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);

  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const [productsData, setProductsData] = useState({});
  const [notification, setNotification] = useState({
    type: "",
    message: "",
    visible: false,
  });

  const showNotification = (type, message) => {
    setNotification({ type, message, visible: true });
    setTimeout(() => {
      setNotification({ type: "", message: "", visible: false });
    }, 4000);
  };

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    if (user) {
      fetchAddresses();
      form.setFieldsValue({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        district: user.district || "",
      });
    }
    setIsCartLoaded(true);
  }, [user, form]);

  // Fetch product details for each cart item
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (cartItems.length > 0) {
        const productPromises = cartItems.map(async (item) => {
          try {
            const res = await getProductByIdAPI(item.productId || item.id);
            if (res && res.data && res.data.product) {
              return {
                productId: item.productId || item.id,
                productData: res.data.product,
              };
            }
          } catch (error) {
            console.error(
              `Error fetching product ${item.productId || item.id}:`,
              error
            );
          }
          return null;
        });

        const results = await Promise.all(productPromises);
        const productsMap = {};
        results.forEach((result) => {
          if (result) {
            productsMap[result.productId] = result.productData;
          }
        });
        setProductsData(productsMap);
      }
    };

    fetchProductDetails();
  }, [cartItems]);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await getAddresses();
      if (res && res.data) {
        setUserAddresses(res.data.addresses || []);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const productData = productsData[item.productId || item.id];
      if (productData) {
        const actualPrice =
          productData.discountPercentage > 0
            ? productData.priceAfterDiscount
            : productData.price;
        return total + actualPrice * item.quantity;
      }
      // Fallback to cart item price if product data not available
      return total + item.price * item.quantity;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = Number(calculateSubtotal()); // ép kiểu về số
    if (subtotal >= 300000) {
      setShippingFee(0);
    } else {
      setShippingFee(30000);
    }
    let total = subtotal + shippingFee;


    if (appliedDiscount) {
      const discount = (total * appliedDiscount.value) / 100;
      total = total - discount;
      setDiscountAmount(discount);
    }

    setFinalAmount(total);

  };


  useEffect(() => {
    calculateTotal();
  }, [appliedDiscount, shippingFee, cartItems]);

  const handlePlaceOrder = async (values) => {
    setOrderLoading(true);
    const products = cartItems.map((item) => ({
      productId: item.productId || item.id,
      quantity: item.quantity,
    }));
    try {
      const res = await placeOrderAPI(
        products,
        paymentMethod,
        values.address,
        values.phone,
        values.note || "",
        promotionCode.trim()
      );
      if (res && res.data) {
        if (res.data.vnpUrl) {
          window.location.href = res.data.vnpUrl;
          return;
        } else {
          showNotification("success", "Đặt hàng thành công!");
          //   navigate("/order-success?status=true"  + res.data.orderId);
          navigate(`/order-result?status=success&orderId=` + res.data.orderId);
        }
      } else {
        showNotification(
          "error",
          res.message || "Đặt hàng thất bại. Vui lòng thử lại."
        );
      }
    } catch (error) {
      showNotification("error", "Đặt hàng thất bại. Vui lòng thử lại.");
    } finally {
      setOrderLoading(false);
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setShowAddressSelector(false);
  };

  const handleApplyDiscount = async () => {
    if (!promotionCode.trim()) {
      showNotification("error", "Vui lòng nhập mã khuyến mãi!");
      return;
    }

    const res = await getPromotionByCodeAPI(promotionCode.trim());
    if (res && res.data) {

      if (res.data.promotion.status !== "ACTIVE") {
        showNotification("error", "Mã khuyến mãi không tồn tại hoặc đã hết hạn");
        return;
      }
      const promotion = res.data.promotion;
      setAppliedDiscount({
        value: promotion.discountPercent,
      });
    } else {
      showNotification("error", "Mã khuyến mãi không tồn tại");
      return;
    }
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    setPromotionCode("");
  };

  const paymentOptions = [
    {
      value: "COD",
      label: "Thanh toán khi nhận hàng",
      description: "Thanh toán bằng tiền mặt khi nhận hàng",
      icon: <WalletOutlined />,
      popular: true,
    },
    {
      value: "BANKING",
      label: "Chuyển khoản ngân hàng",
      description: "Chuyển khoản trực tiếp vào tài khoản",
      icon: <BankOutlined />,
    },
  ];

  if (!isCartLoaded) {
    return (
      <div className="checkout-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="checkout-page">
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
      <div className="checkout-container">
        {cartItems.length === 0 && (
          <Alert
            message="Giỏ hàng trống"
            description="Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán."
            type="warning"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        <div className="checkout-content">
          {/* Left Column - Forms */}
          <div className="checkout-left">
            {/* Shipping Information */}
            <Card
              title={
                <Space>
                  <EnvironmentOutlined />
                  <span>Thông tin giao hàng</span>
                </Space>
              }
              className="form-section"
            >
              <Form form={form} layout="vertical" onFinish={handlePlaceOrder}>
                <div className="form-row">
                  <Form.Item
                    name="username"
                    label="Họ và tên"
                    className="form-item"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ tên!" },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Nhập họ và tên"
                      className="form-input"
                      size="large"
                      readOnly
                    />
                  </Form.Item>
                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại!",
                      },
                      {
                        pattern: /^[0-9]{10,11}$/,
                        message: "Số điện thoại không hợp lệ!",
                      },
                    ]}
                    className="form-item"
                  >
                    <Input
                      prefix={<PhoneOutlined />}
                      placeholder="Nhập số điện thoại"
                      className="form-input"
                      size="large"
                    />
                  </Form.Item>
                </div>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ type: "email", message: "Email không hợp lệ!" }]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="Nhập email"
                    className="form-input"
                    size="large"
                    readOnly
                  />
                </Form.Item>

                <Form.Item label="Chọn địa chỉ đã lưu" name="address">
                  <Select
                    placeholder="Chọn địa chỉ đã lưu"
                    size="large"
                    loading={loading}
                    allowClear
                    onChange={(value, option) => {
                      if (value && option) {
                        const selectedAddr = userAddresses[option.key];
                        if (selectedAddr) {
                          handleSelectAddress(selectedAddr);
                        }
                      }
                    }}
                    notFoundContent={
                      loading ? <Spin size="small" /> : "Không có địa chỉ nào"
                    }
                    dropdownRender={(menu) => (
                      <div>
                        {menu}
                        <Divider style={{ margin: "8px 0" }} />
                        <Button
                          type="link"
                          icon={<PlusOutlined />}
                          onClick={() => navigate("/profile")}
                          style={{ width: "100%", textAlign: "left" }}
                        >
                          Thêm địa chỉ mới
                        </Button>
                      </div>
                    )}
                  >
                    {userAddresses && userAddresses.length > 0 ? (
                      userAddresses
                        .map((addr, index) => {
                          // Kiểm tra và làm sạch dữ liệu địa chỉ
                          const addressParts = [];
                          // Thêm các phần của địa chỉ nếu tồn tại và không rỗng
                          if (addr.note && addr.note.trim()) {
                            addressParts.push(addr.note.trim());
                          }
                          if (addr.street && addr.street.trim()) {
                            addressParts.push(addr.street.trim());
                          }
                          if (addr.ward && addr.ward.trim()) {
                            addressParts.push(addr.ward.trim());
                          }
                          if (addr.district && addr.district.trim()) {
                            addressParts.push(addr.district.trim());
                          }
                          if (addr.city && addr.city.trim()) {
                            addressParts.push(addr.city.trim());
                          }
                          if (addr.province && addr.province.trim()) {
                            addressParts.push(addr.province.trim());
                          }
                          const fullAddress = addressParts.join(", ");
                          if (fullAddress.length > 0) {
                            return (
                              <Option key={index} value={fullAddress}>
                                <div style={{ padding: "4px 0" }}>
                                  <Text
                                    type="secondary"
                                    style={{
                                      fontSize: "12px",
                                      lineHeight: 1.4,
                                    }}
                                  >
                                    {fullAddress}
                                  </Text>
                                </div>
                              </Option>
                            );
                          }
                          return null;
                        })
                        .filter(Boolean)
                    ) : (
                      <Option disabled value="">
                        <Text type="secondary">
                          Chưa có địa chỉ nào được lưu
                        </Text>
                      </Option>
                    )}
                  </Select>
                </Form.Item>

                <Form.Item name="note" label="Ghi chú">
                  <Input.TextArea
                    placeholder="Ghi chú cho đơn hàng (không bắt buộc)"
                    rows={3}
                    className="form-input"
                    value={cartNotes}
                    onChange={(e) => setCartNotes(e.target.value)}
                  />
                </Form.Item>
              </Form>
            </Card>

            {/* Payment Method */}
            <Card
              title={
                <Space>
                  <CreditCardOutlined />
                  <span>Phương thức thanh toán</span>
                </Space>
              }
              className="form-section"
              style={{ marginTop: 16 }}
            >
              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="payment-methods"
              >
                {paymentOptions.map((option) => (
                  <Radio
                    key={option.value}
                    value={option.value}
                    className="payment-option"
                  >
                    <div className="payment-option-content">
                      <div className="payment-icon">{option.icon}</div>
                      <div className="payment-details">
                        <div className="payment-name">
                          {option.label}
                          {option.popular && (
                            <Badge
                              count="Phổ biến"
                              style={{
                                backgroundColor: "#52c41a",
                                marginLeft: 8,
                              }}
                            />
                          )}
                        </div>
                        <div className="payment-description">
                          {option.description}
                        </div>
                      </div>
                      <CheckCircleOutlined className="payment-check" />
                    </div>
                  </Radio>
                ))}
              </Radio.Group>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="checkout-right">
            {/* Cart Items */}
            <Card
              title={
                <Space>
                  <ShoppingCartOutlined />
                  <span>Đơn hàng ({cartItems.length} sản phẩm)</span>
                </Space>
              }
              className="cart-section"
            >
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">
                      <img
                        src={item.productImage?.[0] || item.imageUrls?.[0]}
                        alt={item.productName}
                      />
                      <Badge count={item.quantity} className="quantity-badge" />
                    </div>
                    <div className="cart-item-details">
                      <Text strong className="cart-item-title">
                        {item.productName}
                      </Text>
                      <div className="cart-item-price-row">
                        <div>
                          {(() => {
                            const productData =
                              productsData[item.productId || item.id];
                            if (productData) {
                              return (
                                <>
                                  <Text className="cart-item-price">
                                    {productData.discountPercentage > 0
                                      ? formatPrice(
                                        productData.priceAfterDiscount
                                      )
                                      : formatPrice(productData.price)}
                                  </Text>
                                  {productData.discountPercentage > 0 && (
                                    <div>
                                      <Text
                                        type="secondary"
                                        style={{
                                          fontSize: 12,
                                          textDecoration: "line-through",
                                          color: "#999",
                                        }}
                                      >
                                        {formatPrice(productData.price)}
                                      </Text>
                                      <Tag
                                        color="red"
                                        size="small"
                                        style={{ marginLeft: 4 }}
                                      >
                                        -{productData.discountPercentage}%
                                      </Tag>
                                    </div>
                                  )}
                                </>
                              );
                            }
                            // Fallback to cart item data
                            return (
                              <>
                                <Text className="cart-item-price">
                                  {item.discountPercentage > 0
                                    ? formatPrice(item.priceAfterDiscount)
                                    : formatPrice(item.price)}
                                </Text>
                                {item.discountPercentage > 0 && (
                                  <div>
                                    <Text
                                      type="secondary"
                                      style={{
                                        fontSize: 12,
                                        textDecoration: "line-through",
                                        color: "#999",
                                      }}
                                    >
                                      {formatPrice(item.price)}
                                    </Text>
                                    <Tag
                                      color="red"
                                      size="small"
                                      style={{ marginLeft: 4 }}
                                    >
                                      -{item.discountPercentage}%
                                    </Tag>
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                        <Text type="secondary">x{item.quantity}</Text>
                      </div>
                    </div>
                    <div className="cart-item-total">
                      <Text strong>
                        {(() => {
                          const productData =
                            productsData[item.productId || item.id];
                          if (productData) {
                            const actualPrice =
                              productData.discountPercentage > 0
                                ? productData.priceAfterDiscount
                                : productData.price;
                            return formatPrice(actualPrice * item.quantity);
                          }
                          // Fallback to cart item data
                          const actualPrice =
                            item.discountPercentage > 0
                              ? item.priceAfterDiscount
                              : item.price;
                          return formatPrice(actualPrice * item.quantity);
                        })()}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Discount Section */}
            <Card
              title={
                <Space>
                  <GiftOutlined />
                  <span>Mã khuyến mãi</span>
                </Space>
              }
              className="discount-section"
              style={{ marginTop: 16 }}
            >
              {appliedDiscount ? (
                <div className="applied-discount">
                  <div className="discount-info">
                    <CheckCircleOutlined style={{ color: "#52c41a" }} />
                    <span>giảm giá {appliedDiscount.value} %</span>
                  </div>
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={removeDiscount}
                    danger
                  >
                    Bỏ
                  </Button>
                </div>
              ) : (
                <div className="discount-input">
                  <Input
                    placeholder="Nhập mã khuyến mãi"
                    value={promotionCode}
                    onChange={(e) =>
                      setPromotionCode(e.target.value.toUpperCase())
                    }
                    size="large"
                    prefix={<TagOutlined />}
                    suffix={
                      <Button
                        type="primary"
                        onClick={handleApplyDiscount}
                        size="small"
                      >
                        Áp dụng
                      </Button>
                    }
                  />
                  {/* <div className="discount-suggestions">
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Gợi ý: SAVE10, SAVE20, SAVE50, FREESHIP
                    </Text>
                  </div> */}
                </div>
              )}
            </Card>

            {/* Order Summary */}
            <Card
              title="Tóm tắt đơn hàng"
              className="order-summary-section"
              style={{ marginTop: 16 }}
            >
              <div className="order-summary">
                <div className="summary-row">
                  <Text>Tổng tiền hàng:</Text>
                  <Text strong>{formatPrice(calculateSubtotal())}</Text>
                </div>
                <div className="summary-row">
                  <Text>Phí vận chuyển:</Text>
                  <Text strong>
                    {shippingFee > 0 ? (
                      formatPrice(shippingFee)
                    ) : (
                      <span style={{ color: "#52c41a" }}>Miễn phí</span>
                    )}
                  </Text>
                </div>
                {appliedDiscount && (
                  <div className="summary-row">
                    <Text>Giảm giá:</Text>
                    <Text strong style={{ color: "#52c41a" }}>
                      -
                      {formatPrice(discountAmount)}
                    </Text>
                  </div>
                )}
                <Divider style={{ margin: "16px 0" }} />
                <div className="summary-row total-row">
                  <Title level={4} style={{ margin: 0 }}>
                    Tổng thanh toán:
                  </Title>
                  <Title level={4} style={{ margin: 0, color: "#ff4d4f" }}>
                    {/* {formatPrice(calculateTotal())} */}
                    {formatPrice(finalAmount)}
                  </Title>
                </div>
              </div>

              <Button
                type="primary"
                size="large"
                onClick={() => form.submit()}
                className="place-order-btn"
                icon={<ArrowRightOutlined />}
                loading={orderLoading}
                block
                disabled={cartItems.length === 0}
              >
                {orderLoading ? "Đang xử lý..." : "Đặt hàng ngay"}
              </Button>

              <div className="security-info">
                <Space>
                  <SafetyOutlined style={{ color: "#52c41a" }} />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Thông tin của bạn được bảo mật tuyệt đối
                  </Text>
                </Space>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
