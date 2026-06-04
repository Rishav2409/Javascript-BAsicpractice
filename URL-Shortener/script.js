const form = document.getElementById('shorten-form');
const urlInput = document.getElementById('long-url');
const submitBtn = document.getElementById('submit-btn');

const loadingEl = document.getElementById('loading');
const resultContainer = document.getElementById('result-container');
const shortUrlEl = document.getElementById('short-url');
const copyBtn = document.getElementById('copy-btn');
const errorContainer = document.getElementById('error-container');
const errorMsg = document.getElementById('error-msg');

// Using the free, no-auth is.gd API for URL shortening
const API_BASE_URL = 'https://is.gd/create.php?format=json&url=';

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const longUrl = urlInput.value.trim();

    if (!longUrl) return;

    // Reset UI
    hideAll();
    loadingEl.classList.remove('hidden');
    submitBtn.disabled = true;

    try {
        const response = await fetch(API_BASE_URL + encodeURIComponent(longUrl));
        const data = await response.json();

        if (data.shorturl) {
            showSuccess(data.shorturl);
        } else if (data.errorcode) {
            showError(data.errormessage || "Please enter a valid URL.");
        } else {
            showError("An unexpected error occurred.");
        }
    } catch (error) {
        showError("Failed to connect to the shortening service. Please check your internet connection.");
        console.error(error);
    } finally {
        loadingEl.classList.add('hidden');
        submitBtn.disabled = false;
    }
});

copyBtn.addEventListener('click', () => {
    const urlToCopy = shortUrlEl.textContent;
    
    navigator.clipboard.writeText(urlToCopy).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.backgroundColor = '#10b981'; // Green success color
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.backgroundColor = '#475569'; // Revert to original color
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy to clipboard.');
    });
});

function showSuccess(shortUrl) {
    shortUrlEl.textContent = shortUrl;
    shortUrlEl.href = shortUrl;
    resultContainer.classList.remove('hidden');
    urlInput.value = ''; // Clear input on success
}

function showError(message) {
    errorMsg.textContent = message;
    errorContainer.classList.remove('hidden');
}

function hideAll() {
    resultContainer.classList.add('hidden');
    errorContainer.classList.add('hidden');
}
