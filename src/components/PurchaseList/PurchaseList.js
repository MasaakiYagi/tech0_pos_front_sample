import React from "react";
import "./PurchaseList.css";

const PurchaseList = ({ items }) => {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          {item.PRD_NAME} ×1 {item.PRD_PRICE} {item.PRD_PRICE}
        </li>
      ))}
    </ul>
  );
};

export default PurchaseList;
