// src/providers/payment/paypal-payment/index.ts

interface PayPalOptions {
    client_id: string
    client_secret: string
    sandbox?: boolean
    auth_webhook_id?: string
  }
  
  interface PayPalOrderResponse {
    id: string
    status: string
    links: Array<{
      href: string
      rel: string
      method: string
    }>
  }
  
  class PayPalPaymentProvider {
    static identifier = "paypal"
    
    protected options_: PayPalOptions
    private paypalApiUrl: string
  
    constructor(
      container: any,
      options: PayPalOptions
    ) {
      this.options_ = options
      this.paypalApiUrl = options.sandbox 
        ? "https://api.sandbox.paypal.com"
        : "https://api.paypal.com"
    }
  
    static validateOptions(options: PayPalOptions): void {
      if (!options.client_id) {
        throw new Error("PayPal client_id is required")
      }
      if (!options.client_secret) {
        throw new Error("PayPal client_secret is required")
      }
    }
  
    async getPaymentStatus(input: any): Promise<any> {
      const orderId = input.data?.paypal_order_id as string
      
      if (!orderId) {
        return { status: "pending" }
      }
  
      try {
        const accessToken = await this.getAccessToken()
        const order = await this.getOrder(orderId, accessToken)
        
        switch (order.status) {
          case "APPROVED":
            return { status: "authorized" }
          case "COMPLETED":
            return { status: "captured" }
          case "CANCELLED":
            return { status: "canceled" }
          default:
            return { status: "pending" }
        }
      } catch (error: any) {
        console.error(`PayPal getPaymentStatus error: ${error.message}`)
        return { status: "error" }
      }
    }
  
    async initiatePayment(input: any): Promise<any> {
      try {
        const { amount, currency_code, resource_id } = input.context
        
        const accessToken = await this.getAccessToken()
        const order = await this.createOrder({
          amount: (amount / 100).toFixed(2), // Convert from cents
          currency: currency_code.toUpperCase(),
          reference_id: resource_id,
        }, accessToken)
  
        return {
          data: {
            paypal_order_id: order.id,
            amount,
            currency_code,
          },
        }
      } catch (error: any) {
        console.error(`PayPal initiatePayment error: ${error.message}`)
        return {
          error: {
            error: error.message,
            code: "paypal_error",
            detail: error,
          }
        }
      }
    }
  
    async authorizePayment(input: any): Promise<any> {
      try {
        const orderId = input.data?.paypal_order_id as string
        const accessToken = await this.getAccessToken()
        
        // Get order status to verify it's approved
        const order = await this.getOrder(orderId, accessToken)
        
        if (order.status !== "APPROVED") {
          return {
            error: {
              error: "Payment not approved by customer",
              code: "paypal_not_approved",
            }
          }
        }
  
        return {
          status: "authorized",
          data: {
            ...input.data,
            paypal_status: order.status,
            authorized: true,
          },
        }
      } catch (error: any) {
        console.error(`PayPal authorizePayment error: ${error.message}`)
        return {
          error: {
            error: error.message,
            code: "paypal_authorization_error",
            detail: error,
          }
        }
      }
    }
  
    async cancelPayment(input: any): Promise<any> {
      // PayPal orders expire automatically, but we can mark as cancelled
      return {
        data: {
          ...input.data,
          cancelled: true,
        }
      }
    }
  
    async capturePayment(input: any): Promise<any> {
      try {
        const orderId = input.data?.paypal_order_id as string
        const accessToken = await this.getAccessToken()
        
        const captureResponse = await this.captureOrder(orderId, accessToken)
        
        return {
          data: {
            ...input.data,
            paypal_capture_id: captureResponse.id,
            captured: true,
          }
        }
      } catch (error: any) {
        console.error(`PayPal capturePayment error: ${error.message}`)
        return {
          error: {
            error: error.message,
            code: "paypal_capture_error",
            detail: error,
          }
        }
      }
    }
  
    async deletePayment(input: any): Promise<any> {
      return this.cancelPayment(input)
    }
  
    async getWebhookActionAndData(input: any): Promise<any> {
      const webhookData = input.data
      return {
        action: webhookData.event_type as string,
        data: webhookData,
      }
    }
  
    async refundPayment(input: any): Promise<any> {
      try {
        const captureId = input.data?.paypal_capture_id as string
        const accessToken = await this.getAccessToken()
        
        const refundResponse = await this.refundCapture(
          captureId, 
          {
            amount: (input.amount / 100).toFixed(2),
            currency: input.data?.currency_code as string
          },
          accessToken
        )
        
        return {
          data: {
            ...input.data,
            refund_id: refundResponse.id,
            refunded_amount: input.amount,
          }
        }
      } catch (error: any) {
        console.error(`PayPal refundPayment error: ${error.message}`)
        return {
          error: {
            error: error.message,
            code: "paypal_refund_error",
            detail: error,
          }
        }
      }
    }
  
    async retrievePayment(input: any): Promise<any> {
      return {
        data: input.data
      }
    }
  
    async updatePayment(input: any): Promise<any> {
      try {
        const { amount, currency_code, resource_id } = input.context
        
        // For PayPal, we might need to create a new order if amount changes significantly
        const accessToken = await this.getAccessToken()
        const order = await this.createOrder({
          amount: (amount / 100).toFixed(2),
          currency: currency_code.toUpperCase(),
          reference_id: resource_id,
        }, accessToken)
  
        return {
          data: {
            paypal_order_id: order.id,
            amount,
            currency_code,
          },
        }
      } catch (error: any) {
        console.error(`PayPal updatePayment error: ${error.message}`)
        return {
          error: {
            error: error.message,
            code: "paypal_update_error",
            detail: error,
          }
        }
      }
    }
  
    // Private helper methods
    private async getAccessToken(): Promise<string> {
      const auth = Buffer.from(
        `${this.options_.client_id}:${this.options_.client_secret}`
      ).toString("base64")
  
      const response = await fetch(`${this.paypalApiUrl}/v1/oauth2/token`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      })
  
      const data = await response.json()
      return data.access_token
    }
  
    private async createOrder(
      orderData: {
        amount: string
        currency: string
        reference_id: string
      },
      accessToken: string
    ): Promise<PayPalOrderResponse> {
      const response = await fetch(`${this.paypalApiUrl}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              reference_id: orderData.reference_id,
              amount: {
                currency_code: orderData.currency,
                value: orderData.amount,
              },
            },
          ],
        }),
      })
  
      return await response.json()
    }
  
    private async getOrder(orderId: string, accessToken: string): Promise<any> {
      const response = await fetch(`${this.paypalApiUrl}/v2/checkout/orders/${orderId}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      })
  
      return await response.json()
    }
  
    private async captureOrder(orderId: string, accessToken: string): Promise<any> {
      const response = await fetch(`${this.paypalApiUrl}/v2/checkout/orders/${orderId}/capture`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
  
      return await response.json()
    }
  
    private async refundCapture(
      captureId: string,
      refundData: { amount: string; currency: string },
      accessToken: string
    ): Promise<any> {
      const response = await fetch(`${this.paypalApiUrl}/v2/payments/captures/${captureId}/refund`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: {
            value: refundData.amount,
            currency_code: refundData.currency,
          },
        }),
      })
  
      return await response.json()
    }
  }
  
  export default PayPalPaymentProvider