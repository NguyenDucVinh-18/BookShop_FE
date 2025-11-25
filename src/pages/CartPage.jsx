import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  CreditCardOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Card,
  Row,
  Col,
  Button,
  InputNumber,
  Checkbox,
  Typography,
  Image,
  Divider,
  Space,
  Empty,
  notification,
  Spin,
  Badge,
  Table,
  Popconfirm,
  Tag,
} from "antd";
import "../styles/CartPage.css";
import { AuthContext } from "../components/context/auth.context";
import { removeProductFromCartAPI } from "../service/cart.service";
import { getProductByIdAPI } from "../service/product.service";

const { Title, Text } = Typography;

const CartPage = () => {
  const navigate = useNavigate();
  const { user, setUser, fetchCartInfor } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartItemToCheckout, setCartItemToCheckout] = useState([]);
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

  useEffect(() => {
    setCartItems(user.cartDetails || []);
  }, [user]);

  // Tự động cập nhật cartItemToCheckout khi cartItems hoặc selectedItems thay đổi
  useEffect(() => {
    if (selectedItems.length > 0 && cartItems.length > 0) {
      updateCartItemToCheckout(selectedItems);
    }
  }, [cartItems, selectedItems, productsData]);

  // Fetch product details for each cart item
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (cartItems.length > 0) {
        const productPromises = cartItems.map(async (item) => {
          try {
            const res = await getProductByIdAPI(item.productId);
            if (res && res.data && res.data.product) {
              return {
                productId: item.productId,
                productData: res.data.product
              };
            }
          } catch (error) {
            console.error(`Error fetching product ${item.productId}:`, error);
          }
          return null;
        });

        const results = await Promise.all(productPromises);
        const productsMap = {};
        results.forEach(result => {
          if (result) {
            productsMap[result.productId] = result.productData;
          }
        });
        setProductsData(productsMap);
      }
    };

    fetchProductDetails();
  }, [cartItems]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleRemoveFromCart = async (productId) => {
    setLoading(true);
    try {
      const res = await removeProductFromCartAPI(productId);
      if (res && res.data) {
        showNotification("success", "Xóa sản phẩm khỏi giỏ hàng thành công");
        fetchCartInfor();
        setSelectedItems((prev) => prev.filter((id) => id !== productId));
      } else {
        showNotification("error", "Xóa sản phẩm khỏi giỏ hàng thất bại");
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
      showNotification("error", "Xóa sản phẩm khỏi giỏ hàng thất bại");
    } finally {
      setLoading(false);
    }
  };


  const handleSelectItem = (productId, checked) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, productId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== productId));
    }
  };

  const updateCartItemToCheckout = (selectedIds, itemsToUse = null) => {
    const items = itemsToUse || cartItems;
    const selectedCartItems = items
      .filter((item) => selectedIds.includes(item.id))
      .map((item) => {
        const productData = productsData[item.productId];
        if (productData) {
          return {
            ...item,
            price: productData.discountPercentage > 0
              ? productData.priceAfterDiscount
              : productData.price,
            discountPercentage: productData.discountPercentage,
            priceAfterDiscount: productData.priceAfterDiscount
          };
        }
        return item;
      });
    setCartItemToCheckout(selectedCartItems);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = cartItems.map((item) => item.id);
      setSelectedItems(allIds);
    } else {
      setSelectedItems([]);
    }
  };

  const calculateSelectedTotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => {
        const productData = productsData[item.productId];
        if (productData) {
          const actualPrice = productData.discountPercentage > 0
            ? productData.priceAfterDiscount
            : productData.price;
          return total + actualPrice * item.quantity;
        }
        // Fallback to cart item price if product data not available
        return total + item.price * item.quantity;
      }, 0);
  };

  const calculateTotalQuantity = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.quantity, 0);
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      showNotification("error", "Vui lòng chọn sản phẩm để thanh toán");
      return;
    }
    navigate("/checkout", { state: { cartItems: cartItemToCheckout } });
  };

  const columns = [
    {
      title: (
        <Checkbox
          checked={
            selectedItems.length === cartItems.length && cartItems.length > 0
          }
          indeterminate={
            selectedItems.length > 0 && selectedItems.length < cartItems.length
          }
          onChange={(e) => handleSelectAll(e.target.checked)}
        >
          Chọn tất cả ({cartItems.length})
        </Checkbox>
      ),
      dataIndex: "select",
      key: "select",
      width: 150,
      render: (_, record) => (
        <Checkbox
          checked={selectedItems.includes(record.id)}
          onChange={(e) => handleSelectItem(record.id, e.target.checked)}
        />
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "product",
      key: "product",
      width: 300,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Image
            src={record.productImage[0]}
            alt={record.productName}
            width={80}
            height={80}
            style={{
              objectFit: "cover",
              borderRadius: 8,
              border: "1px solid #f0f0f0",
            }}
          />
          <div>
            <Text
              strong
              style={{
                fontSize: 14,
                display: "block",
                marginBottom: 4,
                cursor: "pointer",
              }}
              onClick={() => navigate(`/product/${record.productId}`)}
            >
              {record.productName}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      width: 130,
      align: "center",
      render: (price, record) => {
        const productData = productsData[record.productId];
        if (productData) {
          return (
            <div>
              <Text strong style={{ color: "#ff4d4f", fontSize: 14 }}>
                {productData.discountPercentage > 0
                  ? formatPrice(productData.priceAfterDiscount)
                  : formatPrice(productData.price)
                }
              </Text>
              {productData.discountPercentage > 0 && (
                <div>
                  <Text
                    type="secondary"
                    style={{
                      fontSize: 12,
                      textDecoration: "line-through",
                      color: "#999"
                    }}
                  >
                    {formatPrice(productData.price)}
                  </Text>
                  <Tag color="red" size="small" style={{ marginLeft: 4 }}>
                    -{productData.discountPercentage}%
                  </Tag>
                </div>
              )}
            </div>
          );
        }
        // Fallback to cart item price if product data not available
        return (
          <Text strong style={{ color: "#ff4d4f", fontSize: 14 }}>
            {formatPrice(price)}
          </Text>
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 150,
      align: "center",
      render: (quantity, record) => (
        <Space>
          <Button
            size="small"
            icon={<MinusOutlined />}
            onClick={() => handleUpdateQuantity(record.id, quantity - 1)}
            disabled={quantity <= 1}
          />
          <InputNumber
            size="small"
            min={1}
            value={quantity}
            onChange={(value) => handleUpdateQuantity(record.id, value)}
            style={{ width: 60, textAlign: "center" }}
            controls={false}
          />
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() => handleUpdateQuantity(record.id, quantity + 1)}
          />
        </Space>
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      key: "total",
      width: 130,
      align: "center",
      render: (_, record) => {
        const productData = productsData[record.productId];
        if (productData) {
          const actualPrice = productData.discountPercentage > 0
            ? productData.priceAfterDiscount
            : productData.price;
          return (
            <Text strong style={{ color: "#1890ff", fontSize: 14 }}>
              {formatPrice(actualPrice * record.quantity)}
            </Text>
          );
        }
        // Fallback to cart item price if product data not available
        return (
          <Text strong style={{ color: "#1890ff", fontSize: 14 }}>
            {formatPrice(record.price * record.quantity)}
          </Text>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Popconfirm
          title="Xóa sản phẩm"
          description="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
          onConfirm={() => handleRemoveFromCart(record.productId)}
          okText="Xóa"
          cancelText="Hủy"
          okType="danger"
        >
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            type="text"
            style={{ color: "#ff4d4f" }}
          />
        </Popconfirm>
      ),
    },
  ];

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: "40px 24px", minHeight: "60vh" }}>
        <Card style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <Empty
            image={
              <ShoppingCartOutlined
                style={{ fontSize: 80, color: "#d9d9d9" }}
              />
            }
            imageStyle={{ height: 120 }}
            description={
              <div>
                <Title level={3} style={{ color: "#8c8c8c", marginBottom: 8 }}>
                  Giỏ hàng trống
                </Title>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  Bạn chưa có sản phẩm nào trong giỏ hàng
                </Text>
              </div>
            }
          >
            <Button
              type="primary"
              size="large"
              icon={<ShoppingOutlined />}
              onClick={handleContinueShopping}
              style={{ marginTop: 16 }}
            >
              Tiếp tục mua sắm
            </Button>
          </Empty>
        </Card>
      </div>
    );
  }

  return (
    <Spin spinning={loading}>
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
      <div
        style={{
          padding: "24px",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Header */}
          <Card style={{ marginBottom: 24, borderRadius: 8 }}>
            <Row align="middle" justify="space-between">
              <Col>
                <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
                  <ShoppingCartOutlined style={{ marginRight: 8 }} />
                  Giỏ Hàng
                  <Badge
                    count={cartItems.length}
                    style={{ marginLeft: 8 }}
                    showZero
                  />
                </Title>
              </Col>
              <Col>
                <Button
                  icon={<ShoppingOutlined />}
                  onClick={handleContinueShopping}
                  style={{ marginRight: 8 }}
                >
                  Tiếp tục mua sắm
                </Button>
              </Col>
            </Row>
          </Card>

          {/* Cart Table - Desktop */}
          <Card 
            className="cart-table-desktop"
            style={{ marginBottom: 24, borderRadius: 8 }}
          >
            <Table
              dataSource={cartItems}
              columns={columns}
              rowKey="id"
              pagination={false}
              scroll={{ x: 'max-content' }}
              size="middle"
              style={{ marginBottom: 0 }}
            />
          </Card>

          {/* Cart Items - Mobile */}
          <Card 
            className="cart-items-mobile"
            style={{ marginBottom: 24, borderRadius: 8 }}
          >
            <div style={{ marginBottom: 16 }}>
              <Checkbox
                checked={
                  selectedItems.length === cartItems.length && cartItems.length > 0
                }
                indeterminate={
                  selectedItems.length > 0 && selectedItems.length < cartItems.length
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
                style={{ fontSize: 14, fontWeight: 500 }}
              >
                Chọn tất cả ({cartItems.length})
              </Checkbox>
            </div>
            <Divider style={{ margin: "12px 0" }} />
            {cartItems.map((item) => {
              const productData = productsData[item.productId];
              const actualPrice = productData
                ? (productData.discountPercentage > 0
                    ? productData.priceAfterDiscount
                    : productData.price)
                : item.price;
              const totalPrice = actualPrice * item.quantity;

              return (
                <div key={item.id} className="cart-item-mobile">
                  <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                    />
                    <Image
                      src={item.productImage[0]}
                      alt={item.productName}
                      width={80}
                      height={80}
                      style={{
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #f0f0f0",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Text
                        strong
                        style={{
                          fontSize: 14,
                          display: "block",
                          marginBottom: 4,
                          cursor: "pointer",
                          lineHeight: 1.4,
                        }}
                        onClick={() => navigate(`/product/${item.productId}`)}
                      >
                        {item.productName}
                      </Text>
                      <div style={{ marginTop: 8 }}>
                        <Text strong style={{ color: "#ff4d4f", fontSize: 14 }}>
                          {productData
                            ? (productData.discountPercentage > 0
                                ? formatPrice(productData.priceAfterDiscount)
                                : formatPrice(productData.price))
                            : formatPrice(item.price)}
                        </Text>
                        {productData && productData.discountPercentage > 0 && (
                          <div style={{ marginTop: 4 }}>
                            <Text
                              type="secondary"
                              style={{
                                fontSize: 11,
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
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 12,
                    }}
                  >
                    <Space>
                      <Button
                        size="small"
                        icon={<MinusOutlined />}
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      />
                      <InputNumber
                        size="small"
                        min={1}
                        value={item.quantity}
                        onChange={(value) => handleUpdateQuantity(item.id, value)}
                        style={{ width: 60, textAlign: "center" }}
                        controls={false}
                      />
                      <Button
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      />
                    </Space>

                    <div style={{ textAlign: "right" }}>
                      <Text
                        type="secondary"
                        style={{ fontSize: 12, display: "block" }}
                      >
                        Thành tiền:
                      </Text>
                      <Text strong style={{ color: "#1890ff", fontSize: 16 }}>
                        {formatPrice(totalPrice)}
                      </Text>
                    </div>
                  </div>

                  <div style={{ marginTop: 12, textAlign: "right" }}>
                    <Popconfirm
                      title="Xóa sản phẩm"
                      description="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
                      onConfirm={() => handleRemoveFromCart(item.productId)}
                      okText="Xóa"
                      cancelText="Hủy"
                      okType="danger"
                    >
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        type="text"
                        style={{ color: "#ff4d4f" }}
                      >
                        Xóa
                      </Button>
                    </Popconfirm>
                  </div>

                  {cartItems.indexOf(item) < cartItems.length - 1 && (
                    <Divider style={{ margin: "16px 0" }} />
                  )}
                </div>
              );
            })}
          </Card>

          {/* Summary */}
          <Row gutter={24}>
            <Col xs={24} lg={16}>
              <Card title="Thông tin đơn hàng" style={{ borderRadius: 8 }}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Text>Tổng số sản phẩm đã chọn:</Text>
                  </Col>
                  <Col span={12} style={{ textAlign: "right" }}>
                    <Text strong>{calculateTotalQuantity()} sản phẩm</Text>
                  </Col>
                  <Col span={24}>
                    <Divider style={{ margin: "12px 0" }} />
                  </Col>
                  <Col span={12}>
                    <Text>Tạm tính:</Text>
                  </Col>
                  <Col span={12} style={{ textAlign: "right" }}>
                    <Text strong style={{ fontSize: 16, color: "#1890ff" }}>
                      {formatPrice(calculateSelectedTotal())}
                    </Text>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card
                title="Thanh toán"
                style={{
                  borderRadius: 8,
                  border:
                    selectedItems.length > 0 ? "2px solid #1890ff" : undefined,
                }}
              >
                <div style={{ marginBottom: 16 }}>
                  <Row justify="space-between" style={{ marginBottom: 8 }}>
                    <Text>Tổng tiền:</Text>
                    <Title level={4} style={{ margin: 0, color: "#ff4d4f" }}>
                      {formatPrice(calculateSelectedTotal())}
                    </Title>
                  </Row>

                  {selectedItems.length > 0 && (
                    <Tag color="blue" style={{ marginBottom: 12 }}>
                      Đã chọn {selectedItems.length}/{cartItems.length} sản phẩm
                    </Tag>
                  )}
                </div>

                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<CreditCardOutlined />}
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0}
                  style={{
                    height: 48,
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  THANH TOÁN ({selectedItems.length})
                </Button>

                <Text
                  type="secondary"
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginTop: 8,
                    fontSize: 12,
                  }}
                >
                  {selectedItems.length === 0
                    ? "Vui lòng chọn sản phẩm để thanh toán"
                    : "Chỉ thanh toán các sản phẩm đã chọn"}
                </Text>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </Spin>
  );
};

export default CartPage;