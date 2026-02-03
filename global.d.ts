// Global type declarations

// Meta Pixel (Facebook Pixel)
declare global {
  interface Window {
    fbq: (
      action: 'track' | 'trackCustom' | 'init',
      event: string,
      params?: {
        currency?: string;
        value?: number;
        content_name?: string;
        content_type?: string;
        [key: string]: any;
      }
    ) => void;
    _fbq: any;
  }
}

export {}
