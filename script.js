// ===== Cat Database =====
const cats = {
    aiko: {
        profile: 'assets/profiles/aiko.jpeg',
        images: [
            'assets/cats/aiko/IMG_1344 Medium.jpeg',
            'assets/cats/aiko/IMG_1345 Medium.jpeg',
            'assets/cats/aiko/IMG_1346 Medium.jpeg',
            'assets/cats/aiko/IMG_1347 Medium.jpeg',
            'assets/cats/aiko/IMG_1355 Medium.jpeg',
            'assets/cats/aiko/IMG_1416 Medium.jpeg',
            'assets/cats/aiko/IMG_1417 Medium.jpeg',
            'assets/cats/aiko/IMG_1418 Medium.jpeg',
            'assets/cats/aiko/IMG_1419 Medium.jpeg',
            'assets/cats/aiko/IMG_1420 Medium.jpeg',
            'assets/cats/aiko/IMG_1421 Medium.jpeg',
            'assets/cats/aiko/IMG_1422 Medium.jpeg',
            'assets/cats/aiko/IMG_1423 Medium.jpeg',
            'assets/cats/aiko/IMG_1424 Medium.jpeg',
            'assets/cats/aiko/IMG_1425 Medium.jpeg',
            'assets/cats/aiko/IMG_1426 Medium.jpeg',
            'assets/cats/aiko/IMG_1427 Medium.jpeg',
            'assets/cats/aiko/IMG_1428 Medium.jpeg'
        ]
    },
    pikachu: {
        profile: 'assets/profiles/pikachu.jpeg',
        images: [
            'assets/cats/pikachu/IMG_1338 Large.jpeg',
            'assets/cats/pikachu/IMG_1339 Large.jpeg',
            'assets/cats/pikachu/IMG_1340 Large.jpeg',
            'assets/cats/pikachu/IMG_1341 Large.jpeg',
            'assets/cats/pikachu/IMG_1342 Large.jpeg',
            'assets/cats/pikachu/IMG_1343 Large.jpeg',
            'assets/cats/pikachu/IMG_1391 Large.jpeg',
            'assets/cats/pikachu/IMG_1393 Large.jpeg',
            'assets/cats/pikachu/IMG_1394 Large.jpeg',
            'assets/cats/pikachu/IMG_1395 Large.jpeg',
            'assets/cats/pikachu/IMG_1396 Large.jpeg',
            'assets/cats/pikachu/IMG_1397 Large.jpeg',
            'assets/cats/pikachu/IMG_1398 Large.jpeg',
            'assets/cats/pikachu/IMG_1399 Large.jpeg',
            'assets/cats/pikachu/IMG_1400 Large.jpeg',
            'assets/cats/pikachu/IMG_1401 Large.jpeg',
            'assets/cats/pikachu/IMG_1402 Large.jpeg',
            'assets/cats/pikachu/IMG_1403 Large.jpeg',
            'assets/cats/pikachu/IMG_1404 Large.jpeg',
            'assets/cats/pikachu/IMG_1405 Large.jpeg',
            'assets/cats/pikachu/IMG_1406 Large.jpeg',
            'assets/cats/pikachu/IMG_1407 Large.jpeg',
            'assets/cats/pikachu/IMG_1408 Large.jpeg',
            'assets/cats/pikachu/IMG_1409 Large.jpeg',
            'assets/cats/pikachu/IMG_1410 Large.jpeg',
            'assets/cats/pikachu/IMG_1411 Large.jpeg',
            'assets/cats/pikachu/IMG_1412 Large.jpeg',
            'assets/cats/pikachu/IMG_1413 Large.jpeg',
            'assets/cats/pikachu/IMG_1414 Large.jpeg'
        ]
    },
    sesame: {
        profile: 'assets/profiles/sesame.jpeg',
        images: [
            'assets/cats/sesame/IMG_1351.jpg',
            'assets/cats/sesame/IMG_1352.jpg',
            'assets/cats/sesame/IMG_1353.jpg',
            'assets/cats/sesame/IMG_1354.jpg',
            'assets/cats/sesame/IMG_1384.jpg',
            'assets/cats/sesame/IMG_1385.jpg',
            'assets/cats/sesame/IMG_1386.jpg',
            'assets/cats/sesame/IMG_1387.jpg',
            'assets/cats/sesame/IMG_1388.jpg',
            'assets/cats/sesame/IMG_1389.jpg',
            'assets/cats/sesame/IMG_1390.jpg'
        ]
    }
};

// ===== Game State =====
const catNames = Object.keys(cats);
let currentTargetCat = '';
let correctImages = [];
let selectedImages = [];
let currentGridImages = [];
let attempts = 0;
let successes = 0;

// ===== Custom Cats State =====
let gameMode = 'default'; // 'default' or 'custom'
let customCatsData = {};
let catIdCounter = 0;
let mixedMode = false; // NEW: Mix custom cats with default cats

// ===== DOM Elements =====
const profileImage = document.getElementById('profileImage');
const targetCatName = document.getElementById('targetCatName');
const imageGrid = document.getElementById('imageGrid');
const resultMessage = document.getElementById('resultMessage');
const verifyButton = document.getElementById('verifyButton');
const newChallengeButton = document.getElementById('newChallengeButton');
const attemptsCount = document.getElementById('attemptsCount');
const successCount = document.getElementById('successCount');

// Custom Cat Elements
const defaultModeBtn = document.getElementById('defaultModeBtn');
const customModeBtn = document.getElementById('customModeBtn');
const customCatBuilder = document.getElementById('customCatBuilder');
const gameArea = document.getElementById('gameArea');
const catEntriesContainer = document.getElementById('catEntriesContainer');
const addCatBtn = document.getElementById('addCatBtn');
const saveCustomCatsBtn = document.getElementById('saveCustomCatsBtn');
const clearAllCatsBtn = document.getElementById('clearAllCatsBtn');
const editCustomCatsSection = document.getElementById('editCustomCatsSection');
const editCustomCatsBtn = document.getElementById('editCustomCatsBtn');
const notificationToast = document.getElementById('notificationToast');
const mixedModeCheckbox = document.getElementById('mixedModeCheckbox');
const builderSubtitle = document.getElementById('builderSubtitle');

// ===== Helper Functions =====

/**
 * Get a random element from an array
 */
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Get random images from a cat's collection
 */
function getRandomImages(catName, count) {
    const availableImages = [...cats[catName].images];
    const selected = [];
    
    for (let i = 0; i < count && availableImages.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableImages.length);
        selected.push(availableImages[randomIndex]);
        availableImages.splice(randomIndex, 1);
    }
    
    return selected;
}

/**
 * Generate a new CAPTCHA challenge
 */
function generateChallenge() {
    // Get current cat pool based on mode
    const currentCats = getCurrentCatPool();
    const currentCatNames = Object.keys(currentCats);
    
    if (currentCatNames.length < 2) {
        showNotification('error', 'Not enough cats to generate challenge');
        return;
    }
    
    // Reset state
    selectedImages = [];
    correctImages = [];
    currentGridImages = [];
    resultMessage.classList.remove('show', 'success', 'error');
    resultMessage.textContent = '';
    
    // Step 1: Select random target cat
    // In mixed mode, always select from custom cats only
    if (gameMode === 'custom' && mixedMode) {
        const savedCats = localStorage.getItem('lihuaCaptcha_customCats');
        if (savedCats) {
            const customCatsOnly = Object.keys(JSON.parse(savedCats));
            currentTargetCat = getRandomElement(customCatsOnly);
        } else {
            currentTargetCat = getRandomElement(currentCatNames);
        }
    } else {
        currentTargetCat = getRandomElement(currentCatNames);
    }
    
    // Step 2: Determine number of target cat images (1-5, or less if fewer images available)
    const maxTargetImages = Math.min(5, currentCats[currentTargetCat].images.length);
    const targetCount = Math.floor(Math.random() * maxTargetImages) + 1;
    
    // Step 3: Get random target cat images
    correctImages = getRandomImagesFromPool(currentCats, currentTargetCat, targetCount);
    currentGridImages.push(...correctImages);
    
    // Step 4: Get other cats' images to fill the grid
    const remainingSlots = 9 - targetCount;
    const otherCats = currentCatNames.filter(cat => cat !== currentTargetCat);
    
    // Distribute remaining slots between other cats
    if (otherCats.length === 1) {
        // Only one other cat available
        const otherImages = getRandomImagesFromPool(currentCats, otherCats[0], remainingSlots);
        currentGridImages.push(...otherImages);
    } else {
        // Multiple other cats
        const cat1Count = Math.ceil(remainingSlots / 2);
        const cat2Count = remainingSlots - cat1Count;
        
        const otherImages1 = getRandomImagesFromPool(currentCats, otherCats[0], cat1Count);
        const otherImages2 = getRandomImagesFromPool(currentCats, otherCats[1], cat2Count);
        
        currentGridImages.push(...otherImages1, ...otherImages2);
    }
    
    // Step 5: Shuffle all images
    currentGridImages = shuffleArray(currentGridImages);
    
    // Step 6: Update UI
    updateChallengeHeader(currentCats);
    renderGrid();
    
    console.log('Challenge generated:', {
        mode: gameMode,
        target: currentTargetCat,
        targetCount: targetCount,
        correctImages: correctImages.length
    });
}

/**
 * Get random images from a specific cat in the current pool
 */
function getRandomImagesFromPool(catPool, catName, count) {
    const availableImages = [...catPool[catName].images];
    const selected = [];
    
    for (let i = 0; i < count && availableImages.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableImages.length);
        selected.push(availableImages[randomIndex]);
        availableImages.splice(randomIndex, 1);
    }
    
    return selected;
}

/**
 * Update the challenge header with target cat info
 */
function updateChallengeHeader(catPool) {
    const currentCats = catPool || getCurrentCatPool();
    profileImage.src = currentCats[currentTargetCat].profile;
    profileImage.alt = `${currentTargetCat} profile`;
    targetCatName.textContent = currentTargetCat;
}

/**
 * Render the image grid
 */
function renderGrid() {
    imageGrid.innerHTML = '';
    
    currentGridImages.forEach((imagePath, index) => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        gridItem.dataset.imagePath = imagePath;
        gridItem.dataset.index = index;
        
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `Cat image ${index + 1}`;
        img.loading = 'lazy';
        
        gridItem.appendChild(img);
        gridItem.addEventListener('click', handleImageClick);
        
        imageGrid.appendChild(gridItem);
    });
}

/**
 * Handle image selection/deselection
 */
function handleImageClick(event) {
    const gridItem = event.currentTarget;
    const imagePath = gridItem.dataset.imagePath;
    
    // Toggle selection
    if (gridItem.classList.contains('selected')) {
        gridItem.classList.remove('selected');
        selectedImages = selectedImages.filter(img => img !== imagePath);
    } else {
        gridItem.classList.add('selected');
        selectedImages.push(imagePath);
    }
    
    console.log('Selected images:', selectedImages.length);
}

/**
 * Verify the user's selection
 */
function verifySelection() {
    attempts++;
    attemptsCount.textContent = attempts;
    
    // Check if user selected all correct images
    const allCorrectSelected = correctImages.every(img => selectedImages.includes(img));
    
    // Check if user selected any incorrect images
    const noIncorrectSelected = selectedImages.every(img => correctImages.includes(img));
    
    // Determine success
    const isSuccess = allCorrectSelected && noIncorrectSelected && selectedImages.length > 0;
    
    if (isSuccess) {
        successes++;
        successCount.textContent = successes;
        showMessage('success', `🎉 Correct! You found all the ${currentTargetCat} images!`);
    } else {
        if (selectedImages.length === 0) {
            showMessage('error', '❌ Please select at least one image!');
        } else if (!allCorrectSelected) {
            showMessage('error', `❌ Not quite right. You missed some ${currentTargetCat} images. Try again!`);
        } else {
            showMessage('error', `❌ Not quite right. Some selected images are not ${currentTargetCat}. Try again!`);
        }
    }
    
    console.log('Verification:', {
        selected: selectedImages.length,
        correct: correctImages.length,
        allCorrectSelected,
        noIncorrectSelected,
        success: isSuccess
    });
}

/**
 * Show result message
 */
function showMessage(type, text) {
    resultMessage.className = `result-message ${type} show`;
    resultMessage.textContent = text;
}

/**
 * Clear selections but keep the same challenge
 */
function clearSelections() {
    selectedImages = [];
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => item.classList.remove('selected'));
    resultMessage.classList.remove('show');
}

// ===== CUSTOM CAT FUNCTIONALITY =====

/**
 * Show notification toast
 */
function showNotification(type, message, duration = 3000) {
    notificationToast.textContent = message;
    notificationToast.className = `notification-toast ${type} show`;
    
    setTimeout(() => {
        notificationToast.classList.remove('show');
    }, duration);
}

/**
 * Generate unique cat ID
 */
function generateCatId() {
    return `cat_${Date.now()}_${++catIdCounter}`;
}

/**
 * Validate image file
 */
function validateImageFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
        showNotification('error', 'Please upload image files only (JPEG, PNG, GIF, WebP)');
        return false;
    }
    
    if (file.size > maxSize) {
        showNotification('warning', `File "${file.name}" is larger than 5MB. Consider compressing it.`);
    }
    
    return true;
}

/**
 * Read file as Data URL
 */
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
    });
}

/**
 * Add a new cat entry to the builder
 */
function addCatEntry() {
    const catId = generateCatId();
    
    // Initialize cat data
    customCatsData[catId] = {
        name: '',
        profile: null,
        images: []
    };
    
    // Create cat entry HTML
    const catEntry = document.createElement('div');
    catEntry.className = 'cat-entry';
    catEntry.dataset.catId = catId;
    
    const catNumber = Object.keys(customCatsData).length;
    
    catEntry.innerHTML = `
        <div class="cat-entry-header">
            <div class="cat-number">${catNumber}</div>
            <input type="text" class="cat-name-input" placeholder="Enter cat name (e.g., Fluffy)" data-cat-id="${catId}">
            <button class="remove-cat-btn" data-cat-id="${catId}" title="Remove this cat">×</button>
        </div>
        
        <div class="upload-section">
            <label class="upload-label">Profile Photo (Required)</label>
            <div class="upload-zone" data-cat-id="${catId}" data-type="profile">
                <div class="upload-icon">📸</div>
                <div class="upload-text"><strong>Click or drag</strong> to upload profile photo</div>
                <div class="upload-hint">This image will be shown in the challenge</div>
                <input type="file" class="file-input" accept="image/*" data-cat-id="${catId}" data-type="profile">
            </div>
            <div class="image-previews" data-cat-id="${catId}" data-type="profile"></div>
        </div>
        
        <div class="upload-section">
            <label class="upload-label">Cat Images (Minimum 3)</label>
            <div class="upload-zone" data-cat-id="${catId}" data-type="images">
                <div class="upload-icon">🖼️</div>
                <div class="upload-text"><strong>Click or drag</strong> to upload multiple images</div>
                <div class="upload-hint">Upload 3 or more images of your cat</div>
                <input type="file" class="file-input" accept="image/*" multiple data-cat-id="${catId}" data-type="images">
            </div>
            <div class="image-previews" data-cat-id="${catId}" data-type="images"></div>
        </div>
    `;
    
    catEntriesContainer.appendChild(catEntry);
    attachCatEntryListeners(catEntry, catId);
    
    console.log('Added cat entry:', catId);
}

/**
 * Attach event listeners to cat entry elements
 */
function attachCatEntryListeners(catEntry, catId) {
    // Cat name input
    const nameInput = catEntry.querySelector('.cat-name-input');
    nameInput.addEventListener('input', (e) => {
        customCatsData[catId].name = e.target.value.trim();
    });
    
    // Remove cat button
    const removeBtn = catEntry.querySelector('.remove-cat-btn');
    removeBtn.addEventListener('click', () => removeCatEntry(catId));
    
    // Upload zones
    const uploadZones = catEntry.querySelectorAll('.upload-zone');
    uploadZones.forEach(zone => {
        const fileInput = zone.querySelector('.file-input');
        const type = zone.dataset.type;
        
        // Click to upload
        zone.addEventListener('click', () => fileInput.click());
        
        // Drag and drop
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', (e) => handleDrop(e, catId, type));
        
        // File input change
        fileInput.addEventListener('change', (e) => handleFileSelect(e, catId, type));
    });
}

/**
 * Handle drag over event
 */
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
}

/**
 * Handle drag leave event
 */
function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
}

/**
 * Handle drop event
 */
async function handleDrop(e, catId, type) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    
    const files = Array.from(e.dataTransfer.files);
    await processFiles(files, catId, type);
}

/**
 * Handle file select event
 */
async function handleFileSelect(e, catId, type) {
    const files = Array.from(e.target.files);
    await processFiles(files, catId, type);
    e.target.value = ''; // Reset input
}

/**
 * Process uploaded files
 */
async function processFiles(files, catId, type) {
    for (const file of files) {
        if (!validateImageFile(file)) continue;
        
        try {
            const dataURL = await readFileAsDataURL(file);
            
            if (type === 'profile') {
                customCatsData[catId].profile = dataURL;
            } else {
                customCatsData[catId].images.push(dataURL);
            }
            
            updatePreviews(catId, type);
            
            // Update upload zone appearance
            const uploadZone = document.querySelector(`[data-cat-id="${catId}"][data-type="${type}"].upload-zone`);
            if (uploadZone) {
                uploadZone.classList.add('has-file');
            }
            
        } catch (error) {
            showNotification('error', `Failed to upload ${file.name}: ${error.message}`);
        }
    }
}

/**
 * Update image previews
 */
function updatePreviews(catId, type) {
    const previewContainer = document.querySelector(`.image-previews[data-cat-id="${catId}"][data-type="${type}"]`);
    if (!previewContainer) return;
    
    previewContainer.innerHTML = '';
    
    if (type === 'profile' && customCatsData[catId].profile) {
        const preview = createPreviewElement(customCatsData[catId].profile, catId, type, -1);
        previewContainer.appendChild(preview);
    } else if (type === 'images') {
        customCatsData[catId].images.forEach((imageData, index) => {
            const preview = createPreviewElement(imageData, catId, type, index);
            previewContainer.appendChild(preview);
        });
    }
}

/**
 * Create preview element
 */
function createPreviewElement(imageData, catId, type, index) {
    const preview = document.createElement('div');
    preview.className = type === 'profile' ? 'preview-item profile-preview' : 'preview-item';
    
    const img = document.createElement('img');
    img.src = imageData;
    img.alt = 'Preview';
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-preview-btn';
    removeBtn.textContent = '×';
    removeBtn.title = 'Remove image';
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeImage(catId, type, index);
    });
    
    preview.appendChild(img);
    preview.appendChild(removeBtn);
    
    return preview;
}

/**
 * Remove image from cat
 */
function removeImage(catId, type, index) {
    if (type === 'profile') {
        customCatsData[catId].profile = null;
        
        // Remove has-file class from upload zone
        const uploadZone = document.querySelector(`[data-cat-id="${catId}"][data-type="profile"].upload-zone`);
        if (uploadZone) {
            uploadZone.classList.remove('has-file');
        }
    } else {
        customCatsData[catId].images.splice(index, 1);
    }
    
    updatePreviews(catId, type);
}

/**
 * Remove cat entry
 */
function removeCatEntry(catId) {
    if (confirm('Are you sure you want to remove this cat?')) {
        delete customCatsData[catId];
        
        const catEntry = document.querySelector(`.cat-entry[data-cat-id="${catId}"]`);
        if (catEntry) {
            catEntry.remove();
        }
        
        // Renumber remaining cats
        renumberCats();
        
        showNotification('info', 'Cat removed');
    }
}

/**
 * Renumber cat entries
 */
function renumberCats() {
    const catEntries = document.querySelectorAll('.cat-entry');
    catEntries.forEach((entry, index) => {
        const numberEl = entry.querySelector('.cat-number');
        if (numberEl) {
            numberEl.textContent = index + 1;
        }
    });
}

/**
 * Validate custom cats data
 */
function validateCustomCats() {
    const catIds = Object.keys(customCatsData);
    
    // In mixed mode, only need 1 cat. Otherwise need 2
    const minCats = mixedMode ? 1 : 2;
    
    if (catIds.length < minCats) {
        if (mixedMode) {
            showNotification('error', 'Please add at least 1 custom cat');
        } else {
            showNotification('error', 'Please add at least 2 cats (or enable mixed mode for just 1 cat)');
        }
        return false;
    }
    
    for (const catId of catIds) {
        const cat = customCatsData[catId];
        
        if (!cat.name || cat.name.trim() === '') {
            showNotification('error', 'Please enter a name for all cats');
            return false;
        }
        
        if (!cat.profile) {
            showNotification('error', `Please upload a profile photo for "${cat.name}"`);
            return false;
        }
        
        if (cat.images.length < 3) {
            showNotification('error', `Please upload at least 3 images for "${cat.name}" (currently ${cat.images.length})`);
            return false;
        }
    }
    
    // Check for duplicate names
    const names = catIds.map(id => customCatsData[id].name.toLowerCase());
    const uniqueNames = new Set(names);
    if (names.length !== uniqueNames.size) {
        showNotification('error', 'Please use unique names for each cat');
        return false;
    }
    
    // In mixed mode, check for name conflicts with default cats
    if (mixedMode) {
        const defaultCatNames = Object.keys(cats).map(name => name.toLowerCase());
        for (const name of names) {
            if (defaultCatNames.includes(name)) {
                showNotification('error', `Cat name "${name}" conflicts with default cats. Please use a different name.`);
                return false;
            }
        }
    }
    
    return true;
}

/**
 * Save custom cats to localStorage
 */
function saveCustomCats() {
    if (!validateCustomCats()) {
        return false;
    }
    
    try {
        // Convert to format similar to default cats
        const formattedCats = {};
        Object.keys(customCatsData).forEach(catId => {
            const cat = customCatsData[catId];
            formattedCats[cat.name.toLowerCase()] = {
                profile: cat.profile,
                images: cat.images
            };
        });
        
        localStorage.setItem('lihuaCaptcha_customCats', JSON.stringify(formattedCats));
        localStorage.setItem('lihuaCaptcha_gameMode', 'custom');
        localStorage.setItem('lihuaCaptcha_mixedMode', mixedMode.toString());
        
        showNotification('success', 'Custom cats saved successfully! 🎉');
        return true;
        
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            showNotification('error', 'Storage limit exceeded. Please use fewer or smaller images.');
        } else {
            showNotification('error', 'Failed to save custom cats: ' + error.message);
        }
        return false;
    }
}

/**
 * Load custom cats from localStorage
 */
function loadCustomCats() {
    try {
        const dataStr = localStorage.getItem('lihuaCaptcha_customCats');
        const savedMode = localStorage.getItem('lihuaCaptcha_gameMode');
        const savedMixedMode = localStorage.getItem('lihuaCaptcha_mixedMode');
        
        if (dataStr) {
            const formattedCats = JSON.parse(dataStr);
            
            // Convert back to internal format
            customCatsData = {};
            Object.keys(formattedCats).forEach(catName => {
                const catId = generateCatId();
                customCatsData[catId] = {
                    name: catName,
                    profile: formattedCats[catName].profile,
                    images: formattedCats[catName].images
                };
            });
            
            if (savedMode === 'custom') {
                gameMode = 'custom';
            }
            
            // Load mixed mode preference
            if (savedMixedMode === 'true') {
                mixedMode = true;
            }
        }
        
    } catch (error) {
        console.error('Failed to load custom cats:', error);
        customCatsData = {};
        mixedMode = false;
    }
}

/**
 * Clear all custom cats
 */
function clearAllCustomCats() {
    if (confirm('Are you sure you want to clear all custom cats? This cannot be undone.')) {
        customCatsData = {};
        catEntriesContainer.innerHTML = '';
        
        localStorage.removeItem('lihuaCaptcha_customCats');
        
        showNotification('info', 'All custom cats cleared');
    }
}

/**
 * Switch to default mode
 */
function switchToDefaultMode() {
    gameMode = 'default';
    localStorage.setItem('lihuaCaptcha_gameMode', 'default');
    
    defaultModeBtn.classList.add('active');
    customModeBtn.classList.remove('active');
    customCatBuilder.classList.add('hidden');
    gameArea.classList.remove('hidden');
    editCustomCatsSection.classList.add('hidden');
    
    // Reset stats
    attempts = 0;
    successes = 0;
    attemptsCount.textContent = '0';
    successCount.textContent = '0';
    
    generateChallenge();
    showNotification('info', 'Switched to default cats mode');
}

/**
 * Switch to custom mode
 */
function switchToCustomMode() {
    // Load saved custom cats if available
    loadCustomCats();
    
    gameMode = 'custom';
    
    defaultModeBtn.classList.remove('active');
    customModeBtn.classList.add('active');
    
    // If custom cats exist and are valid, show game area
    const savedCats = localStorage.getItem('lihuaCaptcha_customCats');
    const savedMixedMode = localStorage.getItem('lihuaCaptcha_mixedMode');
    if (savedCats) {
        try {
            const formattedCats = JSON.parse(savedCats);
            const minRequired = (savedMixedMode === 'true') ? 1 : 2;
            
            if (Object.keys(formattedCats).length >= minRequired) {
                customCatBuilder.classList.add('hidden');
                gameArea.classList.remove('hidden');
                editCustomCatsSection.classList.remove('hidden');
                
                // Reset stats
                attempts = 0;
                successes = 0;
                attemptsCount.textContent = '0';
                successCount.textContent = '0';
                
                generateChallenge();
                
                if (savedMixedMode === 'true') {
                    showNotification('info', 'Switched to custom cats mode (mixed with defaults)');
                } else {
                    showNotification('info', 'Switched to custom cats mode');
                }
                return;
            }
        } catch (e) {
            console.error('Error loading custom cats:', e);
        }
    }
    
    // Show builder if no valid custom cats
    customCatBuilder.classList.remove('hidden');
    gameArea.classList.add('hidden');
    editCustomCatsSection.classList.add('hidden');
    
    // Populate builder with loaded cats if any
    populateBuilder();
}

/**
 * Populate builder with existing custom cats
 */
function populateBuilder() {
    catEntriesContainer.innerHTML = '';
    
    // Restore mixed mode checkbox state
    mixedModeCheckbox.checked = mixedMode;
    updateBuilderSubtitle();
    
    if (Object.keys(customCatsData).length === 0) {
        // Add first cat by default
        addCatEntry();
    } else {
        Object.keys(customCatsData).forEach(catId => {
            const cat = customCatsData[catId];
            addCatEntry();
            
            // Set cat name
            const nameInput = document.querySelector(`input[data-cat-id="${catId}"]`);
            if (nameInput) {
                nameInput.value = cat.name;
            }
            
            // Update previews
            if (cat.profile) {
                updatePreviews(catId, 'profile');
            }
            if (cat.images.length > 0) {
                updatePreviews(catId, 'images');
            }
        });
    }
}

/**
 * Update builder subtitle based on mixed mode
 */
function updateBuilderSubtitle() {
    if (mixedMode) {
        builderSubtitle.textContent = 'Add at least 1 cat with 3+ images (will be mixed with default cats)';
    } else {
        builderSubtitle.textContent = 'Add at least 2 cats with 3+ images each';
    }
}

/**
 * Show custom cat builder for editing
 */
function showCustomCatBuilder() {
    customCatBuilder.classList.remove('hidden');
    gameArea.classList.add('hidden');
    populateBuilder();
}

/**
 * Save and start playing custom CAPTCHA
 */
function saveAndPlay() {
    if (saveCustomCats()) {
        customCatBuilder.classList.add('hidden');
        gameArea.classList.remove('hidden');
        editCustomCatsSection.classList.remove('hidden');
        
        // Reset stats
        attempts = 0;
        successes = 0;
        attemptsCount.textContent = '0';
        successCount.textContent = '0';
        
        generateChallenge();
    }
}

/**
 * Get current cat pool based on mode
 */
function getCurrentCatPool() {
    if (gameMode === 'custom') {
        const savedCats = localStorage.getItem('lihuaCaptcha_customCats');
        const savedMixedMode = localStorage.getItem('lihuaCaptcha_mixedMode');
        
        if (savedCats) {
            const customCats = JSON.parse(savedCats);
            
            // If mixed mode is enabled, combine custom and default cats
            if (savedMixedMode === 'true') {
                return { ...cats, ...customCats };
            }
            
            return customCats;
        }
    }
    return cats;
}

/**
 * Initialize the game
 */
function init() {
    // Load saved game mode and custom cats
    const savedMode = localStorage.getItem('lihuaCaptcha_gameMode');
    if (savedMode) {
        gameMode = savedMode;
    }
    
    // Event listeners for game
    verifyButton.addEventListener('click', verifySelection);
    newChallengeButton.addEventListener('click', generateChallenge);
    
    // Event listeners for mode toggle
    defaultModeBtn.addEventListener('click', switchToDefaultMode);
    customModeBtn.addEventListener('click', switchToCustomMode);
    
    // Event listeners for custom cat builder
    addCatBtn.addEventListener('click', addCatEntry);
    saveCustomCatsBtn.addEventListener('click', saveAndPlay);
    clearAllCatsBtn.addEventListener('click', clearAllCustomCats);
    editCustomCatsBtn.addEventListener('click', showCustomCatBuilder);
    
    // Event listener for mixed mode checkbox
    mixedModeCheckbox.addEventListener('change', (e) => {
        mixedMode = e.target.checked;
        updateBuilderSubtitle();
        console.log('Mixed mode:', mixedMode);
    });
    
    // Initialize based on saved mode
    if (gameMode === 'custom') {
        const savedCats = localStorage.getItem('lihuaCaptcha_customCats');
        const savedMixedMode = localStorage.getItem('lihuaCaptcha_mixedMode');
        if (savedCats) {
            try {
                const formattedCats = JSON.parse(savedCats);
                const minRequired = (savedMixedMode === 'true') ? 1 : 2;
                
                if (Object.keys(formattedCats).length >= minRequired) {
                    // Valid custom cats exist, start in custom mode
                    customModeBtn.classList.add('active');
                    defaultModeBtn.classList.remove('active');
                    gameArea.classList.remove('hidden');
                    editCustomCatsSection.classList.remove('hidden');
                    generateChallenge();
                    
                    if (savedMixedMode === 'true') {
                        console.log('Cat CAPTCHA initialized in custom mode (mixed)!');
                    } else {
                        console.log('Cat CAPTCHA initialized in custom mode!');
                    }
                    return;
                }
            } catch (e) {
                console.error('Error loading custom cats:', e);
            }
        }
    }
    
    // Default mode initialization
    gameMode = 'default';
    defaultModeBtn.classList.add('active');
    gameArea.classList.remove('hidden');
    generateChallenge();
    
    console.log('Cat CAPTCHA initialized in default mode!');
}

// ===== Start the game =====
document.addEventListener('DOMContentLoaded', init);
