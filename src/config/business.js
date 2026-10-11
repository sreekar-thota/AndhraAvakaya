/**
 * Andhra Avakaya - Central Business Configuration
 * 
 * IMPORTANT:
 * - Update `WHATSAPP_NUMBER` with your verified WhatsApp business phone number.
 * - Format: International digits ONLY, without '+', spaces, dashes or parentheses.
 *   Format: "919182475446" for India (+91)
 * - All enquiry buttons across the website use this single source of truth.
 */

// Central verified phone number: +91 9182475446
export const WHATSAPP_NUMBER = "919182475446";

export const BUSINESS_CONFIG = {
  brandName: "Andhra Avakaya",
  tagline: "The Authentic Taste of Andhra",
  subtitle: "Traditional Andhra Pradesh Homemade Pickles",
  whatsappNumber: WHATSAPP_NUMBER,
  displayPhone: "+91 9182475446",
  
  // Brand Logo Path - official business logo
  logoSrc: "/images/andhra_avakaya_logo.jpg",
  
  // Business identity & editable details (no invented addresses or fictitious claims)
  location: "Andhra Pradesh, India",
  operatingHours: "Enquiries & Orders: 9:00 AM – 8:00 PM IST",
  
  // Default WhatsApp messages
  defaultProductQuery: "Can I get more info about this product?",
  generalEnquiryMessage: "Hello Andhra Avakaya! I would like to enquire about your authentic homemade pickles.",
  bulkOrderMessage: "Hello Andhra Avakaya! I would like to enquire about placing a custom/bulk order.",

  // Highlights & values
  highlights: [
    {
      title: "Authentic Andhra Heritage",
      description: "Rooted in time-honoured Andhra culinary traditions and authentic heirloom recipes.",
    },
    {
      title: "Handpicked Ingredients",
      description: "Made with crisp raw mangoes, fiery Guntur chillies, and cold-pressed sesame oil.",
    },
    {
      title: "Homemade Preparation",
      description: "Small-batch preparation preserving the signature texture, aroma, and natural flavour.",
    },
    {
      title: "No Artificial Preservatives",
      description: "Naturally matured in traditional ceramic Bharani jars for wholesome taste.",
    }
  ]
};

/**
 * Generate a WhatsApp Click-to-Chat URL
 * @param {string} productName - Optional product name
 * @param {string} customQuery - Optional custom query prefix
 * @returns {string} URL encoded WhatsApp chat link
 */
export function getWhatsAppProductUrl(productName, customQuery) {
  const query = customQuery || BUSINESS_CONFIG.defaultProductQuery;
  const message = productName ? `${query} Product: ${productName}.` : query;
  return `https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate a WhatsApp Click-to-Chat URL for general enquiries
 * @param {string} customMessage - Optional custom message
 * @returns {string} URL encoded WhatsApp chat link
 */
export function getWhatsAppGeneralUrl(customMessage) {
  const message = customMessage || BUSINESS_CONFIG.generalEnquiryMessage;
  return `https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
