/**
 * Fashion Chatbot Frontend Application - Enhanced Version
 * With seamless animations, advanced UI components, and comprehensive error handling
 */

// Application configuration
const CONFIG = {
    API_BASE_URL: '/api.php',
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    RETRY_ATTEMPTS: 3,
    REQUEST_TIMEOUT: 60000, // 60 seconds
    STATUS_CHECK_INTERVAL: 60000 // 1 minute
};

// Global application state
const AppState = {
    userId: 'web_user_' + Math.random().toString(36).substr(2, 9),
    selectedImage: null,
    isProcessing: false,
    messageHistory: [],
    retryCount: 0,
    typingIndicator: null
};

// DOM element references
let elements = {};

/**
 * Enhanced Animation Controller for seamless UI animations
 */
const AnimationController = {
    // Animate message appearance with smooth transitions
    animateMessage: function(messageElement, isUser = false) {
        messageElement.style.opacity = '0';
        messageElement.style.transform = isUser ? 
            'translateX(30px) scale(0.9)' : 
            'translateX(-30px) scale(0.9)';
        
        requestAnimationFrame(() => {
            messageElement.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateX(0) scale(1)';
        });
    },

    // Show elegant typing indicator with bouncing dots
    showTypingIndicator: function() {
        // Remove existing typing indicator
        this.removeTypingIndicator();
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'assistant-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-content typing-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <span class="typing-text">Fashion AI is thinking...</span>
            </div>
        `;
        
        elements.chatContainer.appendChild(typingDiv);
        this.animateMessage(typingDiv, false);
        scrollToBottom();
        
        AppState.typingIndicator = typingDiv;
        return typingDiv;
    },

    // Remove typing indicator
    removeTypingIndicator: function() {
        if (AppState.typingIndicator) {
            AppState.typingIndicator.style.opacity = '0';
            AppState.typingIndicator.style.transform = 'translateX(-30px) scale(0.9)';
            setTimeout(() => {
                if (AppState.typingIndicator && AppState.typingIndicator.parentNode) {
                    AppState.typingIndicator.parentNode.removeChild(AppState.typingIndicator);
                }
                AppState.typingIndicator = null;
            }, 300);
        }
    },

    // Button press animation with haptic feedback feel
    animateButtonPress: function(button) {
        if (!button) return;
        
        button.style.transform = 'scale(0.95)';
        button.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            button.style.transform = '';
            button.style.transition = '';
        }, 150);
    },

    // Input focus animation with elevation effect
    animateInputFocus: function(input) {
        const container = input.closest('.input-container');
        if (container) {
            container.style.transform = 'translateY(-2px)';
            container.style.boxShadow = '0 0 0 4px rgba(11, 147, 246, 0.1), 0 8px 25px rgba(11, 147, 246, 0.15)';
            container.style.borderColor = '#0b93f6';
        }
    },

    // Input blur animation
    animateInputBlur: function(input) {
        const container = input.closest('.input-container');
        if (container) {
            container.style.transform = '';
            container.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.05)';
            container.style.borderColor = '#e9ecef';
        }
    },

    // Suggestion button hover animation
    animateSuggestionHover: function(button, isHover) {
        if (isHover) {
            button.style.transform = 'translateY(-8px) scale(1.05)';
            button.style.boxShadow = '0 10px 25px rgba(11, 147, 246, 0.3)';
        } else {
            button.style.transform = '';
            button.style.boxShadow = '';
        }
    },

    // Image preview animation
    animateImagePreview: function(previewContainer) {
        previewContainer.style.opacity = '0';
        previewContainer.style.transform = 'translateY(20px) scale(0.9)';
        previewContainer.style.display = 'block';
        
        requestAnimationFrame(() => {
            previewContainer.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            previewContainer.style.opacity = '1';
            previewContainer.style.transform = 'translateY(0) scale(1)';
        });
    },

    // Status update animation
    animateStatusChange: function(statusElement, isConnected) {
        statusElement.style.transform = 'scale(1.1)';
        statusElement.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            statusElement.style.transform = '';
        }, 300);
    },

    // Page load stagger animation
    staggerPageLoad: function() {
        const elements = [
            document.querySelector('.header'),
            document.querySelector('.suggestions-section'),
            document.querySelector('.chat-container'),
            document.querySelector('.input-section'),
            document.querySelector('.status-indicator')
        ];

        elements.forEach((element, index) => {
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    element.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }
};

/**
 * Initialize the application with enhanced animations
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    injectCustomCSS();
    setupEventListeners();
    initializeApp();
    
    // Apply staggered page load animation
    AnimationController.staggerPageLoad();
    
    // Focus on input for immediate use
    setTimeout(() => {
        elements.messageInput?.focus();
    }, 800);
    
    console.log('Enhanced Fashion Chatbot initialized successfully');
});

/**
 * Inject additional CSS for enhanced animations
 */
function injectCustomCSS() {
    const customCSS = `
        <style id="enhanced-animations">
        /* Typing indicator styles */
        .typing-indicator .typing-content {
            background: linear-gradient(135deg, #f1f3f4 0%, #ffffff 100%);
            padding: 15px 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .typing-dots {
            display: flex;
            gap: 4px;
        }

        .typing-dots span {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: linear-gradient(135deg, #0b93f6, #0084e3);
            animation: typingBounce 1.4s ease-in-out infinite both;
        }

        .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typingBounce {
            0%, 80%, 100% {
                transform: scale(0.3);
                opacity: 0.3;
            }
            40% {
                transform: scale(1);
                opacity: 1;
            }
        }

        .typing-text {
            font-size: 14px;
            color: #666;
            font-style: italic;
        }

        /* Button ripple effect */
        .button-ripple {
            position: relative;
            overflow: hidden;
        }

        .button-ripple::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: translate(-50%, -50%);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        }

        @keyframes ripple {
            to {
                width: 300px;
                height: 300px;
                opacity: 0;
            }
        }

        /* Enhanced message animations */
        .message-slide-in {
            animation: messageSlideIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
        }

        @keyframes messageSlideIn {
            from { 
                opacity: 0; 
                transform: translateY(20px) scale(0.95);
            }
            to { 
                opacity: 1; 
                transform: translateY(0) scale(1);
            }
        }

        /* Floating animation for elements */
        .float-animation {
            animation: floatAnimation 3s ease-in-out infinite;
        }

        @keyframes floatAnimation {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
        }

        /* Pulse animation for status indicators */
        .pulse-animation {
            animation: pulseAnimation 2s ease-in-out infinite;
        }

        @keyframes pulseAnimation {
            0%, 100% { 
                opacity: 1; 
                transform: scale(1);
            }
            50% { 
                opacity: 0.7; 
                transform: scale(1.05);
            }
        }

        /* Smooth transitions for all interactive elements */
        .smooth-transition {
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        /* Error shake animation */
        .error-shake {
            animation: errorShake 0.5s ease-in-out;
        }

        @keyframes errorShake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }

        /* Success bounce animation */
        .success-bounce {
            animation: successBounce 0.6s ease-out;
        }

        @keyframes successBounce {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', customCSS);
}

/**
 * Cache DOM elements for better performance
 */
function initializeElements() {
    elements = {
        chatContainer: document.getElementById('chatContainer'),
        messageInput: document.getElementById('messageInput'),
        imageInput: document.getElementById('imageInput'),
        imagePreview: document.getElementById('imagePreview'),
        previewImg: document.getElementById('previewImg'),
        loadingModal: document.getElementById('loadingModal'),
        statusIndicator: document.getElementById('statusIndicator'),
        statusText: document.getElementById('statusText'),
        sendBtn: document.querySelector('.send-btn'),
        fileUploadBtn: document.querySelector('.file-upload-btn'),
        suggestionBtns: document.querySelectorAll('.suggestion-btn')
    };
    
    // Validate required elements
    const requiredElements = ['chatContainer', 'messageInput', 'sendBtn'];
    for (const elementName of requiredElements) {
        if (!elements[elementName]) {
            console.error(`Required element not found: ${elementName}`);
        }
    }
}

/**
 * Set up all event listeners with enhanced animations
 */
function setupEventListeners() {
    // Message input events
    if (elements.messageInput) {
        elements.messageInput.addEventListener('keypress', handleKeyPress);
        elements.messageInput.addEventListener('paste', handleTextPaste);
        elements.messageInput.addEventListener('input', handleInputChange);
        elements.messageInput.addEventListener('focus', handleInputFocus);
        elements.messageInput.addEventListener('blur', handleInputBlur);
    }
    
    // Image upload events
    if (elements.imageInput) {
        elements.imageInput.addEventListener('change', handleImageSelection);
    }
    
    // Send button with ripple effect
    if (elements.sendBtn) {
        elements.sendBtn.addEventListener('click', handleSendClick);
        addRippleEffect(elements.sendBtn);
    }
    
    // File upload button
    if (elements.fileUploadBtn) {
        elements.fileUploadBtn.addEventListener('click', handleFileUploadClick);
        addRippleEffect(elements.fileUploadBtn);
    }
    
    // Suggestion buttons with hover animations
    elements.suggestionBtns.forEach((btn, index) => {
        btn.addEventListener('click', (e) => handleSuggestionClick(e, btn));
        btn.addEventListener('mouseenter', (e) => handleSuggestionHover(e, true));
        btn.addEventListener('mouseleave', (e) => handleSuggestionHover(e, false));
        addRippleEffect(btn);
        
        // Stagger button appearance
        btn.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Global paste event for images
    document.addEventListener('paste', handleImagePaste);
    
    // Window events
    window.addEventListener('resize', debounce(handleWindowResize, 250));
    window.addEventListener('beforeunload', saveCurrentState);
    
    // Prevent form submission
    const form = elements.messageInput?.closest('form');
    if (form) {
        form.addEventListener('submit', (e) => e.preventDefault());
    }
}

/**
 * Initialize the application
 */
function initializeApp() {
    checkBackendStatus();
    
    // Set up periodic status checks
    setInterval(checkBackendStatus, CONFIG.STATUS_CHECK_INTERVAL);
    
    // Load any saved state
    loadSavedState();
    
    // Initialize smooth transitions
    addSmoothTransitions();
}

/**
 * Event Handlers with Enhanced Animations
 */

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function handleTextPaste(event) {
    setTimeout(() => {
        adjustInputHeight();
        updateSendButtonState();
    }, 0);
}

function handleInputChange(event) {
    adjustInputHeight();
    updateSendButtonState();
}

function handleInputFocus(event) {
    AnimationController.animateInputFocus(event.target);
}

function handleInputBlur(event) {
    AnimationController.animateInputBlur(event.target);
}

function handleImageSelection(event) {
    const file = event.target.files[0];
    if (file) {
        processSelectedImage(file);
    }
}

function handleSendClick(event) {
    AnimationController.animateButtonPress(elements.sendBtn);
    setTimeout(sendMessage, 100);
}

function handleFileUploadClick(event) {
    AnimationController.animateButtonPress(elements.fileUploadBtn);
    setTimeout(() => {
        elements.imageInput?.click();
    }, 100);
}

function handleSuggestionClick(event, button) {
    AnimationController.animateButtonPress(button);
    const suggestion = button.textContent.trim();
    setTimeout(() => {
        selectSuggestion(suggestion);
    }, 100);
}

function handleSuggestionHover(event, isHover) {
    // Hover animation is handled by CSS, but we can add extra effects here if needed
}

function handleImagePaste(event) {
    const items = event.clipboardData?.items;
    if (!items) return;
    
    for (let item of items) {
        if (item.type.startsWith('image/')) {
            event.preventDefault();
            const file = item.getAsFile();
            if (file) {
                processSelectedImage(file);
                showSuccessMessage('Image pasted from clipboard!');
            }
            break;
        }
    }
}

function handleWindowResize() {
    scrollToBottom();
    adjustInputHeight();
}


/**
 * Core Functions with Enhanced Animations
 */

function processSelectedImage(file) {
    // Validate file type
    if (!CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
        showError('Invalid file type. Please upload JPG, PNG, GIF, or WebP images only.');
        return;
    }
    
    // Validate file size
    if (file.size > CONFIG.MAX_FILE_SIZE) {
        const sizeMB = (CONFIG.MAX_FILE_SIZE / (1024 * 1024)).toFixed(1);
        showError(`Image too large. Please upload an image smaller than ${sizeMB}MB.`);
        return;
    }
    
    AppState.selectedImage = file;
    displayImagePreview(file);
    
    // Auto-focus on message input with animation
    setTimeout(() => {
        elements.messageInput?.focus();
        showSuccessMessage('Image ready for analysis!');
    }, 400);
}

function displayImagePreview(file) {
    if (!elements.imagePreview || !elements.previewImg) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        elements.previewImg.src = e.target.result;
        
        // Animate the preview appearance
        AnimationController.animateImagePreview(elements.imagePreview);
        
        // Add image info tooltip
        const sizeKB = (file.size / 1024).toFixed(1);
        const sizeText = sizeKB > 1024 ? 
            (sizeKB / 1024).toFixed(1) + ' MB' : 
            sizeKB + ' KB';
        
        elements.previewImg.title = `${file.name} (${sizeText})`;
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    if (elements.imagePreview) {
        elements.imagePreview.style.opacity = '0';
        elements.imagePreview.style.transform = 'translateY(20px) scale(0.9)';
        
        setTimeout(() => {
            elements.imagePreview.style.display = 'none';
            elements.imagePreview.style.opacity = '1';
            elements.imagePreview.style.transform = '';
        }, 300);
    }
    
    AppState.selectedImage = null;
    
    if (elements.imageInput) {
        elements.imageInput.value = '';
    }
    
    elements.messageInput?.focus();
}

function selectSuggestion(suggestion) {
    if (elements.messageInput) {
        // Clear current value with animation
        elements.messageInput.style.transform = 'scale(0.98)';
        elements.messageInput.value = '';
        
        setTimeout(() => {
            elements.messageInput.value = suggestion;
            elements.messageInput.style.transform = '';
            adjustInputHeight();
            updateSendButtonState();
        }, 100);
    }
    
    elements.messageInput?.focus();
    
    // Auto-send after a brief delay
    setTimeout(() => {
        sendMessage();
    }, 500);
}

/**
 * Enhanced send message with typing indicator and animations
 */
async function sendMessage() {
    if (AppState.isProcessing) return;
    
    const message = elements.messageInput?.value.trim() || '';
    // Intercept the 'Who created you' question BEFORE calling the backend!
    if (message.toLowerCase().includes('who created you')) {
        addMessage('assistant', "I was developed by Sumit to help you with fashion advice. We're here to make your style journey easy and fun✨👗🧑‍💻!");
        clearInput();
        return;
    }

    // ...rest of your existing code, including adding user message and making backend API call
    
    // Validate input
    if (!message && !AppState.selectedImage) {
        showError('Please enter a message or select an image.');
        animateInputError();
        elements.messageInput?.focus();
        return;
    }
    
    AppState.isProcessing = true;
    updateSendButtonState();
    
    // Add success feedback to send button
    elements.sendBtn?.classList.add('success-bounce');
    setTimeout(() => {
        elements.sendBtn?.classList.remove('success-bounce');
    }, 600);
    
    try {
        // Display user message with animation
        const userMessage = message || 'Please analyze this image and provide fashion advice';
        addMessage('user', userMessage, AppState.selectedImage);
        
        // Store the current image reference
        const currentImage = AppState.selectedImage;
        
        // Clear input and image with animation
        clearInput();
        
        // Show typing indicator
        AnimationController.showTypingIndicator();
        
        // Call API
        const response = await callAPI(userMessage, currentImage);
        
        // Remove typing indicator
        AnimationController.removeTypingIndicator();
        
        // Process response
        if (response.success !== false) {
            const botResponse = response.answer || response.response || 
                'I received your message but couldn\'t generate a proper response. Please try again.';
            
            addMessage('assistant', botResponse, null, {
                imageAnalyzed: response.image_analyzed,
                tokensUsed: response.tokens_used,
                modelUsed: response.model_used
            });
            
            AppState.retryCount = 0;
            showSuccessMessage('Response received!');
        } else {
            handleAPIError(response, userMessage, currentImage);
        }
        
    } catch (error) {
        console.error('Send message error:', error);
        AnimationController.removeTypingIndicator();
        handleNetworkError(error);
    } finally {
        AppState.isProcessing = false;
        updateSendButtonState();
        elements.messageInput?.focus();
    }
}

/**
 * Enhanced API call function
 */
async function callAPI(message, imageFile) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT);
    
    try {
        const formData = new FormData();
        formData.append('user_id', AppState.userId);
        formData.append('message', message);
        
        if (imageFile) {
            formData.append('image', imageFile);
        }
        
        const response = await fetch(CONFIG.API_BASE_URL, {
            method: 'POST',
            body: formData,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Server returned non-JSON response');
        }
        
        return await response.json();
        
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            throw new Error('Request timed out. Please try again.');
        }
        
        throw error;
    }
}

/**
 * Enhanced message addition with smooth animations
 */
function addMessage(sender, content, image = null, metadata = {}) {
    if (!elements.chatContainer) return;
    
    // Create message wrapper
    const messageDiv = document.createElement('div');
    messageDiv.className = `${sender}-message`;
    messageDiv.setAttribute('data-timestamp', new Date().toISOString());
    
    // Create content container
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (sender === 'user') {
        // User message styling
        if (image) {
            contentDiv.innerHTML = `<strong>📸 Image uploaded:</strong><br>${escapeHtml(content)}`;
        } else {
            contentDiv.textContent = content;
        }
        
        // Add image preview for user messages
        if (image) {
            const imgElement = createImageElement(image);
            messageDiv.appendChild(imgElement);
        }
    } else {
        // Assistant message with rich formatting
        contentDiv.innerHTML = formatBotResponse(content);
        
        // Add metadata if available
        if (metadata.imageAnalyzed) {
            const metaDiv = document.createElement('div');
            metaDiv.className = 'message-metadata';
            metaDiv.innerHTML = `<small style="color: #666; font-size: 12px; margin-top: 8px; display: block;">🔍 Image analyzed ${metadata.tokensUsed ? `• ${metadata.tokensUsed} tokens used` : ''}</small>`;
            contentDiv.appendChild(metaDiv);
        }
    }
    
    messageDiv.appendChild(contentDiv);
    elements.chatContainer.appendChild(messageDiv);
    
    // Animate the message
    AnimationController.animateMessage(messageDiv, sender === 'user');
    
    // Store in history
    AppState.messageHistory.push({
        sender,
        content,
        hasImage: !!image,
        timestamp: new Date().toISOString(),
        metadata
    });
    
    scrollToBottom();
}

/**
 * Create image element with enhanced animations
 */
function createImageElement(imageFile) {
    const imgElement = document.createElement('img');
    imgElement.className = 'message-image';
    imgElement.alt = 'Uploaded fashion image';
    imgElement.loading = 'lazy';
    
    // Initial state for animation
    imgElement.style.opacity = '0';
    imgElement.style.transform = 'scale(0.8)';
    
    // Create object URL for preview
    const objectURL = URL.createObjectURL(imageFile);
    imgElement.src = objectURL;
    
    // Animate when image loads
    imgElement.onload = () => {
        imgElement.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        imgElement.style.opacity = '1';
        imgElement.style.transform = 'scale(1)';
        URL.revokeObjectURL(objectURL);
    };
    
    // Error handling
    imgElement.onerror = () => {
        imgElement.style.display = 'none';
        URL.revokeObjectURL(objectURL);
    };
    
    return imgElement;
}

/**
 * Enhanced response formatting with animations
 */
function formatBotResponse(content) {
    return content
        // Headers
        .replace(/### (.*)/g, '<h3 class="response-header" style="color: #0b93f6; margin: 15px 0 8px 0; font-size: 1.1em;">$1</h3>')
        .replace(/## (.*)/g, '<h2 class="response-header" style="color: #0b93f6; margin: 20px 0 10px 0; font-size: 1.2em;">$1</h2>')
        
        // Bold and italic text
        .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #333;">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em style="color: #666;">$1</em>')
        
        // Lists with better styling
        .replace(/^\• (.+)$/gm, '<li style="margin: 5px 0;">$1</li>')
        .replace(/(<li[^>]*>.*<\/li>)/gs, '<ul style="margin: 10px 0; padding-left: 20px;">$1</ul>')
        
        // Numbered lists
        .replace(/^\d+\. (.+)$/gm, '<li style="margin: 5px 0;">$1</li>')
        .replace(/(<li[^>]*>.*<\/li>)/gs, (match) => {
            if (match.includes('<ul>')) return match;
            return `<ol style="margin: 10px 0; padding-left: 20px;">${match}</ol>`;
        })
        
        // Line breaks and paragraphs
        .replace(/\n\n/g, '</p><p style="margin: 10px 0;">')
        .replace(/\n/g, '<br>')
        
        // Wrap in paragraphs
        .replace(/^(.+)/, '<p style="margin: 10px 0;">$1')
        .replace(/(.+)$/, '$1</p>')
        
        // Clean up
        .replace(/<p[^>]*><\/p>/g, '')
        .replace(/<p[^>]*>(<[hou]l>)/g, '$1')
        .replace(/(<\/[hou]l>)<\/p>/g, '$1');
}

/**
 * Enhanced error handling with animations
 */
function handleAPIError(response, originalMessage, originalImage) {
    const errorMessage = response.error || 'Unknown error occurred';
    
    if (AppState.retryCount < CONFIG.RETRY_ATTEMPTS) {
        AppState.retryCount++;
        
        addMessage('assistant', `❌ Error: ${errorMessage}\n\n🔄 Retrying... (Attempt ${AppState.retryCount}/${CONFIG.RETRY_ATTEMPTS})`);
        
        setTimeout(() => {
            sendRetryMessage(originalMessage, originalImage);
        }, 2000 * AppState.retryCount);
    } else {
        const fallbackMessage = response.answer || 
            'I encountered multiple errors while processing your request. Please try again later or contact support if the problem persists.';
        
        addMessage('assistant', `❌ ${fallbackMessage}`);
        AppState.retryCount = 0;
        showError('Maximum retry attempts reached. Please try again later.');
    }
}

function handleNetworkError(error) {
    const message = error.message.includes('timeout') ?
        'The request timed out. Please check your connection and try again.' :
        `Connection error: ${error.message}. Please check your internet connection.`;
    
    addMessage('assistant', `🌐 ${message}`);
    showError(message);
}

/**
 * Retry mechanism with enhanced feedback
 */
async function sendRetryMessage(message, image) {
    try {
        AnimationController.showTypingIndicator();
        const response = await callAPI(message, image);
        AnimationController.removeTypingIndicator();
        
        if (response.success !== false) {
            const botResponse = response.answer || 'Retry successful!';
            addMessage('assistant', botResponse, null, {
                imageAnalyzed: response.image_analyzed,
                isRetry: true
            });
            AppState.retryCount = 0;
            showSuccessMessage('Successfully retried!');
        } else {
            handleAPIError(response, message, image);
        }
    } catch (error) {
        AnimationController.removeTypingIndicator();
        handleNetworkError(error);
    }
}

/**
 * UI Helper Functions with Animations
 */

function clearInput() {
    if (elements.messageInput) {
        elements.messageInput.style.transform = 'scale(0.98)';
        setTimeout(() => {
            elements.messageInput.value = '';
            elements.messageInput.style.transform = '';
            adjustInputHeight();
        }, 100);
    }
    
    removeImage();
    updateSendButtonState();
}

function showLoading() {
    if (elements.loadingModal) {
        elements.loadingModal.style.display = 'flex';
        elements.loadingModal.style.opacity = '0';
        
        requestAnimationFrame(() => {
            elements.loadingModal.style.transition = 'opacity 0.3s ease';
            elements.loadingModal.style.opacity = '1';
        });
    }
}

function hideLoading() {
    if (elements.loadingModal) {
        elements.loadingModal.style.opacity = '0';
        setTimeout(() => {
            elements.loadingModal.style.display = 'none';
        }, 300);
    }
}

async function checkBackendStatus() {
    try {
        const response = await fetch(CONFIG.API_BASE_URL, {
            method: 'GET',
            timeout: 10000
        });
        
        if (response.ok) {
            const data = await response.json();
            updateStatus(true, data.message || 'Connected & Ready');
        } else {
            updateStatus(false, `HTTP ${response.status}`);
        }
    } catch (error) {
        updateStatus(false, 'Connection Failed');
    }
}

function updateStatus(connected, message) {
    if (!elements.statusIndicator || !elements.statusText) return;
    
    const statusDot = elements.statusIndicator.querySelector('.status-dot');
    if (statusDot) {
        statusDot.className = connected ? 'status-dot' : 'status-dot disconnected';
        AnimationController.animateStatusChange(statusDot, connected);
    }
    
    elements.statusText.textContent = message;
}

function updateSendButtonState() {
    if (!elements.sendBtn) return;
    
    const hasContent = (elements.messageInput?.value.trim() || '') || AppState.selectedImage;
    const shouldDisable = AppState.isProcessing || !hasContent;
    
    elements.sendBtn.disabled = shouldDisable;
    elements.sendBtn.style.opacity = shouldDisable ? '0.5' : '1';
    elements.sendBtn.style.transform = shouldDisable ? 'scale(0.95)' : '';
}

function scrollToBottom() {
    if (elements.chatContainer) {
        elements.chatContainer.scrollTo({
            top: elements.chatContainer.scrollHeight,
            behavior: 'smooth'
        });
    }
}

function adjustInputHeight() {
    if (!elements.messageInput) return;
    
    elements.messageInput.style.height = 'auto';
    const newHeight = Math.min(elements.messageInput.scrollHeight, 120);
    elements.messageInput.style.height = newHeight + 'px';
}



/**
 * Enhanced notification system
 */
function showSuccessMessage(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
    
    // Animate input container on error
    if (elements.messageInput) {
        animateInputError();
    }
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #28a745, #20c997)' : 'linear-gradient(135deg, #dc3545, #fd7e14)'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 300px;
        font-size: 14px;
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function animateInputError() {
    const container = elements.messageInput?.closest('.input-container');
    if (container) {
        container.classList.add('error-shake');
        setTimeout(() => {
            container.classList.remove('error-shake');
        }, 500);
    }
}

/**
 * Utility Functions
 */

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function addRippleEffect(button) {
    button.addEventListener('click', function(e) {
        // Remove existing ripple
        this.classList.remove('button-ripple');
        
        // Force reflow
        this.offsetWidth;
        
        // Add ripple effect
        this.classList.add('button-ripple');
        
        // Remove after animation
        setTimeout(() => {
            this.classList.remove('button-ripple');
        }, 600);
    });
}

function addSmoothTransitions() {
    // Add smooth transition class to interactive elements
    const interactiveElements = document.querySelectorAll(
        'button, .suggestion-btn, .message-content, input, .file-upload-btn, .send-btn'
    );
    
    interactiveElements.forEach(element => {
        element.classList.add('smooth-transition');
    });
}

function loadSavedState() {
    try {
        const savedState = localStorage.getItem('fashion_chatbot_state');
        if (savedState) {
            const parsed = JSON.parse(savedState);
            if (parsed.userId) {
                AppState.userId = parsed.userId;
            }
        }
    } catch (e) {
        console.warn('Failed to load saved state:', e);
    }
}

function saveCurrentState() {
    try {
        const stateToSave = {
            userId: AppState.userId,
            messageHistory: AppState.messageHistory.slice(-50),
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('fashion_chatbot_state', JSON.stringify(stateToSave));
    } catch (e) {
        console.warn('Failed to save state:', e);
    }
}

// Global functions for HTML onclick events
window.selectSuggestion = selectSuggestion;
window.removeImage = removeImage;

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        AppState, 
        CONFIG, 
        sendMessage, 
        selectSuggestion, 
        AnimationController 
    };
}

// Initialize performance monitoring
console.log('Enhanced Fashion Chatbot script loaded successfully');
