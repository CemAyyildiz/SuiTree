import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Modal } from './ui/modal';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID } from '../constants';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: {
    label: string;
    url: string;
    price: string;
  };
  profileId: string; // Profile object ID for the transaction
  linkIndex: number; // Index of the link in the profile
  onPaymentSuccess: (linkUrl: string) => void;
  onPaymentError: (error: string) => void;
}

type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  link,
  profileId,
  linkIndex,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const formatPrice = (priceInMist: string) => {
    const mist = parseInt(priceInMist);
    const sui = mist / 1000000000;
    return sui.toFixed(4);
  };

  const handlePayment = async () => {
    if (!account?.address) {
      setPaymentStatus('error');
      setErrorMessage('Please connect your wallet first');
      return;
    }

    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      const txb = new Transaction();
      
      // Convert price to MIST (1 SUI = 1,000,000,000 MIST)
      const priceInMist = parseInt(link.price);
      
      // Split coins for payment
      const [coin] = txb.splitCoins(txb.gas, [priceInMist]);
      
      // Call the pay_for_link_access function
      txb.moveCall({
        target: `${PACKAGE_ID}::contrat::pay_for_link_access`,
        arguments: [
          txb.object(profileId), // Profile object
          txb.pure.u64(linkIndex),   // Link index
          coin,                  // Payment coin
        ],
      });

      // Execute the transaction with callbacks
      signAndExecuteTransaction(
        { transaction: txb },
        {
          onSuccess: async (result) => {
            try {
              // Wait for transaction to be confirmed on blockchain
              if (result.digest) {
                await suiClient.waitForTransaction({
                  digest: result.digest,
                  options: {
                    showEffects: true,
                    showEvents: true,
                  },
                });

                // Check if transaction was successful
                const txDetails = await suiClient.getTransactionBlock({
                  digest: result.digest,
                  options: {
                    showEffects: true,
                    showEvents: true,
                  },
                });

                // Verify transaction was successful
                if (txDetails.effects?.status?.status === 'success') {
                  setPaymentStatus('success');
                  setTimeout(() => {
                    onPaymentSuccess(link.url);
                    onClose();
                    setPaymentStatus('idle');
                  }, 1500);
                } else {
                  throw new Error('Transaction failed on blockchain');
                }
              } else {
                throw new Error('No transaction digest received');
              }
            } catch (waitError) {
              console.error('Transaction confirmation error:', waitError);
              setPaymentStatus('error');
              setErrorMessage('Transaction confirmation failed. Please try again.');
              onPaymentError('Transaction confirmation failed');
            }
          },
          onError: (error) => {
            console.error('Payment error:', error);
            setPaymentStatus('error');
            
            // Parse error message
            let errorMsg = 'Payment failed. Please try again.';
            if (error.message?.includes('InsufficientBalance')) {
              errorMsg = 'Insufficient SUI balance for this payment.';
            } else if (error.message?.includes('UserRejected')) {
              errorMsg = 'Transaction was rejected by user.';
            } else if (error.message?.includes('InsufficientPayment')) {
              errorMsg = 'Payment amount is insufficient.';
            } else if (error.message) {
              errorMsg = error.message;
            }
            
            setErrorMessage(errorMsg);
            onPaymentError(errorMsg);
          },
        }
      );
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      setErrorMessage('Payment failed. Please try again.');
      onPaymentError('Payment failed');
    }
  };

  const handleClose = () => {
    if (paymentStatus === 'processing') return;
    onClose();
    setPaymentStatus('idle');
    setErrorMessage('');
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="relative">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-[#E4E4E7]">
                Premium Link Access
              </CardTitle>
              {paymentStatus !== 'processing' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Link Info */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-br from-[#4B9EFF] to-[#3B82F6] rounded-full flex items-center justify-center mx-auto">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-[#E4E4E7]">
                  {link.label}
                </h3>
                <p className="text-sm text-gray-600 dark:text-[#A1A1AA]">
                  Premium content access
                </p>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gray-50 dark:bg-[#1F2937] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-[#E4E4E7]">
                {formatPrice(link.price)} SUI
              </div>
              <div className="text-sm text-gray-600 dark:text-[#A1A1AA]">
                One-time payment
              </div>
            </div>

            {/* Payment Status */}
            <AnimatePresence mode="wait">
              {paymentStatus === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="text-center text-sm text-gray-600 dark:text-[#A1A1AA]">
                    Click "Pay Now" to access this premium link
                  </div>
                  <Button
                    onClick={handlePayment}
                    className="w-full"
                    size="lg"
                    leftIcon={<CreditCard className="h-5 w-5" />}
                  >
                    Pay Now
                  </Button>
                </motion.div>
              )}

              {paymentStatus === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center space-y-4"
                >
                  <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-[#4B9EFF]" />
                  </div>
                  <div className="text-sm text-gray-600 dark:text-[#A1A1AA]">
                    Processing payment...
                  </div>
                </motion.div>
              )}

              {paymentStatus === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center space-y-4"
                >
                  <div className="flex justify-center">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Payment successful! Redirecting...
                  </div>
                </motion.div>
              )}

              {paymentStatus === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center space-y-4"
                >
                  <div className="flex justify-center">
                    <AlertCircle className="h-12 w-12 text-red-500" />
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-400 font-medium">
                    {errorMessage}
                  </div>
                  <Button
                    onClick={() => setPaymentStatus('idle')}
                    variant="outline"
                    className="w-full"
                  >
                    Try Again
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Security Note */}
            <div className="text-xs text-gray-500 dark:text-[#71717A] text-center">
              🔒 Secure payment powered by Sui blockchain
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Modal>
  );
};