console.log("");
// Define the Vigenère table with numbers and alphabets
const vigenereTable = (() => {
    const table = [];
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    for (let i = 0; i < chars.length; i++) {
        table[i] = [];
        for (let j = 0; j < chars.length; j++) {
            const index = (i + j) % chars.length;
            table[i][j] = chars[index];
        }
    }
    return table;
})();

// Helper function to get index in Vigenère table
const getIndex = (char) => {
    if (/[A-Z]/.test(char)) return char.charCodeAt(0) - 'A'.charCodeAt(0);
    return 26 + parseInt(char, 10);  // Map digits 0-9 to indices 26-35
};

// Encryption function
function encryptVigenereCaesar(plainText, key, uKey) {
    let cipherText = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for (let i = 0; i < plainText.length; i++) {
        const pIndex = getIndex(plainText[i]);
        const kIndex = getIndex(key[i % key.length]);
        let cIndex = (pIndex + kIndex + uKey) % chars.length;
        
        cipherText += chars[cIndex];
    }
    return cipherText;
}

// Decryption function
function decryptVigenereCaesar(cipherText, key, uKey) {
    let plainText = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for (let i = 0; i < cipherText.length; i++) {
        const cIndex = getIndex(cipherText[i]);
        const kIndex = getIndex(key[i % key.length]);
        let pIndex = (cIndex - uKey - kIndex + chars.length) % chars.length;
        
        plainText += chars[pIndex];
    }
    return plainText;
}

// Example usage
const plainText = "CALLMEAT9";
console.log("Plain Text:", plainText);
const key = "ATTACKATT";
const uKey = 3;  // User-defined key for additional shifting

// Encrypt the text
const encryptedText = encryptVigenereCaesar(plainText, key, uKey);
console.log("Encrypted Text:", encryptedText);

// Decrypt the text
const decryptedText = decryptVigenereCaesar(encryptedText, key, uKey);
console.log("Decrypted Text:", decryptedText);