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
function columnarTranspositionEncrypt(msg, key) {
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
function columnarTranspositionDecrypt(cipher, key) {
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

// Example function to call encryption/decryption based on action
function columnarTranspositionCipher(message, key, decrypt = false) {
    if (decrypt) {
        return columnarTranspositionDecrypt(message, key);
    } else {
        return columnarTranspositionEncrypt(message, key);
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

function processMessage(decrypt) {
    const cipher = document.getElementById('cipher').value;
    const key = document.getElementById('key').value;
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
    }

    document.getElementById('ciphertext').innerText = result;
}

