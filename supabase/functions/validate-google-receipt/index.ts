import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GoogleReceiptValidationRequest {
  packageName: string;
  subscriptionId: string;
  purchaseToken: string;
}

interface GoogleSubscriptionValidationResponse {
  kind: string;
  startTimeMillis: string;
  expiryTimeMillis: string;
  autoRenewing: boolean;
  priceCurrencyCode: string;
  priceAmountMicros: string;
  countryCode: string;
  developerPayload: string;
  paymentState: number;
  cancelReason?: number;
  userCancellationTimeMillis?: string;
  cancelSurveyResult?: any;
  orderId: string;
  purchaseType?: number;
  acknowledgementState: number;
  externalAccountId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { packageName, subscriptionId, purchaseToken } = await req.json() as GoogleReceiptValidationRequest;

    if (!packageName || !subscriptionId || !purchaseToken) {
      return new Response(
        JSON.stringify({ error: 'Package name, subscription ID, and purchase token are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Validating Google Play subscription...');

    // Get Google service account credentials from environment
    const googleServiceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');
    
    if (!googleServiceAccountKey) {
      console.error('Google service account key not configured');
      return new Response(
        JSON.stringify({ error: 'Google service account not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse service account credentials
    const serviceAccount = JSON.parse(googleServiceAccountKey);

    // Generate JWT for Google API authentication
    const header = {
      alg: 'RS256',
      typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: serviceAccount.client_email,
      scope: 'https://www.googleapis.com/auth/androidpublisher',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600 // 1 hour
    };

    // Import the private key
    const privateKeyPem = serviceAccount.private_key.replace(/\\n/g, '\n');
    const privateKeyDer = await crypto.subtle.importKey(
      'pkcs8',
      new TextEncoder().encode(privateKeyPem.replace('-----BEGIN PRIVATE KEY-----', '').replace('-----END PRIVATE KEY-----', '').replace(/\s/g, '')),
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
      },
      false,
      ['sign']
    );

    // Create JWT
    const encodedHeader = btoa(JSON.stringify(header)).replace(/[+/]/g, c => c === '+' ? '-' : '_').replace(/=/g, '');
    const encodedPayload = btoa(JSON.stringify(payload)).replace(/[+/]/g, c => c === '+' ? '-' : '_').replace(/=/g, '');
    const data = `${encodedHeader}.${encodedPayload}`;
    
    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      privateKeyDer,
      new TextEncoder().encode(data)
    );

    const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
      .replace(/[+/]/g, c => c === '+' ? '-' : '_')
      .replace(/=/g, '');

    const jwt = `${data}.${encodedSignature}`;

    // Exchange JWT for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt
      })
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      console.error('Failed to get Google access token:', tokenData);
      return new Response(
        JSON.stringify({ error: 'Failed to authenticate with Google Play' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate the subscription with Google Play API
    const playApiUrl = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/subscriptions/${subscriptionId}/tokens/${purchaseToken}`;
    
    const validationResponse = await fetch(playApiUrl, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!validationResponse.ok) {
      const errorText = await validationResponse.text();
      console.error('Google Play validation failed:', validationResponse.status, errorText);
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to validate subscription with Google Play',
          status: validationResponse.status,
          details: errorText
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const subscriptionData: GoogleSubscriptionValidationResponse = await validationResponse.json();

    console.log('Google Play validation successful');

    // Parse and return validation results
    const result = {
      isValid: true,
      subscriptionData,
      isActive: subscriptionData.paymentState === 1, // 1 = Payment received
      isAutoRenewing: subscriptionData.autoRenewing,
      expiryTime: new Date(parseInt(subscriptionData.expiryTimeMillis)),
      startTime: new Date(parseInt(subscriptionData.startTimeMillis)),
      orderId: subscriptionData.orderId,
      acknowledgementState: subscriptionData.acknowledgementState,
      validatedAt: new Date().toISOString()
    };

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error validating Google receipt:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error during receipt validation',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});