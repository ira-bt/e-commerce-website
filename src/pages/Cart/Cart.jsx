import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { cartService } from "../../services/cart.service";
import { ROUTES } from "../../utils/routes";

export default function Cart() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  
  // Route guard
  if (!isAuthenticated) {
    navigate(ROUTES.LOGIN);
    return null;
  }

  if (!user) return null;

  // DERIVED STATE (NO EFFECT, NO SETSTATE)
  const cart = cartService.getUserCart(user.username);

  if (!cart || !cart.items || cart.items.length === 0) {
    return <div className="cart-empty">Your cart is empty</div>;
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart">
      {/* ================= Items ================= */}
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
              <p className="cart-item__price">
                ₹{item.price} × {item.quantity}
              </p>
            </div>

            <div className="cart-item__total">
              ₹{(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </section>

      {/* ================= Summary ================= */}
      <aside className="cart-summary">
        <h3 className="cart-summary__title">Order Summary</h3>

        <div className="cart-summary__row">
          <span>Total Items</span>
          <span>{cart.items.length}</span>
        </div>

        <div className="cart-summary__row cart-summary__total">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>

        <button
          className="cart-summary__checkout"
          onClick={() => navigate(ROUTES.CHECKOUT)}
        >
          Proceed to Checkout
        </button>
      </aside>
    </div>
  );
}
