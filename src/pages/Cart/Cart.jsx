import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { cartService } from "../../services/cart.service";
import { ROUTES } from "../../utils/routes";
import { useEffect, useState } from "react";

export default function Cart() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [cart, setCart] = useState(() => {
    if (!user) return null;
    return cartService.getUserCart(user.username);
  });

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) return null;

  if (!cart || cart.items.length === 0) {
    return <div className="cart-empty">Your cart is empty</div>;
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleQuantityChange = async (productId, delta) => {
    const updatedCart = await cartService.updateQuantity(
      user.username,
      productId,
      delta
    );
    setCart(updatedCart);
  };

  /* =========================
     CHECKOUT
  ========================= */
  const handleCheckout = async () => {
    setShowSuccess(true); // show snackbar immediately
    await cartService.clearCart(user.username); // clear cart
    setCart(null); // remove cart
    setTimeout(() => {
      setShowSuccess(false);
      navigate(ROUTES.HOME);
    }, 2000);
  };

  const totalItems = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <>
      {showSuccess && (
        <div className="snackbar snackbar--success">
          ✅ Order placed successfully!
        </div>
      )}

      <div className="cart">
        <section className="cart-items">
          <h2 className="cart-items__title">Shopping Cart</h2>

          {cart.items.map(item => (
            <div key={item.productId} className="cart-item">
              <img
                src={item.image}
                alt={item.title}
                className="cart-item__image"
              />

              <div className="cart-item__info">
                <p className="cart-item__title">{item.title}</p>

                <div className="cart-item__price">
                  <button
                    className="qty-btn"
                    onClick={() =>
                      handleQuantityChange(item.productId, -1)
                    }
                  >
                    −
                  </button>

                  <span className="qty-value">{item.quantity}</span>

                  <button
                    className="qty-btn"
                    onClick={() =>
                      handleQuantityChange(item.productId, +1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="cart-item__total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </section>

        <aside className="cart-summary">
          <h3 className="cart-summary__title">Order Summary</h3>

          <div className="cart-summary__row">
            <span>Total Items</span>
            <span>{totalItems}</span>
          </div>

          <div className="cart-summary__row cart-summary__total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            className="cart-summary__checkout"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
        </aside>
      </div>
    </>
  );
}
