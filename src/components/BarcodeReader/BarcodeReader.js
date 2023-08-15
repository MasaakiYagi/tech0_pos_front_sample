import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import "./BarcodeReader.css";

const BarcodeReader = ({ onScan }) => {
  const [error, setError] = useState(null);

  const handleScan = (data) => {
    if (data) {
      onScan(data);
    }
  };

  const handleError = (err) => {
    setError(err);
  };

  return (
    <div>
      {error && <p>{error.message}</p>}
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "100%" }}
      />
      <p>カメラをバーコードに向けてください</p>
    </div>
  );
};

export default BarcodeReader;
