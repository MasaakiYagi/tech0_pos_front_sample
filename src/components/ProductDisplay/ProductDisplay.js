import React from "react";
import "./ProductDisplay.css";

const ProductDisplay = ({ product }) => {
  return (
    <div className="ProductDisplayArea">
      <div>コード: {product.PRD_CD || "該当なし"}</div>
      <div>名称: {product.PRD_NAME || "該当なし"}</div>
      <div>単価: {product.PRD_PRICE || "該当なし"}</div>
    </div>
  );
};

export default ProductDisplay;
