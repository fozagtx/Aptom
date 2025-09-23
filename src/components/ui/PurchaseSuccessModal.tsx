"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PurchaseSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  price: string;
}

export function PurchaseSuccessModal({
  isOpen,
  onClose,
  productName,
  price
}: PurchaseSuccessModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // Auto-close after 4 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][
                    Math.floor(Math.random() * 5)
                  ],
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal Content */}
      <Card className="relative z-10 w-full max-w-md mx-4 transform transition-all duration-500 ease-out scale-100 animate-pulse">
        <CardHeader className="text-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
          <div className="text-7xl mb-4 animate-bounce">🎉</div>
          <CardTitle className="text-2xl font-bold text-green-700">
            Purchase Successful!
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            You've successfully purchased "{productName}"!
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 text-center space-y-4">
          <div className="bg-green-100 p-4 rounded-lg border-l-4 border-green-500">
            <div className="text-green-800 font-semibold">
              💰 Paid: {price} APT
            </div>
            <div className="text-green-600 text-sm mt-1">
              Transaction confirmed on blockchain ✅
            </div>
          </div>

          <div className="text-gray-600">
            🎁 Your digital product is now available in "My Purchases"!
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            🚀 Continue Shopping
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
