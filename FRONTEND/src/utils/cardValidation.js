/**
 * Algoritmo de Luhn para validación de números de tarjeta de crédito
 * @param {string} cardNumber - Número de tarjeta sin espacios
 * @returns {boolean} - true si es válido, false si no
 */
export const validateCardNumber = (cardNumber) => {
  // Eliminar espacios y guiones
  const cleanedNumber = cardNumber.replace(/[\s-]/g, '');

  // Verificar que solo contenga dígitos
  if (!/^\d+$/.test(cleanedNumber)) {
    return false;
  }

  // Verificar longitud (entre 13 y 19 dígitos)
  if (cleanedNumber.length < 13 || cleanedNumber.length > 19) {
    return false;
  }

  // Algoritmo de Luhn
  let sum = 0;
  let isEven = false;

  // Iterar de derecha a izquierda
  for (let i = cleanedNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanedNumber.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Detecta el tipo de tarjeta basándose en el número
 * @param {string} cardNumber - Número de tarjeta
 * @returns {string} - Tipo de tarjeta (visa, mastercard, amex, etc.)
 */
export const detectCardType = (cardNumber) => {
  const cleanedNumber = cardNumber.replace(/[\s-]/g, '');

  const cardPatterns = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/,
    dinersclub: /^3(?:0[0-5]|[68])/,
    jcb: /^35/,
  };

  for (const [type, pattern] of Object.entries(cardPatterns)) {
    if (pattern.test(cleanedNumber)) {
      return type;
    }
  }

  return 'unknown';
};

/**
 * Formatea un número de tarjeta con espacios
 * @param {string} cardNumber - Número de tarjeta
 * @returns {string} - Número formateado
 */
export const formatCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  const cardType = detectCardType(cleaned);

  // American Express usa formato 4-6-5
  if (cardType === 'amex') {
    return cleaned.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
  }

  // Resto de tarjetas usan formato 4-4-4-4
  return cleaned.replace(/(\d{4})/g, '$1 ').trim();
};

/**
 * Valida fecha de expiración de tarjeta
 * @param {string} month - Mes (MM)
 * @param {string} year - Año (YY o YYYY)
 * @returns {boolean} - true si es válida y no está vencida
 */
export const validateExpiryDate = (month, year) => {
  const monthNum = parseInt(month, 10);
  let yearNum = parseInt(year, 10);

  // Validar mes
  if (monthNum < 1 || monthNum > 12) {
    return false;
  }

  // Convertir año de 2 dígitos a 4
  if (yearNum < 100) {
    yearNum += 2000;
  }

  // Verificar que no esté vencida
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (yearNum < currentYear) {
    return false;
  }

  if (yearNum === currentYear && monthNum < currentMonth) {
    return false;
  }

  return true;
};

/**
 * Valida código CVV/CVC
 * @param {string} cvv - Código CVV
 * @param {string} cardType - Tipo de tarjeta
 * @returns {boolean} - true si es válido
 */
export const validateCVV = (cvv, cardType) => {
  // American Express usa 4 dígitos, resto 3
  const expectedLength = cardType === 'amex' ? 4 : 3;

  if (!/^\d+$/.test(cvv)) {
    return false;
  }

  return cvv.length === expectedLength;
};
