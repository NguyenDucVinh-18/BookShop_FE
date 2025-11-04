import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "./components/context/auth.context";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import NotFoundPage from "./components/common/error";

// === PAGES ===
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import EmailVerificationPage from "./pages/verify/EmailVerificationPage";
import VerifySuccess from "./pages/verify/VerifySuccess";
import VerifyFailed from "./pages/verify/VerifyFailed";
import SalePage from "./pages/SalePage";
import ManagePage from "./pages/ManagePage";
import LoginEmployeePage from "./pages/employee/LoginEmployeePage";
import DetailPage from "./pages/DetailPage";
import RecentlyViewedPage from "./pages/RecentlyViewedPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import AllProductsPage from "./pages/AllProductsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderLookupPage from "./pages/OrderLookupPage";
import CategoryPage from "./pages/CategoryPage";
import ProfilePage from "./pages/ProfilePage";
import BlogPostPage from "./pages/BlogPostPage";
import BlogTatCaPage from "./pages/BlogTatCaPage";
import OrderResultPage from "./pages/OrderResultPage";
import AddressPage from "./pages/AddressPage";
import AboutPage from "./pages/AboutPage";
import BookReviewsPage from "./pages/BookReviewsPage";
import CareersPage from "./pages/CareersPage";
import EventsPage from "./pages/EventsPage";
import PromotionsPage from "./pages/PromotionsPage";
import TermsOfUsePage from "./pages/TermsOfUsePage";
import ShoppingGuidePage from "./pages/ShoppingGuidePage";
import ReturnPolicyPage from "./pages/ReturnPolicyPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import ContactPage from "./pages/ContactPage";
import PaymentMethodsPage from "./pages/PaymentMethodsPage";
import ShippingMethodsPage from "./pages/ShippingMethodsPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import ReturnOrderList from "./components/admin/ReturnOrderList";

function App() {
  const { fetchUserInfor, fetchCartInfor } = useContext(AuthContext);

  useEffect(() => {
    fetchCartInfor();
    fetchUserInfor();
  }, []);

  return (
    <Router>
      <Routes>
        {/* ========== ROUTES KHÔNG CÓ HEADER/FOOTER ========== */}
        <Route
          path="/sale"
          element={<ProtectedRoute element={<SalePage />} roles={["STAFF"]} />}
        />
        <Route
          path="/sale/dashboard"
          element={<ProtectedRoute element={<SalePage />} roles={["STAFF"]} />}
        />
        <Route
          path="/sale/orders"
          element={<ProtectedRoute element={<SalePage />} roles={["STAFF"]} />}
        />
        <Route
          path="/sale/return-requests"
          element={
            <ProtectedRoute element={<SalePage />} roles={["STAFF"]} />
          }
        />
        <Route
          path="/sale/products"
          element={<ProtectedRoute element={<SalePage />} roles={["STAFF"]} />}
        />
        <Route
          path="/sale/categories"
          element={<ProtectedRoute element={<SalePage />} roles={["STAFF"]} />}
        />
        <Route
          path="/sale/customers"
          element={<ProtectedRoute element={<SalePage />} roles={["STAFF"]} />}
        />
        <Route
          path="/sale/notifications"
          element={<ProtectedRoute element={<SalePage />} roles={["STAFF"]} />}
        />
        <Route
          path="/sale/customer-care"
          element={<ProtectedRoute element={<SalePage />} roles={["STAFF"]} />}
        />
        <Route
          path="/sale/product-quantity"
          element={<ProtectedRoute element={<SalePage />} roles={["STAFF"]} />}
        />
        <Route
          path="/sale/create-import-export"
          element={<ProtectedRoute element={<SalePage />} roles={["STAFF"]} />}
        />
        <Route
          path="/sale/import-export-list"
          element={<ProtectedRoute element={<SalePage />} roles={["STAFF"]} />}
        />
        <Route
          path="/sale/create-inventory-count"
          element={<ProtectedRoute element={<SalePage />} roles={["STAFF"]} />}
        />
        <Route
          path="/sale/inventory-count-list"
          element={<ProtectedRoute element={<SalePage />} roles={["STAFF"]} />}
        />
        <Route
          path="/manager"
          element={
            <ProtectedRoute element={<ManagePage />} roles={["MANAGER"]} />
          }
        />
        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute element={<ManagePage />} roles={["MANAGER"]} />
          }
        />
        <Route
          path="/manager/orders"
          element={
            <ProtectedRoute element={<ManagePage />} roles={["MANAGER"]} />
          }
        />
        <Route
          path="/manager/return-requests"
          element={
            <ProtectedRoute element={<ManagePage />} roles={["MANAGER"]} />
          }
        />
        <Route
          path="/manager/products"
          element={
            <ProtectedRoute element={<ManagePage />} roles={["MANAGER"]} />
          }
        />
        <Route
          path="/manager/categories"
          element={
            <ProtectedRoute element={<ManagePage />} roles={["MANAGER"]} />
          }
        />
        <Route
          path="/manager/customers"
          element={
            <ProtectedRoute element={<ManagePage />} roles={["MANAGER"]} />
          }
        />
        <Route
          path="/manager/employees"
          element={
            <ProtectedRoute element={<ManagePage />} roles={["MANAGER"]} />
          }
        />
        <Route
          path="/manager/notifications"
          element={
            <ProtectedRoute element={<ManagePage />} roles={["MANAGER"]} />
          }
        />
        <Route
          path="/manager/customer-care"
          element={<ProtectedRoute element={<ManagePage />} roles={["MANAGER"]} />}
        />
        <Route
          path="/manager/promotions"
          element={
            <ProtectedRoute element={<ManagePage />} roles={["MANAGER"]} />
          }
        />
        <Route
          path="/manager/product-quantity"
          element={
            <ProtectedRoute element={<ManagePage />} roles={["MANAGER"]} />
          }
        />
        <Route
          path="/manager/create-import-export"
          element={
            <ProtectedRoute element={<ManagePage />} roles={["MANAGER"]} />
          }
        />
        <Route
          path="/manager/import-export-list"
          element={
            <ProtectedRoute element={<ManagePage />} roles={["MANAGER"]} />
          }
        />
        <Route
          path="/manager/create-inventory-count"
          element={
            <ProtectedRoute element={<ManagePage />} roles={["MANAGER"]} />
          }
        />
        <Route
          path="/manager/inventory-count-list"
          element={
            <ProtectedRoute element={<ManagePage />} roles={["MANAGER"]} />
          }
        />
        <Route path="/employee/login" element={<LoginEmployeePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/email-verification" element={<EmailVerificationPage />} />
        <Route path="/verify-success" element={<VerifySuccess />} />
        <Route path="/verify-failed" element={<VerifyFailed />} />
        <Route path="*" element={<NotFoundPage />} />

        {/* ========== PUBLIC ROUTES (CÓ HEADER/FOOTER) ========== */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<DetailPage />} />
          <Route path="/recently-viewed" element={<RecentlyViewedPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route
            path="/productCategory/:parentSlug/:slug?"
            element={<AllProductsPage />}
          />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-lookup" element={<OrderLookupPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/blogs/:category/:slug" element={<BlogPostPage />} />
          <Route path="/category/blog-tat-ca" element={<BlogTatCaPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/book-reviews" element={<BookReviewsPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/promotions" element={<PromotionsPage />} />
          <Route
            path="/profile/:tab?"
            element={<ProtectedRoute element={<ProfilePage />} />}
          />
          <Route path="/order-result" element={<OrderResultPage />} />
          <Route path="/address" element={<AddressPage />} />
          <Route path="/terms-of-use" element={<TermsOfUsePage />} />
          <Route path="/shopping-guide" element={<ShoppingGuidePage />} />
          <Route path="/return-policy" element={<ReturnPolicyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/payment-methods" element={<PaymentMethodsPage />} />
          <Route path="/shipping-methods" element={<ShippingMethodsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

/* 🧩 Layout có Header + Footer */
function PublicLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
