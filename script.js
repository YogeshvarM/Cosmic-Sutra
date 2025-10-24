// DOM Elements
const ascSel = document.getElementById('ascSel');
const searchInput = document.getElementById('search');
const grid = document.getElementById('grid');
const titleAsc = document.getElementById('titleAsc');
const printBtn = document.getElementById('printBtn');
const toast = document.getElementById('toast');

// Zodiac symbols
const ZODIAC = {
  "Aries": "♈",
  "Taurus": "♉",
  "Gemini": "♊",
  "Cancer": "♋",
  "Leo": "♌",
  "Virgo": "♍",
  "Libra": "♎",
  "Scorpio": "♏",
  "Sagittarius": "♐",
  "Capricorn": "♑",
  "Aquarius": "♒",
  "Pisces": "♓"
};

let DATA = {};
let currentAscendant = '';
let touchStartX = null;
let touchStartY = null;

// Load data
async function loadData() {
  try {
    const res = await fetch('ascendants.json');
    DATA = await res.json();
    const ascendants = Object.keys(DATA);
    
    // Populate select
    ascendants.forEach(k => {
      const opt = document.createElement('option');
      opt.value = k;
      opt.textContent = `${ZODIAC[k] || '✦'} ${k} Ascendant`;
      ascSel.appendChild(opt);
    });
    
    // Set default ascendant.
    // Previously the app preferred a saved value from localStorage which could
    // make an older choice (e.g. "Leo") appear as the default on repeat visits.
    // Force the default to Aries here but fall back safely if Aries isn't present.
    const saved = localStorage.getItem('selectedAscendant');
    const defaultAsc = 'Aries';
    // Prefer a hard default of Aries; if it's missing, fall back to saved or first item.
    currentAscendant = DATA[defaultAsc]
      ? defaultAsc
      : (saved && DATA[saved] ? saved : ascendants[0]);
    ascSel.value = currentAscendant;
    
    render();
    setupSwipeGestures();
  } catch (error) {
    console.error('Error loading data:', error);
    showToast('Error loading data. Please refresh.');
  }
}

// Show toast notification
function showToast(message, duration = 2000) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// Copy card to clipboard - Mobile optimized
async function copyCard(card, event) {
  if (event) {
    event.stopPropagation();
  }
  
  const lines = [];
  lines.push(`${card.house}. ${card.sign_en} – ${card.sign_sa}`);
  lines.push(`Ruler: ${card.ruler}`);
  lines.push(`Karakas: ${card.karakas}`);
  lines.push(`MKS: ${card.mks}`);
  lines.push(`Digbala: ${card.digbala}`);
  lines.push(`Aditya: ${card.aditya}`);
  lines.push('');
  card.meanings.split(' / ').forEach(b => lines.push(`• ${b}`));
  
  const text = lines.join('\n');
  
  try {
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      showToast('✓ Copied to clipboard!');
      
      // Add visual feedback
      const cardEl = event ? event.target.closest('.card') : null;
      if (cardEl) {
        cardEl.classList.add('copied');
        setTimeout(() => cardEl.classList.remove('copied'), 500);
      }
    } else {
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        showToast('✓ Copied to clipboard!');
      } catch (err) {
        showToast('Please select and copy manually');
      } finally {
        textArea.remove();
      }
    }
  } catch (err) {
    console.error('Copy failed:', err);
    showToast('Copy failed. Please try again.');
  }
}

// Create card HTML with mobile-friendly touch targets
function createCard(item) {
  const icon = ZODIAC[item.sign_en] || '✦';
  const card = document.createElement('div');
  card.className = 'card';
  card.setAttribute('data-text', 
    (item.meanings + ' ' + item.karakas + ' ' + item.aditya).toLowerCase()
  );
  
  // Make entire card clickable on mobile
  card.addEventListener('click', (e) => {
    if (!e.target.classList.contains('toolbtn')) {
      copyCard(item, e);
    }
  });
  
  card.innerHTML = `
    <div class="tools">
      <button class="toolbtn" aria-label="Copy card content">Copy</button>
    </div>
    <h3>
      <span class="signicon">${icon}</span>
      ${item.house}. ${item.sign_en} – ${item.sign_sa}
    </h3>
    <div class="meta">
      <span class="badge">Ruler: ${item.ruler}</span>
      <span class="badge">Karakas: ${item.karakas}</span>
      ${item.mks !== '—' ? `<span class="badge">MKS: ${item.mks}</span>` : ''}
      ${item.digbala !== '—' ? `<span class="badge">Digbala: ${item.digbala}</span>` : ''}
      <span class="badge">Āditya: ${item.aditya}</span>
    </div>
    <ul class="bullets">
      ${item.meanings.split(' / ').map(x => `<li>${x}</li>`).join('')}
    </ul>
  `;
  
  // Add event listener to copy button
  const copyBtn = card.querySelector('.toolbtn');
  copyBtn.addEventListener('click', (e) => copyCard(item, e));
  
  return card;
}

// Render cards
function render() {
  const asc = ascSel.value;
  if (!DATA[asc]) return;
  
  currentAscendant = asc;
  localStorage.setItem('selectedAscendant', asc);
  
  const pack = DATA[asc];
  titleAsc.textContent = `${ZODIAC[asc] || '✦'} ${asc} Ascendant`;
  
  // Clear and rebuild grid
  grid.innerHTML = '';
  grid.classList.add('loading');
  
  // Use requestAnimationFrame for smoother rendering
  requestAnimationFrame(() => {
    pack.houses.forEach(h => {
      grid.appendChild(createCard(h));
    });
    grid.classList.remove('loading');
    applyFilter();
  });
}

// Apply search filter
function applyFilter() {
  const query = (searchInput.value || '').toLowerCase().trim();
  const cards = [...grid.querySelectorAll('.card')];
  
  let visibleCount = 0;
  cards.forEach(card => {
    const text = card.getAttribute('data-text');
    const isVisible = !query || text.includes(query);
    card.style.display = isVisible ? '' : 'none';
    if (isVisible) visibleCount++;
  });
  
  // Show message if no results
  if (query && visibleCount === 0) {
    if (!document.querySelector('.no-results')) {
      const msg = document.createElement('div');
      msg.className = 'no-results';
      msg.style.cssText = 'text-align:center; color:var(--muted); padding:40px; font-size:16px;';
      msg.textContent = 'No matching cards found. Try different keywords.';
      grid.appendChild(msg);
    }
  } else {
    const noResults = document.querySelector('.no-results');
    if (noResults) noResults.remove();
  }
}

// Setup swipe gestures for mobile
function setupSwipeGestures() {
  const ascendants = Object.keys(DATA);
  
  // Touch events for swipe
  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  
  document.addEventListener('touchend', (e) => {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // Only horizontal swipes
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      const currentIndex = ascendants.indexOf(currentAscendant);
      
      if (diffX > 0) {
        // Swipe left - next ascendant
        const nextIndex = (currentIndex + 1) % ascendants.length;
        ascSel.value = ascendants[nextIndex];
        render();
        showToast(`→ ${ascendants[nextIndex]}`);
      } else {
        // Swipe right - previous ascendant
        const prevIndex = (currentIndex - 1 + ascendants.length) % ascendants.length;
        ascSel.value = ascendants[prevIndex];
        render();
        showToast(`← ${ascendants[prevIndex]}`);
      }
    }
    
    touchStartX = null;
    touchStartY = null;
  }, { passive: true });
}

// Debounce function for search
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

// Event listeners
ascSel?.addEventListener('change', render);
searchInput?.addEventListener('input', debounce(applyFilter, 300));

// Print functionality
printBtn?.addEventListener('click', () => {
  window.print();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  const ascendants = Object.keys(DATA);
  const currentIndex = ascendants.indexOf(currentAscendant);
  
  if (e.key === 'ArrowLeft' && !searchInput.matches(':focus')) {
    const prevIndex = (currentIndex - 1 + ascendants.length) % ascendants.length;
    ascSel.value = ascendants[prevIndex];
    render();
  } else if (e.key === 'ArrowRight' && !searchInput.matches(':focus')) {
    const nextIndex = (currentIndex + 1) % ascendants.length;
    ascSel.value = ascendants[nextIndex];
    render();
  }
});

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadData);
} else {
  loadData();
}

// Handle visibility change to save battery on mobile
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause any animations or timers if needed
  } else {
    // Resume if needed
  }
});

// Progressive Web App install prompt (optional)
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Could show an install button here
});

// Service Worker registration (optional - for offline support)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Uncomment to enable offline support
    // navigator.serviceWorker.register('/sw.js');
  });
}