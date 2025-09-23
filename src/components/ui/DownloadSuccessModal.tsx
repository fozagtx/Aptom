"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface DownloadSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  downloadLink: string;
  productName?: string;
}

export function DownloadSuccessModal({
  isOpen,
  onClose,
  downloadLink,
  productName
}: DownloadSuccessModalProps) {
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // Reset confetti after animation
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(downloadLink);
      setCopied(true);
      toast({
        title: "Link Copied! 📋",
        description: "Download link copied to clipboard",
      });

      // Reset copied state after 3 seconds
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the link",
        variant: "destructive",
      });
    }
  };

  const openInNewTab = () => {
    window.open(downloadLink, '_blank', 'noopener,noreferrer');
  };

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
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full opacity-80"
                style={{
                  backgroundColor: ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6'][
                    Math.floor(Math.random() * 5)
                  ],
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal Content */}
      <Card className="relative z-10 w-full max-w-lg mx-4 transform transition-all duration-300 ease-out scale-100">
        <CardHeader className="text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <CardTitle className="text-2xl font-bold text-green-700">
            Woohoo! You did it!
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            {productName ? `Your "${productName}" is ready for download!` : "Your product is ready for download!"}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <div className="text-4xl mb-2">🚀</div>
            <p className="text-gray-700 font-medium">
              Here's your exclusive download link:
            </p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="download-link" className="text-sm font-medium text-gray-700">
              Download Link
            </Label>
            <div className="flex space-x-2">
              <Input
                id="download-link"
                value={downloadLink}
                readOnly
                className="font-mono text-sm bg-gray-50 border-gray-300"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                onClick={copyToClipboard}
                variant={copied ? "default" : "outline"}
                className={`min-w-[80px] transition-all duration-200 ${
                  copied
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "hover:bg-gray-50"
                }`}
              >
                {copied ? "✓ Copied!" : "📋 Copy"}
              </Button>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={openInNewTab}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              🔗 Open Link
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 hover:bg-gray-50"
            >
              ✨ Close
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
            <div className="font-medium text-yellow-800 mb-1">💡 Pro Tip</div>
            Save this link safely - you can access your purchase anytime from "My Purchases"
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
