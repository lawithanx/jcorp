"""
Web3 utilities for blockchain transaction verification
"""
import logging
from decimal import Decimal
from django.conf import settings
from web3 import Web3
from web3.exceptions import TransactionNotFound, BlockNotFound

logger = logging.getLogger(__name__)

def get_web3_connection():
    """Get Web3 connection to blockchain"""
    try:
        w3 = Web3(Web3.HTTPProvider(settings.RPC_URL))
        if not w3.is_connected():
            logger.error(f"Failed to connect to RPC: {settings.RPC_URL}")
            return None
        return w3
    except Exception as e:
        logger.error(f"Error connecting to Web3: {str(e)}")
        return None


def wei_to_eth(wei_amount):
    """Convert Wei to ETH"""
    return Web3.from_wei(wei_amount, 'ether')


def eth_to_wei(eth_amount):
    """Convert ETH to Wei"""
    return Web3.to_wei(eth_amount, 'ether')


def verify_transaction(transaction_hash, expected_to_address, expected_amount_eth):
    """
    Verify a blockchain transaction
    
    Args:
        transaction_hash: The transaction hash to verify
        expected_to_address: The expected recipient address
        expected_amount_eth: The expected amount in ETH
        
    Returns:
        dict with 'valid', 'confirmations', 'error' keys
    """
    w3 = get_web3_connection()
    if not w3:
        return {
            'valid': False,
            'confirmations': 0,
            'error': 'Failed to connect to blockchain'
        }
    
    try:
        # Get transaction receipt
        try:
            tx_receipt = w3.eth.get_transaction_receipt(transaction_hash)
        except TransactionNotFound:
            return {
                'valid': False,
                'confirmations': 0,
                'error': 'Transaction not found'
            }
        
        # Check if transaction succeeded
        if tx_receipt.status != 1:
            return {
                'valid': False,
                'confirmations': 0,
                'error': 'Transaction failed'
            }
        
        # Get transaction details
        tx = w3.eth.get_transaction(transaction_hash)
        
        # Verify recipient address (case-insensitive)
        tx_to = tx.to
        if tx_to and tx_to.lower() != expected_to_address.lower():
            return {
                'valid': False,
                'confirmations': 0,
                'error': f'Recipient address mismatch. Expected {expected_to_address}, got {tx_to}'
            }
        
        # Verify amount (allow small tolerance for gas)
        tx_value_eth = float(wei_to_eth(tx.value))
        expected_amount_float = float(expected_amount_eth)
        tolerance = 0.0001  # Allow 0.0001 ETH tolerance
        
        if abs(tx_value_eth - expected_amount_float) > tolerance:
            return {
                'valid': False,
                'confirmations': 0,
                'error': f'Amount mismatch. Expected {expected_amount_eth} ETH, got {tx_value_eth} ETH'
            }
        
        # Get current block number
        current_block = w3.eth.block_number
        
        # Calculate confirmations
        confirmations = current_block - tx_receipt.blockNumber
        
        # Check if we have enough confirmations
        required_confirmations = 3
        has_enough_confirmations = confirmations >= required_confirmations
        
        return {
            'valid': has_enough_confirmations,
            'confirmations': confirmations,
            'block_number': tx_receipt.blockNumber,
            'from_address': tx['from'],
            'to_address': str(tx_to),
            'amount_wei': tx.value,
            'amount_eth': tx_value_eth,
            'error': None if has_enough_confirmations else f'Waiting for confirmations ({confirmations}/{required_confirmations})'
        }
        
    except Exception as e:
        logger.error(f"Error verifying transaction {transaction_hash}: {str(e)}")
        return {
            'valid': False,
            'confirmations': 0,
            'error': f'Error verifying transaction: {str(e)}'
        }


def get_transaction_confirmations(transaction_hash):
    """Get current number of confirmations for a transaction"""
    w3 = get_web3_connection()
    if not w3:
        return 0
    
    try:
        tx_receipt = w3.eth.get_transaction_receipt(transaction_hash)
        current_block = w3.eth.block_number
        return current_block - tx_receipt.blockNumber
    except Exception as e:
        logger.error(f"Error getting confirmations for {transaction_hash}: {str(e)}")
        return 0

