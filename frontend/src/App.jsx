import { useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
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
import SellerDashboard from "./pages/seller/SellerDashboard";
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
import ShippingSlip from "./components/shipment/ShippingSlip";
import PrintShipment from "./pages/seller/PrintShipment";
import PDFShipment from "./pages/seller/PDFShipment";
import AdminStrats from "./pages/admin/AdminStrats"
import AllUsers from "./pages/admin/AllUsers"






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

  <HashRouter>
    <Routes>
      <Route path="/" element={<FrontPage/>} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Unauthorized />} />
      <Route
        path="/admin/stats"
        element={
          <ProtectedRoute role="admin">
            <AdminStrats />
            
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
     
     
    <Route path="/product/public/:id" element={<PublicProductMerged />} />
    <Route path="/seller/:id" element={<SellerProfile />} />
    <Route path="/profile" element={<AffiliateProfile />} />
    <Route path="/affiliate/showcase" element={<AffiliateShowcase />} />
    <Route path="/seller/profile" element={<SellerProfileMain />} />
    <Route path="/seller/orders" element={<SellerOrders />} />
    <Route path="/affiliateproduct" element={<AffiliateProducts />} />
    <Route path="/affiliate/withdraw" element={<AffiliateWithdrawable />} />
    <Route path="/seller/shippingslip" element ={<ShippingSlip />} />
    <Route path="/seller/order/:orderId/:itemId/print" element={<PrintShipment />} />
<Route path="/seller/order/:orderId/:itemId/pdf" element={<PDFShipment />} />
<Route path="/admin" element={<AdminDashboard />} />
<Route path="/admin/Allusers" element={<AllUsers />} />


    

    </Routes>
  </HashRouter>
</AuthProvider>

)
};

export default App;
