import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AppleReceiptValidationRequest {
  receiptData: string;
  password?: string; // App-specific shared secret for auto-renewable subscriptions
  excludeOldTransactions?: boolean;
}

interface AppleReceiptValidationResponse {
  status: number;
  environment: string;
  receipt?: any;
  latest_receipt_info?: any[];
  pending_renewal_info?: any[];
  is_retryable?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { receiptData, password, excludeOldTransactions = false } = await req.json() as AppleReceiptValidationRequest;

    if (!receiptData) {
      return new Response(
        JSON.stringify({ error: 'Receipt data is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Validating Apple receipt...');

    // Prepare validation payload
    const validationPayload = {
      'receipt-data': receiptData,
      'exclude-old-transactions': excludeOldTransactions,
      ...(password && { 'password': password })
    };

    // Try production first, then sandbox if needed
    let validationResponse: AppleReceiptValidationResponse;
    
    // Production validation
    const prodResponse = await fetch('https://buy.itunes.apple.com/verifyReceipt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validationPayload),
    });

    validationResponse = await prodResponse.json();

    // If production returns sandbox receipt error (21007), try sandbox
    if (validationResponse.status === 21007) {
      console.log('Receipt is from sandbox environment, retrying with sandbox URL...');
      
      const sandboxResponse = await fetch('https://sandbox.itunes.apple.com/verifyReceipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validationPayload),
      });

      validationResponse = await sandboxResponse.json();
    }

    console.log('Apple validation response status:', validationResponse.status);

    // Check validation status
    if (validationResponse.status !== 0) {
      const errorMessages: { [key: number]: string } = {
        21000: 'The App Store could not read the JSON object you provided.',
        21002: 'The data in the receipt-data property was malformed or missing.',
        21003: 'The receipt could not be authenticated.',
        21004: 'The shared secret you provided does not match the shared secret on file for your account.',
        21005: 'The receipt server is not currently available.',
        21006: 'This receipt is valid but the subscription has expired.',
        21007: 'This receipt is from the sandbox environment.',
        21008: 'This receipt is from the production environment.',
        21010: 'This receipt could not be authorized.',
      };

      const errorMessage = errorMessages[validationResponse.status] || `Unknown validation error: ${validationResponse.status}`;
      
      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          status: validationResponse.status,
          isRetryable: validationResponse.is_retryable || false
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse and return validation results
    const result = {
      isValid: true,
      environment: validationResponse.environment,
      receipt: validationResponse.receipt,
      latestReceiptInfo: validationResponse.latest_receipt_info || [],
      pendingRenewalInfo: validationResponse.pending_renewal_info || [],
      validatedAt: new Date().toISOString()
    };

    console.log('Apple receipt validation successful');

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error validating Apple receipt:', error);
    
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