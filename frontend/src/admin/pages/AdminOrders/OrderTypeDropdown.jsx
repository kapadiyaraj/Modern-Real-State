import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ordertypedropdown.css"
const OrderTypeDropdown = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentValue = () => {
    if (location.pathname === "/admin/orders") {
      return "/admin/orders";
    }

    if (location.pathname === "/admin/luxury-orders") {
      return "/admin/luxury-orders";
    }

    if (location.pathname === "/admin/spacious-orders") {
      return "/admin/spacious-orders";
    }

    if (location.pathname === "/admin/penthouse-orders") {
      return "/admin/penthouse-orders";
    }

    return "";
  };

  const handleChange = (e) => {
    const path = e.target.value;

    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="order-type-dropdown">
      <label>Order Type</label>

      <select
        value={getCurrentValue()}
        onChange={handleChange}
      >
        <option value="">
          Select Property Type
        </option>

        <option value="/admin/orders">
          Regular Property
        </option>

        <option value="/admin/luxury-orders">
          Luxury Property
        </option>

        <option value="/admin/spacious-orders">
          Spacious Living
        </option>

        <option value="/admin/penthouse-orders">
          Penthouse
        </option>
      </select>
    </div>
  );
};

export default OrderTypeDropdown;