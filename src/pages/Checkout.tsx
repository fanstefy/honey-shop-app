// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import { useShopStore } from "../store/useShopStore";
// import {
//   createOrder,
//   sendOrderConfirmationEmail,
// } from "../services/ordersFirebaseService";
// import { Helmet } from "react-helmet-async";
// import {
//   FaUser,
//   FaMapMarkerAlt,
//   FaPhone,
//   FaShoppingBag,
//   FaMoneyBillWave,
//   FaLock,
//   FaUserPlus,
// } from "react-icons/fa";

// const Checkout = () => {
//   const navigate = useNavigate();
//   const { currentUser } = useAuth();
//   const { cart, products, getProductById, clearCart } = useShopStore();

//   // Redirect ako je cart prazan
//   useEffect(() => {
//     if (
//       cart.length === 0 &&
//       !window.location.pathname.includes("order-success")
//     ) {
//       navigate("/cart");
//     }
//   }, [cart, navigate]);

//   // Checkout steps: 1-auth, 2-shipping, 3-review, 4-confirm
//   const [currentStep, setCurrentStep] = useState(1);
//   const [isProcessing, setIsProcessing] = useState(false);

//   // Form data
//   const [shippingData, setShippingData] = useState({
//     fullName: currentUser?.displayName || "",
//     city: "",
//     address: "",
//     phone: "",
//     notes: "",
//   });

//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

//   // Cart calculations
//   const cartItems = cart
//     .map((cartItem) => {
//       const product = getProductById(cartItem.id);
//       return { ...cartItem, product };
//     })
//     .filter((item) => item.product);

//   const subtotal = cartItems.reduce(
//     (total, item) => total + (item.product?.price || 0) * item.quantity,
//     0
//   );
//   const shippingCost = 5.0; // Fixed shipping
//   const total = subtotal + shippingCost;

//   // Validation
//   const validateShippingData = () => {
//     const newErrors: { [key: string]: string } = {};

//     if (!shippingData.fullName.trim()) {
//       newErrors.fullName = "Ime i prezime su obavezni";
//     }

//     if (!shippingData.city.trim()) {
//       newErrors.city = "Grad je obavezan";
//     }

//     if (!shippingData.address.trim()) {
//       newErrors.address = "Adresa je obavezna";
//     }

//     if (!shippingData.phone.trim()) {
//       newErrors.phone = "Broj telefona je obavezan";
//     } else if (!/^[\+]?[0-9\s\-\(\)]{8,}$/.test(shippingData.phone)) {
//       newErrors.phone = "Neispavan format broja telefona";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleShippingSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (validateShippingData()) {
//       setCurrentStep(3);
//     }
//   };

//   const handlePlaceOrder = async () => {
//     setIsProcessing(true);

//     try {
//       // Prepare order data
//       const orderItems = cartItems.map((item) => ({
//         id: item.product!.id,
//         name: item.product!.name,
//         price: item.product!.price,
//         quantity: item.quantity,
//         image: item.product!.image,
//       }));

//       const orderData = {
//         userId: currentUser?.uid || undefined,
//         userEmail: currentUser?.email || undefined,
//         items: orderItems,
//         subtotal: subtotal,
//         shippingCost: shippingCost,
//         total: total,
//         shippingAddress: shippingData,
//         paymentMethod: "cash_on_delivery" as const,
//         status: "pending" as const, // Add default status
//       };

//       console.log("Creating order with data:", orderData);

//       // Create order in Firebase
//       const orderId = await createOrder(orderData);

//       console.log("Order created successfully");

//       // Send confirmation email if user has email
//       if (currentUser?.email) {
//         try {
//           await sendOrderConfirmationEmail({
//             ...orderData,
//             orderId,
//             status: "pending",
//           });
//           console.log("Confirmation email sent");
//         } catch (emailError) {
//           console.error("Failed to send confirmation email:", emailError);
//           // Continue even if email fails
//         }
//       }

//       // Clear cart
//       clearCart();
//       console.log("Cart cleared");
//       // Redirect to success page
//       navigate(`/order-success/${orderId}`);
//     } catch (error) {
//       console.error("Error placing order:", error);
//       if (error instanceof Error) {
//         alert(`Greška pri kreiranju porudžbine: ${error.message}`);
//       } else {
//         alert(`Greška pri kreiranju porudžbine: ${String(error)}`);
//       }
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleInputChange = (field: string, value: string) => {
//     setShippingData((prev) => ({ ...prev, [field]: value }));
//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors((prev) => ({ ...prev, [field]: "" }));
//     }
//   };

//   const steps = [
//     { number: 1, title: "Verifikacija", icon: FaUser },
//     { number: 2, title: "Dostava", icon: FaMapMarkerAlt },
//     { number: 3, title: "Pregled", icon: FaShoppingBag },
//     { number: 4, title: "Potvrda", icon: FaLock },
//   ];

//   return (
//     <>
//       <Helmet>
//         <title>Checkout | Nektarika</title>
//         <meta name="description" content="Završite vašu porudžbinu" />
//       </Helmet>

//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-4xl mx-auto px-4">
//           {/* Progress Indicator */}
//           <div className="mb-8">
//             <div className="flex items-center justify-between">
//               {steps.map((step, index) => (
//                 <div key={step.number} className="flex items-center">
//                   <div
//                     className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
//                       currentStep >= step.number
//                         ? "bg-yellow-500 border-yellow-500 text-white"
//                         : "border-gray-300 text-gray-500"
//                     }`}
//                   >
//                     <step.icon className="w-4 h-4" />
//                   </div>
//                   <span
//                     className={`ml-2 text-sm font-medium ${
//                       currentStep >= step.number
//                         ? "text-yellow-600"
//                         : "text-gray-500"
//                     }`}
//                   >
//                     {step.title}
//                   </span>
//                   {index < steps.length - 1 && (
//                     <div
//                       className={`w-20 h-1 mx-4 ${
//                         currentStep > step.number
//                           ? "bg-yellow-500"
//                           : "bg-gray-200"
//                       }`}
//                     />
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Main Content */}
//             <div className="lg:col-span-2">
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 {/* Step 1: Authentication */}
//                 {currentStep === 1 && (
//                   <div>
//                     <h2 className="text-xl font-bold mb-4">
//                       Verifikacija naloga
//                     </h2>

//                     {currentUser ? (
//                       <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
//                         <div className="flex items-center">
//                           <FaUser className="text-green-600 mr-3" />
//                           <div>
//                             <p className="font-medium text-green-800">
//                               Ulogovani ste kao{" "}
//                               {currentUser.displayName || currentUser.email}
//                             </p>
//                             <p className="text-green-600 text-sm">
//                               Možete nastaviti sa porudžbinom
//                             </p>
//                           </div>
//                         </div>
//                         <button
//                           onClick={() => setCurrentStep(2)}
//                           className="mt-4 w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-200"
//                         >
//                           Nastavi sa porudžbinom
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="space-y-4">
//                         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                           <h3 className="font-medium text-blue-800 mb-2">
//                             Imate nalog?
//                           </h3>
//                           <p className="text-blue-600 text-sm mb-3">
//                             Ulogujte se da bi koristili sačuvane podatke
//                           </p>
//                           <button
//                             onClick={() =>
//                               navigate("/login", {
//                                 state: { from: { pathname: "/checkout" } },
//                               })
//                             }
//                             className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
//                           >
//                             Ulogujte se
//                           </button>
//                         </div>

//                         <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
//                           <h3 className="font-medium text-gray-800 mb-2">
//                             Nemate nalog?
//                           </h3>
//                           <p className="text-gray-600 text-sm mb-3">
//                             Možete naručiti kao gost ili se registrovati za
//                             lakše buduće porudžbine
//                           </p>
//                           <div className="flex space-x-3">
//                             <button
//                               onClick={() => setCurrentStep(2)}
//                               className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-200"
//                             >
//                               Nastavi kao gost
//                             </button>
//                             <button
//                               onClick={() => navigate("/register")}
//                               className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200 flex items-center justify-center"
//                             >
//                               <FaUserPlus className="mr-2" />
//                               Registruj se
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Step 2: Shipping Information */}
//                 {currentStep === 2 && (
//                   <div>
//                     <h2 className="text-xl font-bold mb-4">
//                       Podaci za dostavu
//                     </h2>

//                     <form onSubmit={handleShippingSubmit} className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Ime i prezime *
//                         </label>
//                         <input
//                           type="text"
//                           value={shippingData.fullName}
//                           onChange={(e) =>
//                             handleInputChange("fullName", e.target.value)
//                           }
//                           className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
//                             errors.fullName
//                               ? "border-red-500"
//                               : "border-gray-300"
//                           }`}
//                           placeholder="Marko Marković"
//                         />
//                         {errors.fullName && (
//                           <p className="text-red-500 text-xs mt-1">
//                             {errors.fullName}
//                           </p>
//                         )}
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Grad *
//                           </label>
//                           <input
//                             type="text"
//                             value={shippingData.city}
//                             onChange={(e) =>
//                               handleInputChange("city", e.target.value)
//                             }
//                             className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
//                               errors.city ? "border-red-500" : "border-gray-300"
//                             }`}
//                             placeholder="Beograd"
//                           />
//                           {errors.city && (
//                             <p className="text-red-500 text-xs mt-1">
//                               {errors.city}
//                             </p>
//                           )}
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Broj telefona *
//                           </label>
//                           <input
//                             type="tel"
//                             value={shippingData.phone}
//                             onChange={(e) =>
//                               handleInputChange("phone", e.target.value)
//                             }
//                             className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
//                               errors.phone
//                                 ? "border-red-500"
//                                 : "border-gray-300"
//                             }`}
//                             placeholder="+381 60 123 4567"
//                           />
//                           {errors.phone && (
//                             <p className="text-red-500 text-xs mt-1">
//                               {errors.phone}
//                             </p>
//                           )}
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Adresa i broj *
//                         </label>
//                         <input
//                           type="text"
//                           value={shippingData.address}
//                           onChange={(e) =>
//                             handleInputChange("address", e.target.value)
//                           }
//                           className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
//                             errors.address
//                               ? "border-red-500"
//                               : "border-gray-300"
//                           }`}
//                           placeholder="Knez Mihailova 42"
//                         />
//                         {errors.address && (
//                           <p className="text-red-500 text-xs mt-1">
//                             {errors.address}
//                           </p>
//                         )}
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Napomene (opciono)
//                         </label>
//                         <textarea
//                           value={shippingData.notes}
//                           onChange={(e) =>
//                             handleInputChange("notes", e.target.value)
//                           }
//                           rows={3}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
//                           placeholder="Dodatne napomene za dostavu..."
//                         />
//                       </div>

//                       <div className="flex space-x-3">
//                         <button
//                           type="button"
//                           onClick={() => setCurrentStep(1)}
//                           className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition duration-200"
//                         >
//                           Nazad
//                         </button>
//                         <button
//                           type="submit"
//                           className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-200"
//                         >
//                           Nastavi
//                         </button>
//                       </div>
//                     </form>
//                   </div>
//                 )}

//                 {/* Step 3: Order Review */}
//                 {currentStep === 3 && (
//                   <div>
//                     <h2 className="text-xl font-bold mb-4">
//                       Pregled porudžbine
//                     </h2>

//                     {/* Shipping Info Review */}
//                     <div className="bg-gray-50 rounded-lg p-4 mb-6">
//                       <h3 className="font-medium mb-2">Podaci za dostavu:</h3>
//                       <p className="text-sm text-gray-600">
//                         <strong>{shippingData.fullName}</strong>
//                         <br />
//                         {shippingData.address}
//                         <br />
//                         {shippingData.city}
//                         <br />
//                         {shippingData.phone}
//                       </p>
//                       {shippingData.notes && (
//                         <p className="text-sm text-gray-600 mt-2">
//                           <strong>Napomene:</strong> {shippingData.notes}
//                         </p>
//                       )}
//                       <button
//                         onClick={() => setCurrentStep(2)}
//                         className="text-yellow-600 text-sm mt-2 hover:underline"
//                       >
//                         Izmeni podatke
//                       </button>
//                     </div>

//                     {/* Payment Method */}
//                     <div className="bg-gray-50 rounded-lg p-4 mb-6">
//                       <h3 className="font-medium mb-2">Način plaćanja:</h3>
//                       <div className="flex items-center">
//                         <FaMoneyBillWave className="text-green-600 mr-2" />
//                         <span className="text-sm">Plaćanje pouzećem</span>
//                       </div>
//                     </div>

//                     {/* Order Items - will be shown in sidebar */}

//                     <div className="flex space-x-3">
//                       <button
//                         onClick={() => setCurrentStep(2)}
//                         className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition duration-200"
//                       >
//                         Nazad
//                       </button>
//                       <button
//                         onClick={handlePlaceOrder}
//                         disabled={isProcessing}
//                         className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-200 disabled:opacity-50"
//                       >
//                         {isProcessing ? (
//                           <div className="flex items-center justify-center">
//                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                             Obrađujem...
//                           </div>
//                         ) : (
//                           "Potvrdi porudžbinu"
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Order Summary Sidebar */}
//             <div className="lg:col-span-1">
//               <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
//                 <h3 className="text-lg font-bold mb-4">Pregled porudžbine</h3>

//                 {/* Cart Items */}
//                 <div className="space-y-3 mb-4">
//                   {cartItems.map(({ id, quantity, product }) => (
//                     <div
//                       key={id}
//                       className="flex items-center justify-between text-sm"
//                     >
//                       <div className="flex items-center">
//                         <img
//                           src={product?.image}
//                           alt={product?.name}
//                           className="w-10 h-10 object-cover rounded mr-3"
//                         />
//                         <div>
//                           <p className="font-medium">{product?.name}</p>
//                           <p className="text-gray-500">Količina: {quantity}</p>
//                         </div>
//                       </div>
//                       <span className="font-medium">
//                         ${((product?.price || 0) * quantity).toFixed(2)}
//                       </span>
//                     </div>
//                   ))}
//                 </div>

//                 <hr className="my-4" />

//                 {/* Totals */}
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span>Subtotal:</span>
//                     <span>${subtotal.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Dostava:</span>
//                     <span>${shippingCost.toFixed(2)}</span>
//                   </div>
//                   <hr />
//                   <div className="flex justify-between font-bold text-lg">
//                     <span>Ukupno:</span>
//                     <span>${total.toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Checkout;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useShopStore } from "../store/useShopStore";
import {
  createOrder,
  sendOrderConfirmationEmail,
} from "../services/ordersFirebaseService";
import { Helmet } from "react-helmet-async";
import {
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaShoppingBag,
  FaMoneyBillWave,
  FaLock,
  FaUserPlus,
} from "react-icons/fa";

const Checkout = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { cart, products, getProductById, clearCart } = useShopStore();

  // Redirect ako je cart prazan
  useEffect(() => {
    if (
      cart.length === 0 &&
      !window.location.pathname.includes("order-success")
    ) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  // Checkout steps: 1-auth, 2-shipping, 3-review, 4-confirm
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form data
  const [shippingData, setShippingData] = useState({
    fullName: currentUser?.displayName || "",
    city: "",
    address: "",
    phone: "",
    notes: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Cart calculations
  const cartItems = cart
    .map((cartItem) => {
      const product = getProductById(cartItem.id);
      return { ...cartItem, product };
    })
    .filter((item) => item.product);

  const subtotal = cartItems.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0
  );
  const shippingCost = 5.0;
  const total = subtotal + shippingCost;

  // Validation
  const validateShippingData = () => {
    const newErrors: { [key: string]: string } = {};

    if (!shippingData.fullName.trim()) {
      newErrors.fullName = "Ime i prezime su obavezni";
    }

    if (!shippingData.city.trim()) {
      newErrors.city = "Grad je obavezan";
    }

    if (!shippingData.address.trim()) {
      newErrors.address = "Adresa je obavezna";
    }

    if (!shippingData.phone.trim()) {
      newErrors.phone = "Broj telefona je obavezan";
    } else if (!/^[\+]?[0-9\s\-\(\)]{8,}$/.test(shippingData.phone)) {
      newErrors.phone = "Neispavan format broja telefona";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShippingData()) {
      setCurrentStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      const orderItems = cartItems.map((item) => ({
        id: item.product!.id,
        name: item.product!.name,
        price: item.product!.price,
        quantity: item.quantity,
        image: item.product!.image,
      }));

      const orderData = {
        userId: currentUser?.uid || undefined,
        userEmail: currentUser?.email || undefined,
        items: orderItems,
        subtotal: subtotal,
        shippingCost: shippingCost,
        total: total,
        shippingAddress: shippingData,
        paymentMethod: "cash_on_delivery" as const,
      };

      const orderId = await createOrder(orderData);

      if (currentUser?.email) {
        try {
          await sendOrderConfirmationEmail({
            ...orderData,
            orderId,
            status: "pending",
          });
        } catch (emailError) {
          console.error("Failed to send confirmation email:", emailError);
        }
      }

      clearCart();
      navigate(`/order-success/${orderId}`);
    } catch (error) {
      console.error("Error placing order:", error);
      if (error instanceof Error) {
        alert(`Greška pri kreiranju porudžbine: ${error.message}`);
      } else {
        alert(`Greška pri kreiranju porudžbine: ${String(error)}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setShippingData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const steps = [
    { number: 1, title: "Verifikacija", icon: FaUser },
    { number: 2, title: "Dostava", icon: FaMapMarkerAlt },
    { number: 3, title: "Pregled", icon: FaShoppingBag },
    { number: 4, title: "Potvrda", icon: FaLock },
  ];

  return (
    <>
      <Helmet>
        <title>Checkout | Nektarika</title>
        <meta name="description" content="Završite vašu porudžbinu" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-4 sm:py-[75px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Progress Indicator - Mobile Optimized */}
          <div className="mb-6 sm:mb-8">
            {/* Mobile: Compact Progress */}
            <div className="block sm:hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Korak {currentStep} od {steps.length}
                </span>
                <span className="text-sm text-gray-500">
                  {steps[currentStep - 1]?.title}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Desktop: Full Progress */}
            <div className="hidden sm:block">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        currentStep >= step.number
                          ? "bg-yellow-500 border-yellow-500 text-white"
                          : "border-gray-300 text-gray-500"
                      }`}
                    >
                      <step.icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`ml-2 text-sm font-medium hidden md:inline ${
                        currentStep >= step.number
                          ? "text-yellow-600"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-12 lg:w-20 h-1 mx-2 md:mx-4 ${
                          currentStep > step.number
                            ? "bg-yellow-500"
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Responsive Layout */}
          <div className="flex flex-col lg:grid lg:grid-cols-3 lg:gap-8 space-y-6 lg:space-y-0">
            {/* Order Summary - Mobile First (shows at top on mobile) */}
            <div className="order-first lg:order-last lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 sticky top-4">
                <h3 className="text-lg font-bold mb-4">Pregled porudžbine</h3>

                {/* Cart Items - Collapsible on mobile */}
                <div className="space-y-3 mb-4">
                  {cartItems.map(({ id, quantity, product }) => (
                    <div
                      key={id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center">
                        <img
                          src={product?.image}
                          alt={product?.name}
                          className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded mr-2 sm:mr-3"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">
                            {product?.name}
                          </p>
                          <p className="text-gray-500 text-xs sm:text-sm">
                            Količina: {quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium text-sm whitespace-nowrap ml-2">
                        ${((product?.price || 0) * quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="my-4" />

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dostava:</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-bold text-base sm:text-lg">
                    <span>Ukupno:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Form Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                {/* Step 1: Authentication */}
                {currentStep === 1 && (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold mb-4">
                      Verifikacija naloga
                    </h2>

                    {currentUser ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start sm:items-center">
                          <FaUser className="text-green-600 mr-3 mt-1 sm:mt-0 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-green-800 break-words">
                              Ulogovani ste kao{" "}
                              {currentUser.displayName || currentUser.email}
                            </p>
                            <p className="text-green-600 text-sm">
                              Možete nastaviti sa porudžbinom
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="mt-4 w-full bg-yellow-500 text-white py-3 px-4 rounded-lg hover:bg-yellow-600 transition duration-200 font-medium"
                        >
                          Nastavi sa porudžbinom
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h3 className="font-medium text-blue-800 mb-2">
                            Imate nalog?
                          </h3>
                          <p className="text-blue-600 text-sm mb-3">
                            Ulogujte se da bi koristili sačuvane podatke
                          </p>
                          <button
                            onClick={() =>
                              navigate("/login", {
                                state: { from: { pathname: "/checkout" } },
                              })
                            }
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                          >
                            Ulogujte se
                          </button>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <h3 className="font-medium text-gray-800 mb-2">
                            Nemate nalog?
                          </h3>
                          <p className="text-gray-600 text-sm mb-3">
                            Možete naručiti kao gost ili se registrovati za
                            lakše buduće porudžbine
                          </p>
                          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                            <button
                              onClick={() => setCurrentStep(2)}
                              className="flex-1 bg-yellow-500 text-white py-3 px-4 rounded-lg hover:bg-yellow-600 transition duration-200 font-medium"
                            >
                              Nastavi kao gost
                            </button>
                            <button
                              onClick={() => navigate("/register")}
                              className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition duration-200 flex items-center justify-center font-medium"
                            >
                              <FaUserPlus className="mr-2" />
                              Registruj se
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Shipping Information */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold mb-4">
                      Podaci za dostavu
                    </h2>

                    <form onSubmit={handleShippingSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ime i prezime *
                        </label>
                        <input
                          type="text"
                          value={shippingData.fullName}
                          onChange={(e) =>
                            handleInputChange("fullName", e.target.value)
                          }
                          className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                            errors.fullName
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Marko Marković"
                        />
                        {errors.fullName && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Grad *
                          </label>
                          <input
                            type="text"
                            value={shippingData.city}
                            onChange={(e) =>
                              handleInputChange("city", e.target.value)
                            }
                            className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                              errors.city ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="Beograd"
                          />
                          {errors.city && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.city}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Broj telefona *
                          </label>
                          <input
                            type="tel"
                            value={shippingData.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                              errors.phone
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="+381 60 123 4567"
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Adresa i broj *
                        </label>
                        <input
                          type="text"
                          value={shippingData.address}
                          onChange={(e) =>
                            handleInputChange("address", e.target.value)
                          }
                          className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                            errors.address
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Knez Mihailova 42"
                        />
                        {errors.address && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.address}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Napomene (opciono)
                        </label>
                        <textarea
                          value={shippingData.notes}
                          onChange={(e) =>
                            handleInputChange("notes", e.target.value)
                          }
                          rows={3}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                          placeholder="Dodatne napomene za dostavu..."
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
                        >
                          Nazad
                        </button>
                        <button
                          type="submit"
                          className="flex-1 bg-yellow-500 text-white py-3 px-4 rounded-lg hover:bg-yellow-600 transition duration-200 font-medium"
                        >
                          Nastavi
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Step 3: Order Review */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold mb-4">
                      Pregled porudžbine
                    </h2>

                    {/* Shipping Info Review */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium">Podaci za dostavu:</h3>
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="text-yellow-600 text-sm hover:underline flex-shrink-0 ml-2"
                        >
                          Izmeni
                        </button>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          <strong>{shippingData.fullName}</strong>
                        </p>
                        <p>{shippingData.address}</p>
                        <p>{shippingData.city}</p>
                        <p>{shippingData.phone}</p>
                        {shippingData.notes && (
                          <p className="mt-2">
                            <strong>Napomene:</strong> {shippingData.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h3 className="font-medium mb-2">Način plaćanja:</h3>
                      <div className="flex items-center">
                        <FaMoneyBillWave className="text-green-600 mr-2 flex-shrink-0" />
                        <span className="text-sm">Plaćanje pouzećem</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
                      >
                        Nazad
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                        className="flex-1 bg-yellow-500 text-white py-3 px-4 rounded-lg hover:bg-yellow-600 transition duration-200 disabled:opacity-50 font-medium"
                      >
                        {isProcessing ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Obrađujem...
                          </div>
                        ) : (
                          "Potvrdi porudžbinu"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
