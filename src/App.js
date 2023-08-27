import React, { useState } from "react";
import "./App.css";
import BarcodeReader from "./components/BarcodeReader/BarcodeReader";
import ProductDisplay from "./components/ProductDisplay/ProductDisplay";
import PurchaseList from "./components/PurchaseList/PurchaseList";
import TitleBar from "./components/TitleBar/TitleBar";

const App = () => {
  const [product, setProduct] = useState({});
  // const [product, setProduct] = useState({
  //   PRD_ID: 0,
  //   PRD_CD: "aaaa",
  //   PRD_NAME: "aaaa",
  //   PRD_PRICE: 500,
  // });
  const [items, setItems] = useState([]);
  const [showScanner, setShowScanner] = useState(false); // バーコードリーダーを表示するかどうかの状態
  const [animateTriangle, setAnimateTriangle] = useState(false);
  const [searchCode, setSearchCode] = useState("");

  const handleScan = async (code) => {
    setShowScanner(false); // スキャンが完了したらバーコードリーダーを非表示にする
    try {
      const res = await fetch(
        process.env.REACT_APP_API_URL + "/search_product/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: code }),
        }
      );

      const data = await res.json();
      if (data.status === "success") {
        setProduct(data.message);
      } else {
        setProduct({});
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setProduct({});
    }
  };

  const handleSearch = () => {
    if (!searchCode) {
      alert("コードが入力されていません");
      return;
    }
    handleScan(searchCode);
  };

  const handleAdd = () => {
    if (!product.PRD_NAME) {
      alert("スキャン商品が不正です");
      return;
    }

    setAnimateTriangle(true); // アニメーションを開始

    setTimeout(() => {
      setAnimateTriangle(false); // アニメーションをリセット
    }, 200); // CSSアニメーションの持続時間

    setItems([...items, product]);
    setProduct({});
  };

  const handlePurchase = async () => {
    if (items.length === 0) {
      alert("商品が追加されていません");
      return; // ここで関数を終了し、APIコールをスキップ
    }

    const purchaseData = {
      EMP_CD: "9999999999",
      STORE_CD: "00030",
      POS_NO: "090",
      items: items,
    };

    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/purchase/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(purchaseData),
        }
      );

      const responseData = await response.json();

      // APIから帰ってきたメッセージをポップアップで表示
      if (responseData.message) {
        alert(JSON.stringify(responseData.message, null, 2));
      }

      setItems([]); // itemsを空にします
    } catch (error) {
      console.error("Error making a purchase:", error);
    }
  };

  return (
    <div className="full-container">
      {showScanner ? ( // showScannerの状態に応じてバーコードリーダーを表示する
        <BarcodeReader onScan={handleScan} />
      ) : (
        <>
          <TitleBar></TitleBar>
          <div className="content-body">
            <div className="horizontal-container">
              <button
                className="osha-button"
                onClick={() => setShowScanner(true)}
              >
                スキャン
              </button>
              <p className="whitetext">OR</p>

              <input
                type="text"
                value={searchCode}
                className="input_area"
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="コードを入力"
              />
              <button className="osha-button" onClick={handleSearch}>
                検索
              </button>
            </div>
            <ProductDisplay product={product} />
            <button className="osha-button" onClick={handleAdd}>
              追加
            </button>
            <div
              className={`triangle-down ${animateTriangle ? "animate" : ""}`}
            ></div>
            <div className="text-purchase">購入リスト</div>
            <PurchaseList items={items} />
            <button className="osha-button" onClick={handlePurchase}>
              購入
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
