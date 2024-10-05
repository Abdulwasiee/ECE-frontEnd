import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_CRYPTO_SECRET_KEY;

const Encryptor = {
  encrypt: (value) => {
    // Convert the value to a string if it is not already
    const text = String(value);

    // Encrypt the text
    const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();

    // Replace slashes with another character (e.g., underscore)
    return encrypted.replace(/\//g, "_"); // Use _ or any other character instead of slash
  },

  decrypt: (cipherText) => {
    // Replace the custom character back to slash before decryption
    const formattedCipherText = cipherText.replace(/_/g, "/");

    const bytes = CryptoJS.AES.decrypt(formattedCipherText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  },
};

export default Encryptor;
