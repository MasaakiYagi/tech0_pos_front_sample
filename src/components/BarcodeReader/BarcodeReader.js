import React, { useState, useEffect, useRef } from "react";
import Quagga from "quagga";
import "./BarcodeReader.css";

const BarcodeReader = ({ onScan }) => {
  const [error, setError] = useState(null);
  const scannerRef = useRef(null); // リファレンスを追加

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          constraints: {
            width: 640,
            height: 480,
            facingMode: "environment", // 使用するカメラを背面カメラに設定
          },
          area: {
            top: "0%",
            right: "0%",
            left: "0%",
            bottom: "0%",
          },
          target: scannerRef.current, // リファレンスをターゲットに設定
        },
        locator: {
          patchSize: "medium",
          halfSample: true,
        },
        numOfWorkers: 4,
        decoder: {
          readers: ["code_128_reader"], // ここで読み取るバーコードのタイプを指定
        },
        locate: true,
      },
      (err) => {
        if (err) {
          console.log(err);
          setError(err);
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onDetected((data) => {
      if (data && data.codeResult) {
        onScan(data.codeResult.code);
      }
    });

    return () => {
      Quagga.offDetected();
      Quagga.stop();
    };
  }, [onScan]);

  return (
    <div>
      {error && <p>{error.message}</p>}
      <div ref={scannerRef} style={{ width: "100%", height: "480px" }} />
      <p>カメラをバーコードに向けてください</p>
    </div>
  );
};

export default BarcodeReader;
