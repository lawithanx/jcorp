"""
API views for Web3 payment verification
"""
import secrets
import logging
from decimal import Decimal
from datetime import timedelta
from django.utils import timezone
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.conf import settings
from .models import Payment
from .web3_utils import verify_transaction, wei_to_eth

logger = logging.getLogger(__name__)


@csrf_exempt
@require_http_methods(["POST"])
def verify_payment(request):
    """
    Verify a blockchain payment transaction
    
    Expected POST data:
    {
        "transaction_hash": "0x...",
        "from_address": "0x..."
    }
    """
    try:
        import json
        data = json.loads(request.body)
        transaction_hash = data.get('transaction_hash', '').strip()
        from_address = data.get('from_address', '').strip()
        
        if not transaction_hash:
            return JsonResponse({
                'success': False,
                'error': 'Transaction hash is required'
            }, status=400)
        
        if not from_address:
            return JsonResponse({
                'success': False,
                'error': 'From address is required'
            }, status=400)
        
        # Normalize transaction hash (ensure it starts with 0x)
        if not transaction_hash.startswith('0x'):
            transaction_hash = '0x' + transaction_hash
        
        # Normalize addresses (lowercase for consistency)
        from_address = from_address.lower() if from_address.startswith('0x') else from_address
        wallet_address = settings.WALLET_ADDRESS.lower() if settings.WALLET_ADDRESS.startswith('0x') else settings.WALLET_ADDRESS
        
        # Check if payment already exists
        payment, created = Payment.objects.get_or_create(
            transaction_hash=transaction_hash,
            defaults={
                'from_address': from_address,
                'to_address': wallet_address,
                'status': 'pending',
                'amount_eth': settings.PAYMENT_AMOUNT_ETH,
            }
        )
        
        # Verify transaction on blockchain
        verification_result = verify_transaction(
            transaction_hash=transaction_hash,
            expected_to_address=wallet_address,
            expected_amount_eth=settings.PAYMENT_AMOUNT_ETH
        )
        
        # Update payment record
        payment.from_address = from_address
        payment.amount_wei = verification_result.get('amount_wei', 0)
        payment.amount_eth = Decimal(str(verification_result.get('amount_eth', 0)))
        payment.confirmations = verification_result.get('confirmations', 0)
        
        if verification_result['valid']:
            payment.status = 'confirmed'
            payment.verified_at = timezone.now()
            
            # Generate download token if not exists
            if not payment.download_token:
                payment.download_token = secrets.token_urlsafe(32)
                payment.download_expires_at = timezone.now() + timedelta(hours=settings.PAYMENT_EXPIRY_HOURS)
            
            payment.save()
            
            logger.info(f"Payment verified: {transaction_hash} from {from_address}")
            
            return JsonResponse({
                'success': True,
                'status': 'confirmed',
                'confirmations': payment.confirmations,
                'download_token': payment.download_token,
                'download_url': f'/api/download/{payment.download_token}/',
                'message': 'Payment verified successfully'
            })
        else:
            # Update status based on confirmations
            if payment.confirmations > 0:
                payment.status = 'processing'
            else:
                payment.status = 'pending'
            
            payment.save()
            
            return JsonResponse({
                'success': False,
                'status': payment.status,
                'confirmations': payment.confirmations,
                'required_confirmations': payment.required_confirmations,
                'error': verification_result.get('error', 'Transaction verification failed'),
                'message': f'Transaction found but waiting for confirmations ({payment.confirmations}/{payment.required_confirmations})'
            })
            
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        logger.error(f"Error verifying payment: {str(e)}")
        return JsonResponse({
            'success': False,
            'error': f'Server error: {str(e)}'
        }, status=500)


@require_http_methods(["GET"])
def get_payment_info(request):
    """
    Get payment information (wallet address, amount, etc.)
    """
    return JsonResponse({
        'success': True,
        'wallet_address': settings.WALLET_ADDRESS,
        'amount_eth': settings.PAYMENT_AMOUNT_ETH,
        'chain_id': settings.CHAIN_ID,
        'network': 'Ethereum Mainnet' if settings.CHAIN_ID == 1 else f'Chain ID {settings.CHAIN_ID}'
    })


@require_http_methods(["GET"])
def download_business_card(request, token):
    """
    Download business card after payment verification
    """
    try:
        payment = Payment.objects.get(download_token=token)
        
        # Verify payment is valid and download is still valid
        if not payment.is_download_valid():
            return JsonResponse({
                'success': False,
                'error': 'Download link expired or payment not verified'
            }, status=403)
        
        # For now, trigger the download from the 3D card
        # In production, you might want to generate a PDF or high-res image
        return JsonResponse({
            'success': True,
            'message': 'Payment verified. You can now download your business card.',
            'download_available': True
        })
        
    except Payment.DoesNotExist:
        return JsonResponse({
            'success': False,
            'error': 'Invalid download token'
        }, status=404)
    except Exception as e:
        logger.error(f"Error downloading business card: {str(e)}")
        return JsonResponse({
            'success': False,
            'error': 'Server error'
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def process_fiat_payment(request):
    """
    Process fiat payment (credit card, etc.)
    
    Expected POST data:
    {
        "amount": 50.00,
        "currency": "USD",
        "card_number": "...",
        "expiry": "...",
        "cvv": "...",
        "cardholder_name": "..."
    }
    
    TODO: Integrate with payment gateway (Stripe, PayPal, etc.)
    """
    try:
        import json
        
        data = json.loads(request.body)
        amount = Decimal(str(data.get('amount', 0)))
        currency = data.get('currency', 'USD')
        
        if amount <= 0:
            return JsonResponse({
                'success': False,
                'error': 'Invalid amount'
            }, status=400)
        
        # TODO: Process payment through payment gateway
        # For now, this is a placeholder that simulates successful payment
        
        # Generate download token (similar to Web3 payment)
        download_token = secrets.token_urlsafe(32)
        download_expires_at = timezone.now() + timedelta(hours=settings.PAYMENT_EXPIRY_HOURS)
        
        # Create payment record
        payment = Payment.objects.create(
            from_address=f"fiat_{request.META.get('REMOTE_ADDR', 'unknown')}",
            to_address="fiat_payment",
            amount_eth=Decimal(str(amount / 100)),  # Convert USD to ETH equivalent (placeholder)
            amount_wei=0,
            status='confirmed',
            transaction_hash=f"fiat_{secrets.token_hex(16)}",
            download_token=download_token,
            download_expires_at=download_expires_at,
            verified_at=timezone.now(),
            confirmations=1,
        )
        
        logger.info(f"Fiat payment processed: ${amount} {currency} - Token: {download_token}")
        
        return JsonResponse({
            'success': True,
            'status': 'confirmed',
            'amount': float(amount),
            'currency': currency,
            'download_token': download_token,
            'download_url': f'/api/download/{download_token}/',
            'message': 'Payment processed successfully'
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        logger.error(f"Error processing fiat payment: {str(e)}")
        return JsonResponse({
            'success': False,
            'error': f'Server error: {str(e)}'
        }, status=500)

