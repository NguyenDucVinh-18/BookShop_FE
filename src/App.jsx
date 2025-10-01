import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DetailPage from "./pages/DetailPage";
import RecentlyViewedPage from "./pages/RecentlyViewedPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import AllProductsPage from "./pages/AllProductsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import "./App.css";
import OrderLookupPage from "./pages/OrderLookupPage";
import CategoryPage from "./pages/CategoryPage";
import ProfilePage from "./pages/ProfilePage";
import BlogPostPage from "./pages/BlogPostPage";
import BlogTatCaPage from "./pages/BlogTatCaPage";
import SalePage from "./pages/SalePage";
import ManagePage from "./pages/ManagePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import { AuthContext } from "./components/context/auth.context";
import { getAccountAPI } from "./service/auth.service";
import { useContext, useEffect } from "react";
import EmailVerificationPage from "./pages/verify/EmailVerificationPage";
import VerifySuccess from "./pages/verify/VerifySuccess";
import VerifyFailed from "./pages/verify/VerifyFailed";
import OrderResultPage from "./pages/OrderResultPage";


function App() {
  const { fetchUserInfor, fetchCartInfor  } = useContext(AuthContext);
  useEffect(() => {
    fetchCartInfor();
    fetchUserInfor();   
  }, []);

  return (
    <Router>
      <Routes>
        {/* Admin Routes - Không có Header/Footer */}
        <Route path="/sale" element={<SalePage />} />
        <Route path="/manager" element={<ManagePage />} />

         {/* Auth Routes - Không có Header/Footer */}
         <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/email-verification" element={<EmailVerificationPage />} />
        <Route path="/verify-success" element={<VerifySuccess />} />
        <Route path="/verify-failed" element={<VerifyFailed />} />


        {/* Public Routes - Có Header/Footer */}
        <Route path="/*" element={
          <>
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<DetailPage />} />
              <Route path="/recently-viewed" element={<RecentlyViewedPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/productCategory/:parentSlug/:slug?" element={<AllProductsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-lookup" element={<OrderLookupPage />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/blogs/:category/:slug" element={<BlogPostPage />} />
              <Route path="/category/blog-tat-ca" element={<BlogTatCaPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/order-result" element={<OrderResultPage />} />
            </Routes>
            <Footer />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
