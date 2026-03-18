/**
 * @file whatsapp.js
 * @description Utility for generating WhatsApp message links for order notifications.
 */

export const WHATSAPP_TEMPLATES = {
    welcome: "Hi {customer}, thank you for shopping at {shopName}! Your order #{orderId} is confirmed. Total: {total}. We will notify you when it's ready.",
    ready: "Hi {customer}, your order #{orderId} is ready for pickup at {shopName}. We look forward to seeing you!"
};

/**
 * Formats a message template with order data.
 * @param {string} template - The message template.
 * @param {object} data - Data to inject into the template.
 * @returns {string} The formatted message.
 */
export function formatWhatsAppMessage(template, data) {
    if (!template) return "";
    let message = template;
    const placeholders = {
        "{customer}": data.customerName || data.customer || "Customer",
        "{orderId}": data.localId || data.id || "N/A",
        "{shopName}": data.shopName || "Our Shop",
        "{total}": data.total || data.amount || "0.00",
        "{balance}": data.balance || "0.00"
    };

    for (const [key, value] of Object.entries(placeholders)) {
        message = message.replace(new RegExp(key, "g"), value);
    }
    return message;
}

/**
 * Generates a WhatsApp wa.me URL.
 * @param {string} phone - The customer's phone number.
 * @param {string} message - The message to pre-fill.
 * @returns {string} The WhatsApp URL.
 */
export function getWhatsAppUrl(phone, message) {
    if (!phone) return null;
    // Clean phone number: remove non-numeric characters except +
    const cleanPhone = phone.replace(/[^\d+]/g, "");
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
