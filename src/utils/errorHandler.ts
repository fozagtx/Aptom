export interface SmartContractError {
  code: string;
  message: string;
  type: 'NETWORK' | 'CONTRACT' | 'WALLET' | 'VALIDATION' | 'UNKNOWN';
}

export function parseSmartContractError(error: any): SmartContractError {
  const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';

  // Network errors
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Network connection error. Please check your internet connection.',
      type: 'NETWORK'
    };
  }

  // Wallet errors
  if (errorMessage.includes('wallet') || errorMessage.includes('signature')) {
    return {
      code: 'WALLET_ERROR',
      message: 'Wallet error. Please ensure your wallet is connected and has sufficient funds.',
      type: 'WALLET'
    };
  }

  // Contract errors
  if (errorMessage.includes('EPRODUCT_NOT_FOUND')) {
    return {
      code: 'PRODUCT_NOT_FOUND',
      message: 'Product not found. It may have been removed.',
      type: 'CONTRACT'
    };
  }

  if (errorMessage.includes('EINSUFFICIENT_BALANCE')) {
    return {
      code: 'INSUFFICIENT_BALANCE',
      message: 'Insufficient APT balance to complete this transaction.',
      type: 'CONTRACT'
    };
  }

  if (errorMessage.includes('EPRODUCT_NOT_AVAILABLE')) {
    return {
      code: 'PRODUCT_UNAVAILABLE',
      message: 'This product is currently unavailable for purchase.',
      type: 'CONTRACT'
    };
  }

  if (errorMessage.includes('EALREADY_PURCHASED')) {
    return {
      code: 'ALREADY_PURCHASED',
      message: 'You have already purchased this product.',
      type: 'CONTRACT'
    };
  }

  if (errorMessage.includes('EUNAUTHORIZED')) {
    return {
      code: 'UNAUTHORIZED',
      message: 'You are not authorized to perform this action.',
      type: 'CONTRACT'
    };
  }

  // Module not found - likely deployment issue
  if (errorMessage.includes('MODULE_NOT_FOUND') || errorMessage.includes('FUNCTION_NOT_FOUND')) {
    return {
      code: 'CONTRACT_NOT_DEPLOYED',
      message: 'Smart contract not found. Please check the contract address.',
      type: 'CONTRACT'
    };
  }

  // Default error
  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred. Please try again.',
    type: 'UNKNOWN'
  };
}

export function getErrorMessage(error: any): string {
  const parsedError = parseSmartContractError(error);
  return parsedError.message;
}
