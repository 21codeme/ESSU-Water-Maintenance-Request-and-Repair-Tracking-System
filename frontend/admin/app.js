// ESSU Water Maintenance Portal - Main JavaScript File

// Global configuration
// Auto-detect API base URL based on current protocol and port
const getApiBaseUrl = () => {
    // Check for environment variable (for production deployment)
    // In Vercel, you can set this in Environment Variables
    // Or use a script tag in HTML: <script>window.API_URL = 'https://your-backend.com/api';</script>
    if (window.API_URL) {
        return window.API_URL;
    }
    
    // If running from file:// protocol, use localhost server
    if (window.location.protocol === 'file:') {
        return 'http://localhost:3000/api';
    }
    
    // Get current origin and port
    const currentPort = window.location.port;
    const currentHost = window.location.hostname;
    
    // Detect production environment (not localhost/127.0.0.1)
    const isProduction = currentHost !== 'localhost' && 
                         currentHost !== '127.0.0.1' && 
                         !currentHost.startsWith('192.168.') &&
                         !currentHost.startsWith('10.') &&
                         currentHost !== '0.0.0.0';
    
    if (isProduction) {
        // In production, try to use same origin with /api, or construct from current origin
        // If backend is on same domain, use relative path
        // Otherwise, you need to set window.API_URL before this script loads
        console.warn('Production mode detected. Using relative API path. Make sure backend is on same domain or set window.API_URL.');
        return '/api';
    }
    
    // Development mode: If frontend is served on a different port (not 3000), use backend on port 3000
    // This handles cases like VS Code Live Server (port 5500) or other dev servers
    if (currentPort && currentPort !== '3000') {
        // Auto-detect and connect to backend on port 3000 (silent - no console warning)
        return `http://${currentHost}:3000/api`;
    }
    
    // Otherwise use relative path (when served by same server)
    return '/api';
};

const CONFIG = {
    API_BASE_URL: getApiBaseUrl(),
    TOKEN_KEY: 'token',
    USER_KEY: 'user',
    REFRESH_INTERVAL: 30000, // 30 seconds
    MAX_FILE_SIZE: 3 * 1024 * 1024, // 3MB
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};

// Utility functions
const Utils = {
    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Format date for relative time (e.g., "2 hours ago")
    formatRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        
        return this.formatDate(dateString);
    },

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validate file type and size
    validateFile(file) {
        if (!CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
            return { valid: false, error: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)' };
        }
        
        if (file.size > CONFIG.MAX_FILE_SIZE) {
            return { valid: false, error: 'File size must be less than 3MB' };
        }
        
        return { valid: true };
    },

    // Show loading state
    showLoading(element, text = 'Loading...') {
        element.innerHTML = `<div class="loading">${text}</div>`;
    },

    // Show error state
    showError(element, message = 'An error occurred') {
        element.innerHTML = `<div class="error"><h3>Error</h3><p>${message}</p></div>`;
    },

    // Show empty state
    showEmpty(element, message = 'No data available') {
        element.innerHTML = `<div class="no-data">${message}</div>`;
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// API service
const API = {
    // Get authentication headers
    getAuthHeaders() {
        const token = localStorage.getItem(CONFIG.TOKEN_KEY);
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    },

    // Make authenticated request
    async request(url, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...this.getAuthHeaders(),
            ...options.headers
        };

        const response = await fetch(url, {
            ...options,
            headers
        });

        if (!response.ok) {
            // Try to get error message from response
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } catch (e) {
                // If response is not JSON, use status text
            }
            
            if (response.status === 401) {
                // For login endpoints, don't trigger handleAuthError
                // Just throw the error message
                if (url.includes('/auth/login')) {
                    throw new Error(errorMessage);
                }
                // Token expired or invalid for authenticated endpoints
                this.handleAuthError();
                throw new Error('Authentication required');
            }
            
            throw new Error(errorMessage);
        }

        return response.json();
    },

    // Handle authentication error
    handleAuthError() {
        localStorage.removeItem(CONFIG.TOKEN_KEY);
        localStorage.removeItem(CONFIG.USER_KEY);
        
        // Redirect to login if not already there
        if (!window.location.pathname.includes('login')) {
            window.location.href = '../login/index.html';
        }
    },

    // Authentication endpoints
    auth: {
        async login(email, password) {
            return API.request(`${CONFIG.API_BASE_URL}/auth/login`, {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
        },

        async register(userData) {
            return API.request(`${CONFIG.API_BASE_URL}/auth/register`, {
                method: 'POST',
                body: JSON.stringify(userData)
            });
        }
    },

    // Reports endpoints
    reports: {
        async getAll(filters = {}) {
            const queryParams = new URLSearchParams(filters);
            const url = queryParams.toString() 
                ? `${CONFIG.API_BASE_URL}/reports?${queryParams}`
                : `${CONFIG.API_BASE_URL}/reports`;
            
            return API.request(url);
        },

        async getById(id) {
            return API.request(`${CONFIG.API_BASE_URL}/reports/${id}`);
        },

        async create(reportData) {
            try {
                const formData = new FormData();
                
                // Log what we're about to send
                console.log('📦 Preparing FormData with:', reportData);
                
                // Required fields that must be present
                const requiredFields = ['reporter_name', 'email', 'location', 'issue_type', 'description'];
                
                Object.keys(reportData).forEach(key => {
                    const value = reportData[key];
                    // Always append required fields (even if empty) so backend can validate
                    // For optional fields (like image), only append if value exists
                    if (requiredFields.includes(key)) {
                        // Always append required fields (backend will validate)
                        formData.append(key, value || '');
                        console.log(`  ${value && value.length > 0 ? '✅' : '⚠️'} Added ${key}: "${value || ''}" ${value && value.length > 0 ? '' : '(EMPTY - will fail validation)'}`);
                    } else if (value !== null && value !== undefined && value !== '') {
                        // For optional fields, only append if value exists
                        formData.append(key, value);
                        console.log(`  ✅ Added ${key}: ${value instanceof File ? `[File] ${value.name}` : `"${value}"`}`);
                    } else {
                        console.log(`  ⏭️ Skipped optional ${key}: ${value === '' ? 'empty string' : value === null ? 'null' : 'undefined'}`);
                    }
                });
                
                // Log FormData contents
                console.log('📋 FormData contents:');
                for (const [key, value] of formData.entries()) {
                    if (value instanceof File) {
                        console.log(`  ${key}: [File] ${value.name} (${value.size} bytes, type: ${value.type})`);
                    } else {
                        console.log(`  ${key}: "${value}" (type: ${typeof value})`);
                    }
                }

                console.log('🌐 API Request:', {
                    url: `${CONFIG.API_BASE_URL}/reports`,
                    method: 'POST',
                    hasFormData: true,
                    apiBaseUrl: CONFIG.API_BASE_URL,
                    formDataEntries: Array.from(formData.keys())
                });

                // Note: Creating reports is public (no auth required)
                const response = await fetch(`${CONFIG.API_BASE_URL}/reports`, {
                    method: 'POST',
                    body: formData
                }).catch(error => {
                    console.error('❌ Network Error (fetch failed):', error);
                    console.error('This usually means the backend server is not running!');
                    console.error('Please start the backend server: cd backend && npm run dev');
                    throw new Error(`Cannot connect to backend server. Make sure the backend is running on port 3000. Error: ${error.message}`);
                });

                console.log('📡 API Response:', {
                    status: response.status,
                    statusText: response.statusText,
                    ok: response.ok,
                    headers: Object.fromEntries(response.headers.entries())
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error('❌ API Error Response:', errorData);
                    throw new Error(errorData.error || `Failed to create report (${response.status} ${response.statusText})`);
                }

                const result = await response.json();
                console.log('✅ API Success:', result);
                return result;
            } catch (error) {
                console.error('❌ Error in API.create:', error);
                if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                    throw new Error('Cannot connect to backend server. Please make sure the backend server is running on port 3000. Start it with: cd backend && npm run dev');
                }
                throw error;
            }
        },

        async update(id, updateData) {
            return API.request(`${CONFIG.API_BASE_URL}/reports/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updateData)
            });
        },

        async delete(id) {
            return API.request(`${CONFIG.API_BASE_URL}/reports/${id}`, {
                method: 'DELETE'
            });
        },

        async getPublic() {
            const response = await fetch(`${CONFIG.API_BASE_URL}/reports/public`);
            if (!response.ok) {
                throw new Error('Failed to fetch public reports');
            }
            return response.json();
        }
    },

    // Users endpoints
    users: {
        async getAll() {
            return API.request(`${CONFIG.API_BASE_URL}/users`);
        },

        async getById(id) {
            return API.request(`${CONFIG.API_BASE_URL}/users/${id}`);
        }
    },

    // Health check
    async healthCheck() {
        const response = await fetch(`${CONFIG.API_BASE_URL}/health`);
        if (!response.ok) {
            throw new Error('Service unavailable');
        }
        return response.json();
    }
};

// Notification service
const Notifications = {
    // Show notification message
    show(message, type = 'info', duration = 5000) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto-remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);

        return notification;
    },

    // Show success message
    success(message, duration) {
        return this.show(message, 'success', duration);
    },

    // Show error message
    error(message, duration) {
        return this.show(message, 'error', duration);
    },

    // Show warning message
    warning(message, duration) {
        return this.show(message, 'warning', duration);
    },

    // Show info message
    info(message, duration) {
        return this.show(message, 'info', duration);
    }
};

// Form validation service
const FormValidator = {
    // Validate form field
    validateField(field, rules = {}) {
        const value = field.value.trim();
        const errors = [];

        // Required validation
        if (rules.required && !value) {
            errors.push('This field is required');
        }

        // Email validation
        if (rules.email && value && !Utils.isValidEmail(value)) {
            errors.push('Please enter a valid email address');
        }

        // Min length validation
        if (rules.minLength && value.length < rules.minLength) {
            errors.push(`Must be at least ${rules.minLength} characters`);
        }

        // Max length validation
        if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(`Must be no more than ${rules.maxLength} characters`);
        }

        // Custom validation
        if (rules.custom && typeof rules.custom === 'function') {
            const customError = rules.custom(value);
            if (customError) {
                errors.push(customError);
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // Validate entire form
    validateForm(form, rules) {
        const errors = {};
        let isValid = true;

        Object.keys(rules).forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                const validation = this.validateField(field, rules[fieldName]);
                if (!validation.isValid) {
                    errors[fieldName] = validation.errors;
                    isValid = false;
                }
            }
        });

        return { isValid, errors };
    },

    // Show field errors
    showFieldErrors(field, errors) {
        this.clearFieldErrors(field);
        
        errors.forEach(error => {
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = error;
            field.parentNode.appendChild(errorElement);
        });

        field.classList.add('error');
    },

    // Clear field errors
    clearFieldErrors(field) {
        const existingErrors = field.parentNode.querySelectorAll('.field-error');
        existingErrors.forEach(error => error.remove());
        field.classList.remove('error');
    }
};

// Local storage service
const Storage = {
    // Set item with expiration
    setItem(key, value, expirationMinutes = null) {
        const data = {
            value,
            timestamp: Date.now(),
            expiration: expirationMinutes ? Date.now() + (expirationMinutes * 60 * 1000) : null
        };
        
        localStorage.setItem(key, JSON.stringify(data));
    },

    // Get item with expiration check
    getItem(key) {
        try {
            const data = JSON.parse(localStorage.getItem(key));
            if (!data) return null;

            // Check expiration
            if (data.expiration && Date.now() > data.expiration) {
                localStorage.removeItem(key);
                return null;
            }

            return data.value;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },

    // Remove item
    removeItem(key) {
        localStorage.removeItem(key);
    },

    // Clear all items
    clear() {
        localStorage.clear();
    }
};

// Image handling service
const ImageHandler = {
    // Preview image before upload
    previewImage(input, previewElement) {
        if (input.files && input.files[0]) {
            const file = input.files[0];
            
            // Validate file
            const validation = Utils.validateFile(file);
            if (!validation.valid) {
                Notifications.error(validation.error);
                input.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                previewElement.innerHTML = `
                    <img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px;">
                    <button type="button" onclick="ImageHandler.removePreview(this)" class="remove-image">Remove</button>
                `;
                previewElement.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    },

    // Remove image preview
    removePreview(button) {
        const previewElement = button.closest('.image-preview');
        const input = previewElement.previousElementSibling.querySelector('input[type="file"]');
        
        input.value = '';
        previewElement.style.display = 'none';
        previewElement.innerHTML = '';
    },

    // Compress image (basic implementation)
    compressImage(file, maxWidth = 800, quality = 0.8) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = function() {
                // Calculate new dimensions
                let { width, height } = img;
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(resolve, 'image/jpeg', quality);
            };

            img.src = URL.createObjectURL(file);
        });
    }
};

// Search and filter service
const SearchFilter = {
    // Filter array by search term
    filterBySearch(items, searchTerm, searchFields) {
        if (!searchTerm) return items;

        const term = searchTerm.toLowerCase();
        return items.filter(item => {
            return searchFields.some(field => {
                const value = this.getNestedValue(item, field);
                return value && value.toString().toLowerCase().includes(term);
            });
        });
    },

    // Get nested object value by path
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    },

    // Sort array by field
    sortByField(items, field, direction = 'asc') {
        return [...items].sort((a, b) => {
            const aVal = this.getNestedValue(a, field);
            const bVal = this.getNestedValue(b, field);

            if (aVal < bVal) return direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    },

    // Paginate array
    paginate(items, page, pageSize) {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        
        return {
            items: items.slice(startIndex, endIndex),
            totalPages: Math.ceil(items.length / pageSize),
            currentPage: page,
            totalItems: items.length
        };
    }
};

// Export for use in other scripts
window.ESSU = {
    CONFIG,
    Utils,
    API,
    Notifications,
    FormValidator,
    Storage,
    ImageHandler,
    SearchFilter
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add notification styles to head
    const notificationStyles = `
        <style>
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
                animation: slideIn 0.3s ease-out;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 16px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                font-weight: 500;
            }
            
            .notification-success .notification-content {
                background-color: #d1fae5;
                color: #065f46;
                border: 1px solid #a7f3d0;
            }
            
            .notification-error .notification-content {
                background-color: #fee2e2;
                color: #991b1b;
                border: 1px solid #fecaca;
            }
            
            .notification-warning .notification-content {
                background-color: #fef3c7;
                color: #92400e;
                border: 1px solid #fde68a;
            }
            
            .notification-info .notification-content {
                background-color: #dbeafe;
                color: #1e40af;
                border: 1px solid #bfdbfe;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                margin-left: 8px;
                opacity: 0.7;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', notificationStyles);
    
    // Check service health
    API.healthCheck().catch(error => {
        console.warn('Service health check failed:', error);
    });
    
    // Set up global error handling
    window.addEventListener('error', function(event) {
        // Ignore Chart.js canvas errors (handled by chart destruction)
        if (event.error && event.error.message && event.error.message.includes('Canvas is already in use')) {
            return; // Silently ignore - chart will be recreated
        }
        // Only log actual errors
        if (event.error) {
            console.error('Global error:', event.error);
            Notifications.error('An unexpected error occurred. Please refresh the page.');
        }
    });
    
    // Set up unhandled promise rejection handling
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled promise rejection:', event.reason);
        Notifications.error('An error occurred while processing your request.');
    });
});

