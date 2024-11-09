// cipher.js

// Caesar Cipher Encryption and Decryption
function caesarCipher(text, shift, decrypt = false) {
    if (decrypt) shift = -shift;
    return text.replace(/[a-z]/gi, char => {
        const start = char <= 'Z' ? 65 : 97;
        return String.fromCharCode(((char.charCodeAt(0) - start + shift) % 26 + 26) % 26 + start);
    });
}

// Vigenère Cipher Encryption and Decryption
function vigenereCipher(text, key, decrypt = false) {
    const keyUpper = key.toUpperCase();
    return text.replace(/[a-z]/gi, (char, index) => {
        const isUpper = char <= 'Z';
        const start = isUpper ? 65 : 97;
        const keyShift = keyUpper.charCodeAt(index % key.length) - 65;
        const shift = decrypt ? -keyShift : keyShift;
        return String.fromCharCode(((char.charCodeAt(0) - start + shift) % 26 + 26) % 26 + start);
    });
}

// Atbash Cipher (same for encrypt and decrypt)
function atbashCipher(text) {
    return text.replace(/[a-z]/gi, char => {
        const start = char <= 'Z' ? 65 : 97;
        return String.fromCharCode(start + (25 - (char.charCodeAt(0) - start)));
    });
}

// Main function to encrypt or decrypt based on user input
function encryptMessage() {
    processMessage(false);
}

function decryptMessage() {
    processMessage(true);
}

// Columnar Transposition Cipher Encryption
function columnarTranspositionEncrypt2(msg, key) {
    let cipher = "";

    // Track key indices
    let k_indx = 0;

    const msg_len = msg.length;
    const msg_lst = Array.from(msg);
    const key_lst = Array.from(key).sort();

    // Calculate column of the matrix
    const col = key.length;

    // Calculate maximum row of the matrix
    const row = Math.ceil(msg_len / col);

    // Add padding character '_' to fill empty cells
    const fill_null = (row * col) - msg_len;
    for (let i = 0; i < fill_null; i++) {
        msg_lst.push('_');
    }

    // Create the matrix and insert message with padding row-wise
    const matrix = [];
    for (let i = 0; i < msg_lst.length; i += col) {
        matrix.push(msg_lst.slice(i, i + col));
    }

    // Read matrix column-wise using sorted key order
    for (let _ = 0; _ < col; _++) {
        const curr_idx = key.indexOf(key_lst[k_indx]);
        for (const row of matrix) {
            cipher += row[curr_idx];
        }
        k_indx++;
    }

    return cipher;
}

// Columnar Transposition Cipher Decryption
function columnarTranspositionDecrypt2(cipher, key) {
    let msg = "";

    // Track key indices
    let k_indx = 0;

    // Track message indices
    let msg_indx = 0;
    const msg_len = cipher.length;
    const msg_lst = Array.from(cipher);

    // Calculate column of the matrix
    const col = key.length;

    // Calculate maximum row of the matrix
    const row = Math.ceil(msg_len / col);

    // Convert key to list and sort alphabetically
    const key_lst = Array.from(key).sort();

    // Create an empty matrix to store decrypted message
    const dec_cipher = [];
    for (let i = 0; i < row; i++) {
        dec_cipher.push(Array(col).fill(null));
    }

    // Arrange the matrix column-wise according to key order
    for (let _ = 0; _ < col; _++) {
        const curr_idx = key.indexOf(key_lst[k_indx]);

        for (let j = 0; j < row; j++) {
            dec_cipher[j][curr_idx] = msg_lst[msg_indx];
            msg_indx++;
        }
        k_indx++;
    }

    // Convert decrypted message matrix into a string
    msg = dec_cipher.flat().join('');

    // Remove padding character '_'
    const null_count = (msg.match(/_/g) || []).length;
    if (null_count > 0) {
        return msg.slice(0, -null_count);
    }

    return msg;
}

function columnarTranspositionCipher(message, key, decrypt = false) {
    if (decrypt) {
        return columnarTranspositionDecrypt2(message, key);
    } else {
        return columnarTranspositionEncrypt2(message, key);
    }
}

// Columnar Transposition Cipher Encryption (Single)
function columnarTranspositionEncrypt(msg, key) {
    let cipher = "";
    let k_indx = 0;
    const msg_len = msg.length;
    const msg_lst = Array.from(msg);
    const key_lst = Array.from(key).sort();
    const col = key.length;
    const row = Math.ceil(msg_len / col);
    const fill_null = (row * col) - msg_len;
    for (let i = 0; i < fill_null; i++) {
        msg_lst.push('_');
    }
    const matrix = [];
    for (let i = 0; i < msg_lst.length; i += col) {
        matrix.push(msg_lst.slice(i, i + col));
    }
    for (let _ = 0; _ < col; _++) {
        const curr_idx = key.indexOf(key_lst[k_indx]);
        for (const row of matrix) {
            cipher += row[curr_idx];
        }
        k_indx++;
    }
    return cipher;
}

// Columnar Transposition Cipher Decryption (Single)
function columnarTranspositionDecrypt(cipher, key) {
    let msg = "";
    let k_indx = 0;
    let msg_indx = 0;
    const msg_len = cipher.length;
    const msg_lst = Array.from(cipher);
    const col = key.length;
    const row = Math.ceil(msg_len / col);
    const key_lst = Array.from(key).sort();
    const dec_cipher = [];
    for (let i = 0; i < row; i++) {
        dec_cipher.push(Array(col).fill(null));
    }
    for (let _ = 0; _ < col; _++) {
        const curr_idx = key.indexOf(key_lst[k_indx]);
        for (let j = 0; j < row; j++) {
            dec_cipher[j][curr_idx] = msg_lst[msg_indx];
            msg_indx++;
        }
        k_indx++;
    }
    msg = dec_cipher.flat().join('');
    const null_count = (msg.match(/_/g) || []).length;
    return null_count > 0 ? msg.slice(0, -null_count) : msg;
}

// Triple Columnar Transposition Cipher Encryption with Three Keys
function tripleColumnarTranspositionEncrypt(msg, key1, key2, key3) {
    // Apply encryption three times with three different keys
    let encrypted = columnarTranspositionEncrypt(msg, key1);
    encrypted = columnarTranspositionEncrypt(encrypted, key2);
    encrypted = columnarTranspositionEncrypt(encrypted, key3);
    return encrypted;
}

// Triple Columnar Transposition Cipher Decryption with Three Keys
function tripleColumnarTranspositionDecrypt(cipher, key1, key2, key3) {
    // Apply decryption three times with three different keys (in reverse order)
    let decrypted = columnarTranspositionDecrypt(cipher, key3);
    decrypted = columnarTranspositionDecrypt(decrypted, key2);
    decrypted = columnarTranspositionDecrypt(decrypted, key1);
    return decrypted;
}

// Example function to call encryption/decryption based on action
function tripleColumnarTranspositionCipher(message, key1, key2, key3, decrypt = false) {
    if (decrypt) {
        return tripleColumnarTranspositionDecrypt(message, key1, key2, key3);
    } else {
        return tripleColumnarTranspositionEncrypt(message, key1, key2, key3);
    }
}


// Rail Fence Cipher Encryption and Decryption
function railFenceCipher(text, key, decrypt = false) {
    if (decrypt) {
        const rail = Array.from({ length: key }, () => []);
        let direction = -1, row = 0;
        for (let i = 0; i < text.length; i++) {
            rail[row].push(i);
            if (row === 0 || row === key - 1) direction *= -1;
            row += direction;
        }

        const result = Array(text.length);
        let index = 0;
        for (const line of rail) {
            for (const pos of line) {
                result[pos] = text[index++];
            }
        }
        return result.join('');
    } else {
        const rail = Array.from({ length: key }, () => []);
        let direction = -1, row = 0;
        for (const char of text) {
            rail[row].push(char);
            if (row === 0 || row === key - 1) direction *= -1;
            row += direction;
        }
        return rail.flat().join('');
    }
}
// Generate Playfair Key Matrix
function generatePlayfairKeyMatrix(key) {
    const matrix = [];
    const seen = new Set();
    let processedKey = key.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');

    processedKey += 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // Add the rest of the alphabet (J is combined with I)

    for (const char of processedKey) {
        if (!seen.has(char)) {
            seen.add(char);
            if (matrix.length === 0 || matrix[matrix.length - 1].length === 5) {
                matrix.push([]);
            }
            matrix[matrix.length - 1].push(char);
        }
    }
    return matrix;
}

// Encrypt and Decrypt with Playfair Cipher
function playfairCipher(text, key, decrypt = false) {
    const matrix = generatePlayfairKeyMatrix(key);
    const getPos = char => {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (matrix[i][j] === char) return [i, j];
            }
        }
        return null;
    };

    const formatText = text => {
        let formatted = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
        for (let i = 0; i < formatted.length - 1; i += 2) {
            if (formatted[i] === formatted[i + 1]) {
                formatted = formatted.slice(0, i + 1) + 'X' + formatted.slice(i + 1);
            }
        }
        if (formatted.length % 2 !== 0) formatted += 'X';
        return formatted;
    };

    let processedText = formatText(text);
    let result = '';

    for (let i = 0; i < processedText.length; i += 2) {
        const [x1, y1] = getPos(processedText[i]);
        const [x2, y2] = getPos(processedText[i + 1]);

        if (x1 === x2) {
            result += matrix[x1][(y1 + (decrypt ? -1 : 1) + 5) % 5];
            result += matrix[x2][(y2 + (decrypt ? -1 : 1) + 5) % 5];
        } else if (y1 === y2) {
            result += matrix[(x1 + (decrypt ? -1 : 1) + 5) % 5][y1];
            result += matrix[(x2 + (decrypt ? -1 : 1) + 5) % 5][y2];
        } else {
            result += matrix[x1][y2];
            result += matrix[x2][y1];
        }
    }

    return result;
}


// rsa
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
// function rsaModi(){
//     console.log("1");
//     const { publicKey, privateKey } = generateKeys();

// const message = "hello";
// console.log("Original message:", message);

// // Encrypt the message
// const encryptedMessage = encodeMessage(message, publicKey);
// return encryptedMessage;
// // console.log("Encrypted message:", encryptedMessage);

// // // Decrypt the message
// // const decryptedMessage = decodeMessage(encryptedMessage, privateKey);
// // console.log("Decrypted message:", decryptedMessage);
// }

function modificationRsa(message, decrypt = false) {
    console.log("1");
    const { publicKey, privateKey } = generateKeys();
    const emsg = encodeMessage(message, publicKey);
    if (!decrypt) {

        return encodeMessage(message, publicKey);
    } else {
        return decodeMessage(emsg, privateKey);
    }

}


// Affine Modification 

console.log("");
// Define character set
const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789   abcdefghijklmnopqrstuvwxyz";                       //a =7 & b=10
const m = charset.length; // Modulus 36 for letters and numbers

// Find modular inverse of 'a' with respect to m
function modInverse(a, m) {
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) return x;
    }
    return 1; // Return 1 if no modular inverse exists
}

// Encryption function
function encryptModifiedAffine(message, a, b) {
    console.log(message)
    let encryptedText = "";
    for (let char of message) {
        let x = charset.indexOf(char);
        if (x === -1) continue; // Skip if character is not in charset
        let encryptedChar = (a * x + b) % m;
        encryptedText += charset[encryptedChar];
    }
    console.log(encryptedText)
    return encryptedText;
}

// Decryption function
function decryptModifiedAffine(message, a, b) {
    let decryptedText = "";
    let a_inv = modInverse(a, m); // Calculate a's modular inverse
    for (let char of message) {
        let y = charset.indexOf(char);
        if (y === -1) continue; // Skip if character is not in charset
        let decryptedChar = (a_inv * (y - b + m)) % m;
        decryptedText += charset[decryptedChar];
    }
    return decryptedText;
}
function modifiedAffine(message, decrypt = false) {
    const a = 7; // Should be coprime with 36
    const b = 10;
    console.log(message)
    if (!decrypt) {
        console.log('1')
        return encryptModifiedAffine(message, a, b);
    } else {
        return decryptModifiedAffine(message, a, b);
    }
}


function processMessage(decrypt) {
    const cipher = document.getElementById('cipher').value;
    const key = document.getElementById('key').value;
    const key1 = document.getElementById('key1').value;
    const key2 = document.getElementById('key2').value;
    const key3 = document.getElementById('key3').value;
    const message = document.getElementById('message').value;
    let result = '';

    switch (cipher) {
        case 'caesar':
            result = caesarCipher(message, parseInt(key), decrypt);
            break;
        case 'vigenere':
            result = vigenereCipher(message, key, decrypt);
            break;
        case 'atbash':
            result = atbashCipher(message);
            break;
        case 'playfair':
            result = playfairCipher(message, key, decrypt);
            break;
        case 'railfence':
            result = railFenceCipher(message, parseInt(key), decrypt);
            break;
        case 'double-columnar':
            result = columnarTranspositionCipher(message, key, decrypt);
            break;

        case 'triple-columnar':
            // console.log("1")
            result = tripleColumnarTranspositionCipher(message, key1, key2, key3, decrypt);
            // console.log(result);
            break;

        case 'rsaModification':
            result = modificationRsa(message, decrypt);
            break;

        case 'AffineModification':
            result = modifiedAffine(message,decrypt);
            break;

    }

    document.getElementById('ciphertext').innerText = result;
}

