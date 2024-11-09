console.log("");
// Define character set
const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";                       //a =7 & b=10
const m = charset.length; // Modulus 36 for letters and numbers

// Find modular inverse of 'a' with respect to m
function modInverse(a, m) {
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) return x;
    }
    return 1; // Return 1 if no modular inverse exists
}

// Encryption function
function encryptModifiedAffine2(plaintext, a, b) {
    let encryptedText = "";
    for (let char of plaintext) {
        let x = charset.indexOf(char);
        if (x === -1) continue; // Skip if character is not in charset
        let encryptedChar = (a * x + b) % m;
        encryptedText += charset[encryptedChar];
    }
    return encryptedText;
}

// Decryption function
function decryptModifiedAffine2(ciphertext, a, b) {
    let decryptedText = "";
    let a_inv = modInverse(a, m); // Calculate a's modular inverse
    for (let char of ciphertext) {
        let y = charset.indexOf(char);
        if (y === -1) continue; // Skip if character is not in charset
        let decryptedChar = (a_inv * (y - b + m)) % m;
        decryptedText += charset[decryptedChar];
    }
    return decryptedText;
}

// Example usage
const a = 7; // Should be coprime with 36
const b = 10;
const plaintext = "AFC25W";
const encrypted = encryptModifiedAffine2(plaintext, a, b);
const decrypted = decryptModifiedAffine2(encrypted, a, b);

console.log("Plaintext:", plaintext);
console.log("Encrypted:", encrypted);
console.log("Decrypted:", decrypted);