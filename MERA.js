console.log("hi");
// Utility functions to handle big integers and modular exponentiation
function gcd(a, b) {
    while (b !== 0n) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function modExp(base, exp, mod) {
    let result = 1n;
    base = base % mod;
    while (exp > 0n) {
        if (exp % 2n === 1n) {
            result = (result * base) % mod;
        }
        exp = exp / 2n;
        base = (base * base) % mod;
    }
    return result;
}

// Generate random prime numbers and key components
const primes = [17n, 19n, 23n, 29n];
function getRandomPrime() {
    const randomIndex = Math.floor(Math.random() * primes.length);
    return primes.splice(randomIndex, 1)[0];
}

// Key generation for simplified MREA
function generateKeys() {
    const p = getRandomPrime();
    const q = getRandomPrime();
    const n = p * q;
    const phi_n = (p - 1n) * (q - 1n);

    let e = 2n;
    while (gcd(e, phi_n) !== 1n) e += 1n;

    let d = 2n;
    while ((d * e) % phi_n !== 1n) d += 1n;

    return { publicKey: { n, e }, privateKey: { d, n } };
}

// Encryption with simplified MREA (adding a random salt)
function encrypt(message, publicKey) {
    const { n, e } = publicKey;
    const salt = BigInt(Math.floor(Math.random() * 100) + 1); // Small random salt
    const saltedMessage = BigInt(message) + salt;
    const encrypted = modExp(saltedMessage, e, n);
    return { encrypted, salt }; // Returning salt to use during decryption
}

// Decryption with simplified MREA
function decrypt(encryptedObj, privateKey) {
    const { d, n } = privateKey;
    const { encrypted, salt } = encryptedObj;
    const decrypted = modExp(encrypted, d, n);
    return decrypted - salt; // Remove the salt to get original message
}

// Encoding and decoding functions
function encodeMessage(message, publicKey) {
    return message.split('').map(char => {
        const { encrypted, salt } = encrypt(char.charCodeAt(0), publicKey);
        return { encrypted: encrypted.toString(), salt: salt.toString() }; // Convert BigInt to strings
    });
}

function decodeMessage(encryptedArray, privateKey) {
    return encryptedArray
        .map(obj => String.fromCharCode(Number(decrypt({ 
            encrypted: BigInt(obj.encrypted), 
            salt: BigInt(obj.salt) 
        }, privateKey))))
        .join('');
}

// Testing the simplified MREA encryption and decryption
const { publicKey, privateKey } = generateKeys();

const message = "hello";
console.log("Original message:", message);

// Encrypt the message
const encryptedMessage = encodeMessage(message, publicKey);
console.log("Encrypted message:", encryptedMessage);

// Decrypt the message
const decryptedMessage = decodeMessage(encryptedMessage, privateKey);
console.log("Decrypted message:", decryptedMessage);
