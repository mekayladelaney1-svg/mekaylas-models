// Global state
let models = [];
let currentModelId = null;
const API_BASE = '/api';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  loadModels();
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  const form = document.getElementById('modelForm');
  form.addEventListener('submit', handleCreateModel);

  const bioInput = document.getElementById('bio');
  bioInput.addEventListener('input', (e) => {
    document.getElementById('bioCount').textContent = `${e.target.value.length}/500`;
  });

  const sortBy = document.getElementById('sortBy');
  sortBy.addEventListener('change', () => {
    renderModels();
  });
}

// Load models from API
async function loadModels() {
  try {
    const response = await fetch(`${API_BASE}/models`);
    const result = await response.json();

    if (result.success) {
      models = result.data;
      renderModels();
      updateModelCount();
    } else {
      showError('Failed to load models');
    }
  } catch (error) {
    console.error('Error loading models:', error);
    showError('Error loading models: ' + error.message);
  }
}

// Render models grid
function renderModels() {
  const grid = document.getElementById('modelsGrid');
  const emptyState = document.getElementById('emptyState');
  const sortBy = document.getElementById('sortBy').value;

  if (models.length === 0) {
    grid.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  // Sort models
  const sorted = [...models].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'followers':
        return b.followers - a.followers;
      default:
        return 0;
    }
  });

  grid.innerHTML = sorted
    .map(
      (model) => `
    <div class="bg-gradient-to-br from-zinc-800 to-zinc-700 p-6 rounded-2xl border-2 border-pink-400 hover:border-pink-300 cursor-pointer transition transform hover:scale-105 hover:shadow-2xl" onclick="openModelModal(${model.id})">
      <div class="flex justify-between items-start mb-3">
        <h3 class="text-2xl font-bold text-pink-400">${escapeHtml(model.name)}</h3>
        <span class="text-sm bg-pink-600 px-3 py-1 rounded-full">${model.personality}</span>
      </div>
      <div class="grid grid-cols-2 gap-2 mb-4 text-sm">
        <div><span class="text-zinc-400">Hair:</span> <span class="text-pink-300">${model.hair}</span></div>
        <div><span class="text-zinc-400">Eyes:</span> <span class="text-pink-300">${model.eyes}</span></div>
      </div>
      <p class="text-zinc-300 mb-4 line-clamp-3">${escapeHtml(model.bio)}</p>
      <div class="flex justify-between items-center text-xs text-zinc-400">
        <span>👥 ${model.followers} followers</span>
        <span class="text-pink-400 font-semibold">Click to view</span>
      </div>
    </div>
  `
    )
    .join('');
}

// Open model modal
function openModelModal(modelId) {
  const model = models.find((m) => m.id === modelId);
  if (!model) return;

  currentModelId = modelId;

  document.getElementById('modalTitle').textContent = escapeHtml(model.name);
  document.getElementById('modalPersonality').textContent = `${model.personality} Personality`;
  document.getElementById('modalHair').textContent = model.hair;
  document.getElementById('modalEyes').textContent = model.eyes;
  document.getElementById('modalBio').textContent = escapeHtml(model.bio);

  document.getElementById('modelModal').classList.remove('hidden');
}

// Close modal
function closeModal() {
  document.getElementById('modelModal').classList.add('hidden');
  currentModelId = null;
}

// Edit model
function editModel() {
  const model = models.find((m) => m.id === currentModelId);
  if (!model) return;

  document.getElementById('name').value = model.name;
  document.getElementById('hair').value = model.hair;
  document.getElementById('eyes').value = model.eyes;
  document.getElementById('personality').value = model.personality;
  document.getElementById('bio').value = model.bio;
  document.getElementById('bioCount').textContent = `${model.bio.length}/500`;

  closeModal();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Focus on form
  document.getElementById('name').focus();
}

// Delete model
async function deleteModel() {
  if (!currentModelId) return;

  if (!confirm('Are you sure you want to delete this model?')) return;

  try {
    const response = await fetch(`${API_BASE}/models/${currentModelId}`, {
      method: 'DELETE'
    });
    const result = await response.json();

    if (result.success) {
      showSuccess('Model deleted successfully!');
      closeModal();
      loadModels();
    } else {
      showError(result.error);
    }
  } catch (error) {
    console.error('Error deleting model:', error);
    showError('Error deleting model: ' + error.message);
  }
}

// Handle create model
async function handleCreateModel(e) {
  e.preventDefault();

  const formData = {
    name: document.getElementById('name').value,
    hair: document.getElementById('hair').value,
    eyes: document.getElementById('eyes').value,
    personality: document.getElementById('personality').value,
    bio: document.getElementById('bio').value
  };

  // Client-side validation
  if (!validateForm(formData)) return;

  try {
    const response = await fetch(`${API_BASE}/models`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (result.success) {
      showSuccess(`${result.data.name} created successfully!`);
      document.getElementById('modelForm').reset();
      document.getElementById('bioCount').textContent = '0/500';
      loadModels();
    } else {
      showError(result.error || 'Failed to create model');
    }
  } catch (error) {
    console.error('Error creating model:', error);
    showError('Error creating model: ' + error.message);
  }
}

// Validate form
function validateForm(data) {
  const form = document.getElementById('modelForm');
  const inputs = form.querySelectorAll('input, select, textarea');
  let isValid = true;

  inputs.forEach((input) => {
    const error = input.parentElement.querySelector('.error-message');
    if (!input.value.trim()) {
      showFieldError(input, `${input.id.charAt(0).toUpperCase() + input.id.slice(1)} is required`);
      isValid = false;
    } else if (input.id === 'bio' && input.value.length < 10) {
      showFieldError(input, 'Bio must be at least 10 characters');
      isValid = false;
    } else {
      clearFieldError(input);
    }
  });

  return isValid;
}

// Show field error
function showFieldError(input, message) {
  const error = input.parentElement.querySelector('.error-message');
  if (error) {
    error.textContent = message;
    error.classList.remove('hidden');
  }
  input.classList.add('border-red-500');
}

// Clear field error
function clearFieldError(input) {
  const error = input.parentElement.querySelector('.error-message');
  if (error) {
    error.classList.add('hidden');
  }
  input.classList.remove('border-red-500');
}

// Update model count
function updateModelCount() {
  document.getElementById('modelCount').textContent = models.length;
}

// Show success notification
function showSuccess(message) {
  const notification = document.createElement('div');
  notification.className =
    'fixed top-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg animate-slide-in';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Show error notification
function showError(message) {
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg animate-slide-in';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Close modal on escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

// Close modal on background click
document.getElementById('modelModal').addEventListener('click', (e) => {
  if (e.target.id === 'modelModal') {
    closeModal();
  }
});
