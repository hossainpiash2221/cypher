const primeSet = new Set();
let publicKey = null;
let privateKey = null;
let n = null;

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

// Function to calculate the GCD
function gcd(a, b) {
    while (b !== 0n) {
        [a, b] = [b, a % b];
    }
    return a;
}

// Set up RSA keys
function setKeys() {
    const prime1 = BigInt(pickRandomPrime());
    const prime2 = BigInt(pickRandomPrime());

    n = prime1 * prime2;
    const fi = (prime1 - 1n) * (prime2 - 1n);

    // Calculate public key `e`
    let e = 2n;
    while (gcd(e, fi) !== 1n) {
        e += 1n;
    }
    publicKey = e;

    // Calculate private key `d`
    let d = 2n;
    while ((d * e) % fi !== 1n) {
        d += 1n;
    }
    privateKey = d;
}

// RSA encryption function
function encrypt(message) {
    let e = publicKey;
    let encryptedText = 1n;
    const bigMessage = BigInt(message);

    while (e > 0n) {
        encryptedText *= bigMessage;
        encryptedText %= n;
        e -= 1n;
    }
    return encryptedText;
}

// RSA decryption function
function decrypt(encryptedText) {
    let d = privateKey;
    let decrypted = 1n;

    while (d > 0n) {
        decrypted *= encryptedText;
        decrypted %= n;
        d -= 1n;
    }
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