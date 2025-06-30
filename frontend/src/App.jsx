import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContect";
import ProtectedRoute from "./components/ProtectRoute";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Unauthorized from "./pages/Unauthorized";
import CartPage from "./pages/pages/CartPage"
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CheckoutPage from "./pages/CheckoutPage";
import OrderHistoryPage from "./components/OrderHistoryPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import UserOrderHistory from "./pages/UserOrderHistory";
import HeaderAdmin from "./layouts/headeradmin";
import HeaderUser from "./layouts/headeruser";
import FrontPage from "./pages/FrontPage";
import HeaderFrontPage from "./layouts/headerfrontPage";
//import Chat from "./pages/chat";
import VerifyOTP from "./pages/VerifyOTP";
import SellerDashboard from "./pages/SellerDashboard";
import AffiliateDashboard from "./pages/AffiliateDashboard";
import PublicProductMerged from "./pages/PublicProductMerged";
import SellerProfile from "./pages/SellerProfile";
import HeaderSeller from "./pages/seller/HeaderSeller";
import HeaderAffiliate from "./pages/affiliate/HeaderAffiliate";
import AffiliateProfile from "./pages/affiliate/AffiliateProfile";
import AffiliateShowcase from "./pages/affiliate/AffiliateShowcase";
import SellerProfileMain from "./pages/seller/SellerProfilemain";
import SellerOrders from "./pages/seller/SellerOrders";
import AffiliateOrders from "./pages/affiliate/AffiliateOrders";
import AffiliateProducts from "./pages/affiliate/AffiliateProducts";
import AffiliateWithdrawable from "./pages/affiliate/AffiliateWithdrawable";






const App = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      localStorage.setItem("referralBy", ref);
    }
  }, []);

  return (
  <AuthProvider>

  <BrowserRouter>
    <Routes>
      <Route path="/" element={<FrontPage/>} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Unauthorized />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
         </ProtectedRoute>
        }
      />
      <Route
        path="/user"
        element={
          <ProtectedRoute role="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
  path="/seller"
  element={
    <ProtectedRoute role="seller">
      <SellerDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/affiliate"
  element={
    <ProtectedRoute role="affiliate">
      <AffiliateDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/affiliate/orders"
  element={
    <ProtectedRoute role="affiliate">
      <AffiliateOrders />
    </ProtectedRoute>
  }
/>

      <Route path="/cart" element={<CartPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/orders" element={<OrderHistoryPage />} />
      <Route path="/admin/orders" element={<AdminOrdersPage />} />
      <Route path="/user/orders" element={<UserOrderHistory />} />
      <Route path="/admin/header" element={<HeaderAdmin />}/>
      <Route path="/user/header" element={<HeaderUser/>} />
      <Route path="/seller/header" element={<HeaderSeller />} />
      <Route path="/affiliate/header" element={<HeaderAffiliate />} />
      <Route path="headerfrontpage" element={<HeaderFrontPage />} />
     {/* <Route path="/chat" element={<Chat />} /> */}
     
     
    <Route path="/verify-otp" element={<VerifyOTP />} /> 
    <Route path="/product/public/:id" element={<PublicProductMerged />} />
    <Route path="/seller/:id" element={<SellerProfile />} />
    <Route path="/profile" element={<AffiliateProfile />} />
    <Route path="/affiliate/showcase" element={<AffiliateShowcase />} />
    <Route path="/seller/profile" element={<SellerProfileMain />} />
    <Route path="/seller/orders" element={<SellerOrders />} />
    <Route path="/affiliateproduct" element={<AffiliateProducts />} />
    <Route path="/affiliate/withdraw" element={<AffiliateWithdrawable />} />

    

    </Routes>
  </BrowserRouter>
</AuthProvider>

)
};

export default App;
