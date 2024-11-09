const primeSet = new Set();
let publicKey = null;
let privateKey = null;
let n = null;
let m = null;
let g = null;
let lambda = null;
let mu = null;

// Function to initialize prime numbers up to a limit
function primeFiller() {
    const limit = 250;
    const sieve = Array(limit).fill(true);
    sieve[0] = sieve[1] = false;

    for (let i = 2; i < limit; i++) {
        if (sieve[i]) {
            for (let j = i * 2; j < limit; j += i) {
                sieve[j] = false;
            }
            primeSet.add(i);
        }
    }
}

// Function to pick a random prime from the set
function pickRandomPrime() {
    const primes = Array.from(primeSet);
    const randomIndex = Math.floor(Math.random() * primes.length);
    const prime = primes[randomIndex];
    primeSet.delete(prime);  // Remove to avoid re-selection
    return prime;
}

// Setup function for the MREA keys
function setKeys() {
    const prime1 = BigInt(pickRandomPrime());
    const prime2 = BigInt(pickRandomPrime());
    const prime3 = BigInt(pickRandomPrime());
    const prime4 = BigInt(pickRandomPrime());

    // Step 1: Calculate n, m, lambda, and mu
    n = prime1 * prime2;
    m = prime3 * prime4;
    const phi_n = (prime1 - 1n) * (prime2 - 1n);
    const phi_m = (prime3 - 1n) * (prime4 - 1n);

    let e = 2n;
    while (gcd(e, phi_n) !== 1n) {
        e += 1n;
    }
    publicKey = e;

    let d = 2n;
    while ((d * e) % phi_n !== 1n) {
        d += 1n;
    }
    privateKey = d;

    g = m + 1n;

    // Calculate mu (modular multiplicative inverse)
    mu = modInverse(phi_m, m);
}

// Helper function to calculate the GCD
function gcd(a, b) {
    while (b !== 0n) {
        [a, b] = [b, a % b];
    }
    return a;
}

// Helper function to calculate modular inverse
function modInverse(a, m) {
    let m0 = m, t, q;
    let x0 = 0n, x1 = 1n;
    if (m === 1n) return 0n;
    while (a > 1n) {
        q = a / m;
        t = m;
        m = a % m;
        a = t;
        t = x0;
        x0 = x1 - q * x0;
        x1 = t;
    }
    if (x1 < 0n) x1 += m0;
    return x1;
}

// MREA Encryption function
function encrypt(message) {
    const randomR = BigInt(Math.floor(Math.random() * Number(m)));
    const bigMessage = BigInt(message);
    const encryptedText = (g ** (bigMessage * publicKey) * (randomR ** m)) % (m ** 2n);
    return encryptedText;
}

// MREA Decryption function
function decrypt(encryptedText) {
    const part1 = ((encryptedText ** mu) % (m ** 2n) - 1n) / m;
    const decrypted = (part1 * privateKey) % n;
    return decrypted;
}

// Encode each character of the message
function encoder(message) {
    const encoded = [];
    for (const letter of message) {
        encoded.push(encrypt(letter.charCodeAt(0)));
    }
    return encoded;
}

// Decode the encoded message
function decoder(encoded) {
    let decodedMessage = '';
    for (const num of encoded) {
        decodedMessage += String.fromCharCode(Number(decrypt(num)));
    }
    return decodedMessage;
}

// Example usage
primeFiller();
setKeys();

const message = "Test Message";
console.log("Initial message:");
console.log(message);

const coded = encoder(message);
console.log("\nThe encoded message (encrypted by public key):");
console.log(coded.map(e => e.toString()).join(" "));

const decodedMessage = decoder(coded);
console.log("\nThe decoded message (decrypted by private key):");
console.log(decodedMessage);