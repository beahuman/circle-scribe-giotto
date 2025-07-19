import { Purchases, PurchasesPackage, PurchasesOffering, CustomerInfo } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';

/**
 * Initialize RevenueCat with user ID
 */
export async function initializeRevenueCat(userId: string): Promise<void> {
  try {
    // Configure RevenueCat with API key (will need to be set from environment)
    await Purchases.configure({
      apiKey: '', // TODO: Add RevenueCat API key from environment
    });
    
    // Set the user ID for RevenueCat
    await Purchases.logIn({ appUserID: userId });
  } catch (error) {
    console.error('Failed to initialize RevenueCat:', error);
    throw error;
  }
}

/**
 * Fetch all available products/packages from RevenueCat
 */
export async function getAvailableProducts(): Promise<PurchasesPackage[]> {
  try {
    const offerings = await Purchases.getOfferings();
    
    if (!offerings.current) {
      console.warn('No current offering available');
      return [];
    }
    
    return offerings.current.availablePackages;
  } catch (error) {
    console.error('Failed to fetch available products:', error);
    throw error;
  }
}

/**
 * Begin the purchase flow using the selected product/package
 */
export async function startPurchase(packageIdentifier: string): Promise<CustomerInfo> {
  try {
    // Find the package by identifier
    const offerings = await Purchases.getOfferings();
    const packages = offerings.current?.availablePackages || [];
    const selectedPackage = packages.find(pkg => pkg.identifier === packageIdentifier);
    
    if (!selectedPackage) {
      throw new Error(`Package not found: ${packageIdentifier}`);
    }
    
    // Start the purchase
    const { customerInfo } = await Purchases.purchasePackage({ aPackage: selectedPackage });
    
    // After successful purchase, validate receipt and update subscription
    await validatePurchaseAndUpdateSubscription(selectedPackage, customerInfo);
    
    return customerInfo;
  } catch (error) {
    console.error('Purchase failed:', error);
    throw error;
  }
}

/**
 * Validate purchase receipt and update subscription in Supabase
 */
async function validatePurchaseAndUpdateSubscription(
  purchasedPackage: PurchasesPackage, 
  customerInfo: CustomerInfo
): Promise<void> {
  try {
    const platform = Capacitor.getPlatform();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    let validationResult;
    
    if (platform === 'ios') {
      // Extract iOS receipt data
      const latestTransaction = Object.values(customerInfo.entitlements.active)[0];
      if (!latestTransaction) {
        throw new Error('No active transaction found');
      }
      
      // Call Apple receipt validation
      const { data, error } = await supabase.functions.invoke('validate-apple-receipt', {
        body: {
          receiptData: latestTransaction.latestPurchaseDate, // This will need to be the actual receipt data
          password: '', // Optional shared secret
          isSandbox: true
        }
      });
      
      if (error) throw error;
      validationResult = data;
      
    } else if (platform === 'android') {
      // Extract Android purchase data
      const latestTransaction = Object.values(customerInfo.entitlements.active)[0];
      if (!latestTransaction) {
        throw new Error('No active transaction found');
      }
      
      // Call Google receipt validation
      const { data, error } = await supabase.functions.invoke('validate-google-receipt', {
        body: {
          packageName: 'your.app.package.name', // This should be dynamic
          subscriptionId: latestTransaction.productIdentifier,
          purchaseToken: latestTransaction.originalPurchaseDate // This will need to be the actual purchase token
        }
      });
      
      if (error) throw error;
      validationResult = data;
      
    } else {
      throw new Error(`Unsupported platform: ${platform}`);
    }
    
    // Check validation result
    if (!validationResult?.isValid) {
      throw new Error('Receipt validation failed');
    }
    
    // Check if subscription is still valid (not expired)
    const expiresAt = validationResult.expires || validationResult.expiryTime;
    if (expiresAt && new Date(expiresAt) <= new Date()) {
      throw new Error('Subscription has expired');
    }
    
    // Update subscription in Supabase subscribers table
    const { error: updateError } = await supabase
      .from('subscribers')
      .upsert({
        user_id: user.id,
        email: user.email || '',
        subscribed: true,
        subscription_tier: purchasedPackage.packageType || 'premium',
        subscription_end: expiresAt ? new Date(expiresAt).toISOString() : null,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });
    
    if (updateError) {
      console.error('Failed to update subscription:', updateError);
      throw updateError;
    }
    
    console.log('Purchase validated and subscription updated successfully');
    
  } catch (error) {
    console.error('Failed to validate purchase and update subscription:', error);
    // Don't throw here to avoid blocking the purchase flow
    // The purchase was successful, but validation/update failed
  }
}

/**
 * Restore any previous purchases for the current user
 */
export async function restorePurchases(): Promise<CustomerInfo> {
  try {
    const { customerInfo } = await Purchases.restorePurchases();
    return customerInfo;
  } catch (error) {
    console.error('Failed to restore purchases:', error);
    throw error;
  }
}

/**
 * Check current active entitlements from RevenueCat
 */
export async function getSubscriptionStatus(): Promise<CustomerInfo> {
  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error('Failed to get subscription status:', error);
    throw error;
  }
}

/**
 * Log out the current user from RevenueCat
 */
export async function logoutRevenueCat(): Promise<void> {
  try {
    await Purchases.logOut();
  } catch (error) {
    console.error('Failed to logout from RevenueCat:', error);
    throw error;
  }
}

/**
 * Check if user has active subscription for a specific entitlement
 */
export function hasActiveEntitlement(customerInfo: CustomerInfo, entitlementId: string): boolean {
  return customerInfo.entitlements.active[entitlementId]?.isActive || false;
}