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
 * @param {string} productName - Product name
 * @param {string} selectedWeight - Selected package size
 * @param {string|number} selectedPrice - Formatted or raw price
 * @returns {string} URL encoded WhatsApp chat link
 */
export function getWhatsAppProductUrl(productName, selectedWeight, selectedPrice) {
  let message;
  if (productName && selectedWeight && selectedPrice) {
    const formattedPrice = typeof selectedPrice === 'number' ? ('₹' + selectedPrice) : selectedPrice;
    message = 'Hello Andhra Avakaya! I would like more information about ' + productName + ', ' + selectedWeight + ', ' + formattedPrice + '.';
  } else if (productName) {
    message = 'Hello Andhra Avakaya! I would like more information about ' + productName + '.';
  } else {
    message = BUSINESS_CONFIG.defaultProductQuery;
  }
  return 'https://wa.me/' + BUSINESS_CONFIG.whatsappNumber + '?text=' + encodeURIComponent(message);
}

/**
 * Generate a WhatsApp Click-to-Chat URL for general enquiries
 * @param {string} customMessage - Optional custom message
 * @returns {string} URL encoded WhatsApp chat link
 */
export function getWhatsAppGeneralUrl(customMessage) {
  const message = customMessage || BUSINESS_CONFIG.generalEnquiryMessage;
  return 'https://wa.me/' + BUSINESS_CONFIG.whatsappNumber + '?text=' + encodeURIComponent(message);
}

/**
 * Generate a WhatsApp Click-to-Chat URL for a complete customer order
 * Formats customer details, each selected item with pack size, quantities, line totals,
 * subtotal, estimated total, customer notes, and a request to confirm stock availability
 * and delivery charges.
 *
 * @param {Object} orderData
 * @param {Object} orderData.customer - { name, phone, address, town, pincode, notes }
 * @param {Array} orderData.items - Array of items: [{ name, weight, price, quantity, lineTotal }]
 * @param {number} orderData.subtotal - Cart subtotal in INR
 * @param {number} orderData.total - Cart total in INR
 * @returns {string} URL-encoded official click-to-chat WhatsApp link
 */
export function getWhatsAppOrderUrl({ customer, items, subtotal }) {
  const formattedSubtotal = Number(subtotal || 0).toLocaleString('en-IN');

  const lines = [
    'NEW ORDER - ANDHRA AVAKAYA',
    '',
    '--------------------------------',
    '',
    'CUSTOMER DETAILS',
    `Name: ${customer.name ? customer.name.trim() : 'N/A'}`,
    `Phone: ${customer.phone ? customer.phone.trim() : 'N/A'}`,
    `Delivery Address: ${customer.address ? customer.address.trim() : 'N/A'}`,
    `Village / Town: ${customer.town ? customer.town.trim() : 'N/A'}`,
    `PIN Code: ${customer.pincode ? customer.pincode.trim() : 'N/A'}`,
    '',
    'ORDER ITEMS'
  ];

  items.forEach((item, index) => {
    const itemPrice = Number(item.price || 0);
    const itemQty = Number(item.quantity || 1);
    const itemTotal = (itemPrice * itemQty).toLocaleString('en-IN');
    lines.push(`${index + 1}. ${item.name} (${item.weight})`);
    lines.push(`   Quantity: ${itemQty} x Rs. ${itemPrice.toLocaleString('en-IN')} = Rs. ${itemTotal}`);
  });

  lines.push('');
  lines.push('PRICE BREAKDOWN');
  lines.push(`Subtotal: Rs. ${formattedSubtotal}`);
  lines.push('Delivery Charges: To be confirmed according to delivery area/range');
  lines.push(`Estimated Total: Rs. ${formattedSubtotal} + delivery charges (to be confirmed)`);
  lines.push('');
  lines.push('ORDER NOTES');
  lines.push(customer.notes && customer.notes.trim() ? customer.notes.trim() : 'None');
  lines.push('');
  lines.push('DELIVERY CONFIRMATION');
  lines.push('Our team will confirm whether delivery is available to your area, the applicable delivery charges, and the final payable amount. We will reply to you on WhatsApp.');
  lines.push('');
  lines.push('--------------------------------');
  lines.push('Order enquiry created via Andhra Avakaya Web Store');

  const fullMessage = lines.join('\n');
  return `https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${encodeURIComponent(fullMessage)}`;
}

