export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function generateWhatsAppLink(phone, message) {
  // Ensure the phone number is correctly formatted
  // Remove all non-numeric characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Format to Moroccan international format if it starts with 06 or 07
  let internationalPhone = cleanPhone;
  if (cleanPhone.startsWith('06') || cleanPhone.startsWith('07')) {
    internationalPhone = '212' + cleanPhone.substring(1);
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${internationalPhone}?text=${encodedMessage}`;
}
