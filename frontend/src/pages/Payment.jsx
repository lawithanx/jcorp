import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import './Page.css';

function Payment() {
  const videoRef = useRef(null);
  const [paymentMethod, setPaymentMethod] = useState('web3'); // 'web3' or 'fiat'
  const [walletAddress, setWalletAddress] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadToken, setDownloadToken] = useState(null);
  const [fiatAmount, setFiatAmount] = useState(50); // Default $50 USD

  // Get API base URL from environment or use relative path
  const API_BASE_URL = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    fetchPaymentInfo();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => console.log('Video is playing'))
          .catch((error) => {
            console.log('Video autoplay prevented:', error);
            const handleInteraction = () => {
              video.play().catch(console.error);
              document.removeEventListener('click', handleInteraction);
              document.removeEventListener('touchstart', handleInteraction);
            };
            document.addEventListener('click', handleInteraction);
            document.addEventListener('touchstart', handleInteraction);
          });
      }
    }
    
    return () => {
      if (video) {
        video.pause();
      }
    };
  }, []);

  async function fetchPaymentInfo() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payment/info/`);
      const data = await response.json();
      if (data.success) {
        setPaymentInfo(data);
      }
    } catch (error) {
      console.error("Error fetching payment info:", error);
    }
  }

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Please install MetaMask to continue");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        return accounts[0];
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet: " + error.message);
    }
  }

  async function handleWeb3Pay() {
    if (!window.ethereum) {
      alert("Please install MetaMask to continue");
      return;
    }

    setIsProcessing(true);
    setPaymentStatus({ type: "info", message: "Connecting wallet..." });

    try {
      if (!walletAddress) {
        await connectWallet();
      }

      if (!paymentInfo) {
        await fetchPaymentInfo();
      }

      setPaymentStatus({ type: "info", message: "Sending payment..." });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const tx = await signer.sendTransaction({
        to: paymentInfo.wallet_address,
        value: ethers.parseEther(paymentInfo.amount_eth.toString()),
      });

      setPaymentStatus({ 
        type: "info", 
        message: `Transaction sent! Hash: ${tx.hash.slice(0, 10)}...` 
      });

      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        await verifyPayment(tx.hash);
      } else {
        setPaymentStatus({ type: "error", message: "Transaction failed" });
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      if (error.code === 4001) {
        setPaymentStatus({ type: "error", message: "Transaction rejected by user" });
      } else {
        setPaymentStatus({ type: "error", message: "Payment failed: " + error.message });
      }
      setIsProcessing(false);
    }
  }

  async function verifyPayment(txHash) {
    try {
      setPaymentStatus({ type: "info", message: "Verifying payment..." });

      const response = await fetch(`${API_BASE_URL}/api/payment/verify/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transaction_hash: txHash,
          from_address: walletAddress,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentStatus({ type: "success", message: "Payment confirmed! You can now download." });
        setDownloadToken(data.download_token);
        setIsProcessing(false);
      } else if (data.status === "processing") {
        setPaymentStatus({ 
          type: "info", 
          message: `Waiting for confirmations (${data.confirmations}/${data.required_confirmations})...` 
        });
        setTimeout(() => verifyPayment(txHash), 5000);
      } else {
        setPaymentStatus({ type: "error", message: data.error || "Verification failed" });
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setPaymentStatus({ type: "error", message: "Verification failed: " + error.message });
      setIsProcessing(false);
    }
  }

  async function handleFiatPay() {
    setIsProcessing(true);
    setPaymentStatus({ type: "info", message: "Processing fiat payment..." });

    try {
      // TODO: Integrate with payment gateway (Stripe, PayPal, etc.)
      // For now, this is a placeholder
      const response = await fetch(`${API_BASE_URL}/api/payment/fiat/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: fiatAmount,
          currency: "USD",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentStatus({ type: "success", message: "Payment processed successfully!" });
        setDownloadToken(data.download_token);
      } else {
        setPaymentStatus({ type: "error", message: data.error || "Payment failed" });
      }
    } catch (error) {
      console.error("Fiat payment error:", error);
      setPaymentStatus({ type: "error", message: "Payment failed: " + error.message });
    } finally {
      setIsProcessing(false);
    }
  }

  function handleDownload() {
    if (window.businessCard3D) {
      window.businessCard3D.downloadImage();
    } else {
      alert("3D card not initialized");
    }
  }

  return (
    <div className="home-page">
      <div className="video-background">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="home-video"
          preload="auto"
        >
          <source src="/videos/home-background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-fallback">
          <p>[VIDEO NOT FOUND]</p>
        </div>
      </div>
      
      <div className="page-content-container">
        <div className="business-card-template payment-page-template">
          <div className="page-header" style={{marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.2)'}}>
            <h1 className="page-title">PAYMENT</h1>
            <p className="page-subtitle">SECURE PAYMENT GATEWAY</p>
          </div>

          <div className="payment-content">
          {/* Payment Method Selection */}
          <div className="payment-method-selector">
            <button
              className={`payment-method-btn ${paymentMethod === 'web3' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('web3')}
            >
              Web3 (Crypto)
            </button>
            <button
              className={`payment-method-btn ${paymentMethod === 'fiat' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('fiat')}
            >
              Fiat (Credit Card)
            </button>
          </div>

          {/* Web3 Payment Section */}
          {paymentMethod === 'web3' && (
            <div className="payment-section">
              <div className="payment-info-card">
                <h3>Web3 Payment</h3>
                <p className="payment-description">
                  Pay using cryptocurrency (ETH) via MetaMask or other Web3 wallets.
                </p>
                <div className="payment-details">
                  <div className="detail-row">
                    <span className="detail-label">Amount:</span>
                    <span className="detail-value">{paymentInfo?.amount_eth || 0.02} ETH</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Network:</span>
                    <span className="detail-value">{paymentInfo?.network || 'Ethereum Mainnet'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Wallet Address:</span>
                    <span className="detail-value address">{paymentInfo?.wallet_address?.slice(0, 10)}...{paymentInfo?.wallet_address?.slice(-8)}</span>
                  </div>
                </div>

                {!walletAddress && (
                  <button className="btn btn-connect" onClick={connectWallet}>
                    Connect Wallet
                  </button>
                )}

                {walletAddress && !downloadToken && (
                  <div className="wallet-connected">
                    <p>Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
                    <button
                      className="btn btn-pay"
                      onClick={handleWeb3Pay}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : `Pay ${paymentInfo?.amount_eth || 0.02} ETH`}
                    </button>
                  </div>
                )}

                {downloadToken && (
                  <div className="payment-success">
                    <p className="success-message">Payment confirmed!</p>
                    <button className="btn btn-download" onClick={handleDownload}>
                      Download Business Card
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Fiat Payment Section */}
          {paymentMethod === 'fiat' && (
            <div className="payment-section">
              <div className="payment-info-card">
                <h3>Fiat Payment</h3>
                <p className="payment-description">
                  Pay using credit card, debit card, or other traditional payment methods.
                </p>
                <div className="payment-details">
                  <div className="detail-row">
                    <span className="detail-label">Amount:</span>
                    <span className="detail-value">${fiatAmount} USD</span>
                  </div>
                  <div className="detail-row">
                    <label className="detail-label">Select Amount:</label>
                    <select
                      className="amount-select"
                      value={fiatAmount}
                      onChange={(e) => setFiatAmount(parseFloat(e.target.value))}
                    >
                      <option value={25}>$25 USD</option>
                      <option value={50}>$50 USD</option>
                      <option value={100}>$100 USD</option>
                      <option value={200}>$200 USD</option>
                      <option value={500}>$500 USD</option>
                    </select>
                  </div>
                </div>

                <div className="fiat-payment-form">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input type="text" placeholder="1234 5678 9012 3456" maxLength="19" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input type="text" placeholder="MM/YY" maxLength="5" />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input type="text" placeholder="123" maxLength="4" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input type="text" placeholder="John Doe" />
                  </div>
                </div>

                <button
                  className="btn btn-pay"
                  onClick={handleFiatPay}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : `Pay $${fiatAmount} USD`}
                </button>

                {downloadToken && (
                  <div className="payment-success">
                    <p className="success-message">Payment confirmed!</p>
                    <button className="btn btn-download" onClick={handleDownload}>
                      Download Business Card
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Status */}
          {paymentStatus && (
            <div className={`payment-status status-${paymentStatus.type}`}>
              {paymentStatus.message}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;

