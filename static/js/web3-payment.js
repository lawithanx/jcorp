/**
 * Web3 Payment Integration
 * Handles wallet connection, payment processing, and transaction verification
 */

class Web3Payment {
    constructor() {
        this.walletAddress = null;
        this.paymentAmount = null;
        this.walletAddressTo = null;
        this.chainId = null;
        this.isProcessing = false;
        
        // Check if Web3 is available
        this.checkWeb3();
    }

    async checkWeb3() {
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is installed');
            return true;
        } else {
            console.warn('MetaMask is not installed');
            return false;
        }
    }

    async connectWallet() {
        try {
            if (typeof window.ethereum === 'undefined') {
                throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
            }

            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            if (accounts.length === 0) {
                throw new Error('No accounts found. Please unlock MetaMask.');
            }

            this.walletAddress = accounts[0];
            console.log('Connected wallet:', this.walletAddress);

            // Get chain ID
            const chainId = await window.ethereum.request({
                method: 'eth_chainId'
            });
            this.chainId = parseInt(chainId, 16);

            // Get payment info from backend
            await this.fetchPaymentInfo();

            return {
                success: true,
                address: this.walletAddress,
                chainId: this.chainId
            };
        } catch (error) {
            console.error('Error connecting wallet:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async fetchPaymentInfo() {
        try {
            const response = await fetch('/api/payment/info/');
            const data = await response.json();
            
            if (data.success) {
                this.paymentAmount = data.amount_eth;
                this.walletAddressTo = data.wallet_address;
                this.chainId = data.chain_id;
                return data;
            } else {
                throw new Error('Failed to fetch payment info');
            }
        } catch (error) {
            console.error('Error fetching payment info:', error);
            throw error;
        }
    }

    async sendPayment() {
        if (this.isProcessing) {
            return { success: false, error: 'Payment already processing' };
        }

        if (!this.walletAddress) {
            const connectResult = await this.connectWallet();
            if (!connectResult.success) {
                return connectResult;
            }
        }

        try {
            this.isProcessing = true;

            // Fetch payment info if not already loaded
            if (!this.paymentAmount || !this.walletAddressTo) {
                await this.fetchPaymentInfo();
            }

            // Convert ETH to Wei (hex format)
            const amountWei = (parseFloat(this.paymentAmount) * 1e18).toString(16);
            const valueHex = '0x' + amountWei;

            // Get current chain ID
            const chainIdHex = await window.ethereum.request({
                method: 'eth_chainId'
            });

            // Send transaction
            const transactionParameters = {
                to: this.walletAddressTo,
                from: this.walletAddress,
                value: valueHex,
                chainId: chainIdHex
            };

            console.log('Sending transaction:', transactionParameters);

            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters]
            });

            console.log('Transaction hash:', txHash);

            // Return transaction hash immediately, verification will happen via polling
            return {
                success: true,
                status: 'processing',
                transaction_hash: txHash,
                tx_hash: txHash,
                message: 'Transaction sent, waiting for confirmation...'
            };
        } catch (error) {
            console.error('Error sending payment:', error);
            let errorMessage = 'Payment failed';
            
            if (error.code === 4001) {
                errorMessage = 'Transaction rejected by user';
            } else if (error.code === -32602) {
                errorMessage = 'Invalid transaction parameters';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            return {
                success: false,
                error: errorMessage
            };
        } finally {
            this.isProcessing = false;
        }
    }

    async waitForTransaction(txHash, timeout = 120000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            const checkTransaction = async () => {
                try {
                    if (Date.now() - startTime > timeout) {
                        reject(new Error('Transaction timeout'));
                        return;
                    }

                    const receipt = await window.ethereum.request({
                        method: 'eth_getTransactionReceipt',
                        params: [txHash]
                    });

                    if (receipt) {
                        resolve(receipt);
                    } else {
                        setTimeout(checkTransaction, 2000);
                    }
                } catch (error) {
                    reject(error);
                }
            };

            checkTransaction();
        });
    }

    async verifyPayment(transactionHash) {
        try {
            const response = await fetch('/api/payment/verify/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCSRFToken()
                },
                body: JSON.stringify({
                    transaction_hash: transactionHash,
                    from_address: this.walletAddress
                })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error verifying payment:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async checkPaymentStatus(transactionHash) {
        try {
            const response = await fetch('/api/payment/verify/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCSRFToken()
                },
                body: JSON.stringify({
                    transaction_hash: transactionHash,
                    from_address: this.walletAddress
                })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error checking payment status:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    getCSRFToken() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'csrftoken') {
                return value;
            }
        }
        return '';
    }

    formatAddress(address) {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    formatAmount(amount) {
        if (!amount) return '0';
        return parseFloat(amount).toFixed(4);
    }
}

// Initialize Web3 Payment when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.web3Payment = new Web3Payment();
});

