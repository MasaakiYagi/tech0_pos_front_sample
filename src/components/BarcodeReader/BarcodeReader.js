import React, { useState, useEffect, useRef } from "react";
import Quagga from "quagga";
import "./BarcodeReader.css";

const BarcodeReader = ({ onScan }) => {
  const [error, setError] = useState(null);
  const [lastScans, setLastScans] = useState([]); // 最後の3回のスキャン結果を追跡するための状態
  const scannerRef = useRef(null);

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          constraints: {
            deviceId:
              "88bae1f64668944eb8b4728b38e25248f09c4bcf94c6ed96dad7863231e75f15",
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
          readers: ["ean_reader"], // ここで読み取るバーコードのタイプを指定
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
        const newCode = data.codeResult.code;
        const updatedScans = [...lastScans, newCode].slice(-3); // 最新の3つの結果だけを保持する
        setLastScans(updatedScans);

        // 3回同じバーコードがスキャンされた場合、onScan関数を呼び出す
        if (
          updatedScans.length === 3 &&
          updatedScans.every((code) => code === newCode)
        ) {
          onScan(newCode);
        }
      }
    });

    return () => {
      Quagga.offDetected();
      Quagga.stop();
    };
  }, [onScan, lastScans]);

  return (
    <div>
      {error && <p>{error.message}</p>}
      <div ref={scannerRef} style={{ width: "100%", height: "480px" }} />
      <p>カメラをバーコードに向けてください</p>
    </div>
  );
};

export default BarcodeReader;
