/**
 * Conversor de Divisas PWA - Beso de 3
 * Conversión reactiva simultánea entre 3 divisas personalizables (18 divisas disponibles)
 * Smart Swap, 100% Offline PWA, tasas manuales y chips calibrados para viajes reales
 */

// =============================================================================
// CATÁLOGO DE 18 DIVISAS
// Banderas vectoriales, tasas de referencia vs USD y chips de amplio rango
// =============================================================================
const CURRENCIES = {
  crc: {
    code: 'CRC',
    name: 'Colones',
    country: 'Costa Rica',
    symbol: '₡',
    defaultRate: 456.0,
    decimals: 0,
    chips: [
      { label: '5K', val: 5000 },
      { label: '20K', val: 20000 },
      { label: '50K', val: 50000 },
      { label: '250K', val: 250000 }
    ],
    flagSvg: `<svg viewBox="0 0 32 32" width="28" height="28">
      <clipPath id="circle-crc"><circle cx="16" cy="16" r="16"/></clipPath>
      <g clip-path="url(#circle-crc)">
        <rect width="32" height="5.33" fill="#002B7F"/>
        <rect y="5.33" width="32" height="5.33" fill="#FFFFFF"/>
        <rect y="10.66" width="32" height="10.68" fill="#CE1126"/>
        <rect y="21.34" width="32" height="5.33" fill="#FFFFFF"/>
        <rect y="26.67" width="32" height="5.33" fill="#002B7F"/>
      </g>
    </svg>`
  },

  usd: {
    code: 'USD',
    name: 'Dólares',
    country: 'Estados Unidos',
    symbol: '$',
    defaultRate: 1.0,
    isBase: true,
    decimals: 2,
    chips: [
      { label: '$20', val: 20 },
      { label: '$50', val: 50 },
      { label: '$100', val: 100 },
      { label: '$500', val: 500 }
    ],
    flagSvg: `<svg viewBox="0 0 32 32" width="28" height="28">
      <clipPath id="circle-usd"><circle cx="16" cy="16" r="16"/></clipPath>
      <g clip-path="url(#circle-usd)">
        <rect width="32" height="32" fill="#FFFFFF"/>
        <path d="M0 0h32v2.46H0zm0 4.92h32v2.46H0zm0 4.92h32v2.46H0zm0 4.93h32v2.46H0zm0 4.92h32v2.46H0zm0 4.92h32v2.46H0zm0 4.93h32v2.46H0z" fill="#B22234"/>
        <rect width="14" height="15" fill="#3C3B6E"/>
        <circle cx="3.5" cy="3.5" r="1" fill="#FFFFFF"/>
        <circle cx="7" cy="3.5" r="1" fill="#FFFFFF"/>
        <circle cx="10.5" cy="3.5" r="1" fill="#FFFFFF"/>
        <circle cx="5.25" cy="7.5" r="1" fill="#FFFFFF"/>
        <circle cx="8.75" cy="7.5" r="1" fill="#FFFFFF"/>
        <circle cx="3.5" cy="11.5" r="1" fill="#FFFFFF"/>
        <circle cx="7" cy="11.5" r="1" fill="#FFFFFF"/>
        <circle cx="10.5" cy="11.5" r="1" fill="#FFFFFF"/>
      </g>
    </svg>`
  },

  cop: {
    code: 'COP',
    name: 'Pesos',
    country: 'Colombia',
    symbol: '$',
    defaultRate: 3200.0,
    decimals: 0,
    chips: [
      { label: '20K', val: 20000 },
      { label: '100K', val: 100000 },
      { label: '500K', val: 500000 },
      { label: '2M', val: 2000000 }
    ],
    flagSvg: `<svg viewBox="0 0 32 32" width="28" height="28">
      <clipPath id="circle-cop"><circle cx="16" cy="16" r="16"/></clipPath>
      <g clip-path="url(#circle-cop)">
        <rect width="32" height="16" fill="#FCD116"/>
        <rect y="16" width="32" height="8" fill="#003893"/>
        <rect y="24" width="32" height="8" fill="#CE1126"/>
      </g>
    </svg>`
  },

  eur: {
    code: 'EUR',
    name: 'Euros',
    country: 'Unión Europea',
    symbol: '€',
    defaultRate: 0.89,
    decimals: 2,
    chips: [
      { label: '20€', val: 20 },
      { label: '50€', val: 50 },
      { label: '100€', val: 100 },
      { label: '500€', val: 500 }
    ],
    flagSvg: `<svg viewBox="0 0 32 32" width="28" height="28">
      <clipPath id="circle-eur"><circle cx="16" cy="16" r="16"/></clipPath>
      <g clip-path="url(#circle-eur)">
        <rect width="32" height="32" fill="#003399"/>
        <g fill="#FFCC00" transform="translate(16,16) scale(0.65)">
          <circle cx="0" cy="-14" r="1.5"/>
          <circle cx="7" cy="-12" r="1.5"/>
          <circle cx="12" cy="-7" r="1.5"/>
          <circle cx="14" cy="0" r="1.5"/>
          <circle cx="12" cy="7" r="1.5"/>
          <circle cx="7" cy="12" r="1.5"/>
          <circle cx="0" cy="14" r="1.5"/>
          <circle cx="-7" cy="12" r="1.5"/>
          <circle cx="-12" cy="7" r="1.5"/>
          <circle cx="-14" cy="0" r="1.5"/>
          <circle cx="-12" cy="-7" r="1.5"/>
          <circle cx="-7" cy="-12" r="1.5"/>
        </g>
      </g>
    </svg>`
  },

  mxn: {
    code: 'MXN',
    name: 'Pesos',
    country: 'México',
    symbol: '$',
    defaultRate: 18.40,
    decimals: 2,
    chips: [
      { label: '$200', val: 200 },
      { label: '$500', val: 500 },
      { label: '$1.000', val: 1000 },
      { label: '$5.000', val: 5000 }
    ],
    flagSvg: `<svg viewBox="0 0 32 32" width="28" height="28">
      <clipPath id="circle-mxn"><circle cx="16" cy="16" r="16"/></clipPath>
      <g clip-path="url(#circle-mxn)">
        <rect width="10.66" height="32" fill="#006847"/>
        <rect x="10.66" width="10.68" height="32" fill="#FFFFFF"/>
        <rect x="21.34" width="10.66" height="32" fill="#CE1126"/>
        <circle cx="16" cy="16" r="2.8" fill="#8B5A2B"/>
      </g>
    </svg>`
  },

  nio: {
    code: 'NIO',
    name: 'Córdobas',
    country: 'Nicaragua',
    symbol: 'C$',
    defaultRate: 36.80,
    decimals: 2,
    chips: [
      { label: 'C$200', val: 200 },
      { label: 'C$500', val: 500 },
      { label: 'C$2.000', val: 2000 },
      { label: 'C$10.000', val: 10000 }
    ],
    flagSvg: `<svg viewBox="0 0 32 32" width="28" height="28">
      <clipPath id="circle-nio"><circle cx="16" cy="16" r="16"/></clipPath>
      <g clip-path="url(#circle-nio)">
        <rect width="32" height="10.66" fill="#18568C"/>
        <rect y="10.66" width="32" height="10.68" fill="#FFFFFF"/>
        <rect y="21.34" width="32" height="10.66" fill="#18568C"/>
        <polygon points="16,13.5 13.5,18.5 18.5,18.5" fill="#F4B223" stroke="#18568C" stroke-width="0.5"/>
      </g>
    </svg>`
  },

  cny: {
    code: 'CNY',
    name: 'Yuan',
    country: 'China',
    symbol: '¥',
    defaultRate: 6.70,
    decimals: 2,
    chips: [
      { label: '¥50', val: 50 },
      { label: '¥200', val: 200 },
      { label: '¥500', val: 500 },
      { label: '¥3.000', val: 3000 }
    ],
    flagSvg: `<svg viewBox="0 0 32 32" width="28" height="28">
      <clipPath id="circle-cny"><circle cx="16" cy="16" r="16"/></clipPath>
      <g clip-path="url(#circle-cny)">
        <rect width="32" height="32" fill="#DE2910"/>
        <polygon points="8,4.5 9,7.5 12,7.5 9.5,9.5 10.5,12.5 8,10.5 5.5,12.5 6.5,9.5 4,7.5 7,7.5" fill="#FFDE00"/>
        <circle cx="14" cy="5" r="0.9" fill="#FFDE00"/>
        <circle cx="16" cy="8" r="0.9" fill="#FFDE00"/>
        <circle cx="16" cy="12" r="0.9" fill="#FFDE00"/>
        <circle cx="14" cy="15" r="0.9" fill="#FFDE00"/>
      </g>
    </svg>`
  },

  gtq: {
    code: 'GTQ',
    name: 'Quetzales',
    country: 'Guatemala',
    symbol: 'Q',
    defaultRate: 7.65,
    decimals: 2,
    chips: [
      { label: 'Q50', val: 50 },
      { label: 'Q200', val: 200 },
      { label: 'Q500', val: 500 },
      { label: 'Q3.000', val: 3000 }
    ],
    flagSvg: `<svg viewBox="0 0 32 32" width="28" height="28">
      <clipPath id="circle-gtq"><circle cx="16" cy="16" r="16"/></clipPath>
      <g clip-path="url(#circle-gtq)">
        <rect width="10.66" height="32" fill="#4997D0"/>
        <rect x="10.66" width="10.68" height="32" fill="#FFFFFF"/>
        <rect x="21.34" width="10.66" height="32" fill="#4997D0"/>
        <circle cx="16" cy="16" r="2.8" fill="#007A3D"/>
      </g>
    </svg>`
  },

  pen: {
    code: 'PEN',
    name: 'Soles',
    country: 'Perú',
    symbol: 'S/',
    defaultRate: 3.45,
    decimals: 2,
    chips: [
      { label: 'S/20', val: 20 },
      { label: 'S/50', val: 50 },
      { label: 'S/200', val: 200 },
      { label: 'S/1.000', val: 1000 }
    ],
    flagSvg: `<svg viewBox="0 0 32 32" width="28" height="28">
      <clipPath id="circle-pen"><circle cx="16" cy="16" r="16"/></clipPath>
      <g clip-path="url(#circle-pen)">
        <rect width="10.66" height="32" fill="#D91023"/>
        <rect x="10.66" width="10.68" height="32" fill="#FFFFFF"/>
        <rect x="21.34" width="10.66" height="32" fill="#D91023"/>
      </g>
    </svg>`
  },

  brl: {
    code: 'BRL',
    name: 'Reales',
    country: 'Brasil',
    symbol: 'R$',
    defaultRate: 5.05,
    decimals: 2,
    chips: [
      { label: 'R$50', val: 50 },
      { label: 'R$100', val: 100 },
      { label: 'R$500', val: 500 },
      { label: 'R$2.500', val: 2500 }
    ],
    flagSvg: `<svg viewBox="0 0 32 32" width="28" height="28">
      <clipPath id="circle-brl"><circle cx="16" cy="16" r="16"/></clipPath>
      <g clip-path="url(#circle-brl)">
        <rect width="32" height="32" fill="#009739"/>
        <polygon points="16,4 29,16 16,28 3,16" fill="#FEDD00"/>
        <circle cx="16" cy="16" r="6.5" fill="#012169"/>
        <path d="M10 16.5 A6.5 6.5 0 0 1 22 14.5" stroke="#FFFFFF" stroke-width="1" fill="none"/>
      </g>
    </svg>`
  },

  ars: {
    code: 'ARS',
    name: 'Pesos',
    country: 'Argentina',
    symbol: '$',
    defaultRate: 1510.0,
    decimals: 0,
    chips: [
      { label: '10K', val: 10000 },
      { label: '50K', val: 50000 },
      { label: '200K', val: 200000 },
      { label: '1M', val: 1000000 }
    ],
    flagSvg: `<svg viewBox="0 0 32 32" width="28" height="28">
      <clipPath id="circle-ars"><circle cx="16" cy="16" r="16"/></clipPath>
      <g clip-path="url(#circle-ars)">
        <rect width="32" height="10.66" fill="#75AADB"/>
        <rect y="10.66" width="32" height="10.68" fill="#FFFFFF"/>
        <rect y="21.34" width="32" height="10.66" fill="#75AADB"/>
        <circle cx="16" cy="16" r="2.8" fill="#F6B40E"/>
      </g>
    </svg>`
  },

  clp: {
    code: 'CLP',
    name: 'Pesos',
    country: 'Chile',
    symbol: '$',
    defaultRate: 980.0,
    decimals: 0,
    chips: [
      { label: '10K', val: 10000 },
      { label: '50K', val: 50000 },
      { label: '200K', val: 200000 },
      { label: '800K', val: 800000 }
    ],
    flagSvg: `<svg viewBox="0 0 32 32" width="28" height="28">
      <clipPath id="circle-clp"><circle cx="16" cy="16" r="16"/></clipPath>
      <g clip-path="url(#circle-clp)">
        <rect width="32" height="16" fill="#FFFFFF"/>
        <rect y="16" width="32" height="16" fill="#D52B1E"/>
        <rect width="14" height="16" fill="#0039A6"/>
        <polygon points="7,4 8,7 11,7 8.5,9 9.5,12 7,10 4.5,12 5.5,9 3,7 6,7" fill="#FFFFFF"/>
      </g>
    </svg>`
  },

  dop: {
    code: 'DOP',
    name: 'Pesos',
    country: 'Rep. Dominicana',
    symbol: 'RD$',
    defaultRate: 61.20,
    decimals: 2,
    chips: [
      { label: 'RD$500', val: 500 },
      { label: 'RD$1.500', val: 1500 },
      { label: 'RD$5.000', val: 5000 },
      { label: 'RD$25.000', val: 25000 }
    ],
    flagSvg: `<svg viewBox="0 0 32 32" width="28" height="28">
      <clipPath id="circle-dop"><circle cx="16" cy="16" r="16"/></clipPath>
      <g clip-path="url(#circle-dop)">
        <rect width="14" height="14" fill="#002F6C"/>
        <rect x="18" width="14" height="14" fill="#CE1126"/>
        <rect y="18" width="14" height="14" fill="#CE1126"/>
        <rect x="18" y="18" width="14" height="14" fill="#002F6C"/>
        <rect x="14" width="4" height="32" fill="#FFFFFF"/>
        <rect y="14" width="32" height="4" fill="#FFFFFF"/>
      </g>
    </svg>`
  },

  gbp: {
    code: 'GBP',
    name: 'Libras',
    country: 'Reino Unido',
    symbol: '£',
    defaultRate: 0.75,
    decimals: 2,
    chips: [
      { label: '£20', val: 20 },
      { label: '£50', val: 50 },
      { label: '£100', val: 100 },
      { label: '£500', val: 500 }
    ],
    flagSvg: `<svg viewBox="0 0 32 32" width="28" height="28">
      <clipPath id="circle-gbp"><circle cx="16" cy="16" r="16"/></clipPath>
      <g clip-path="url(#circle-gbp)">
        <rect width="32" height="32" fill="#012169"/>
        <path d="M0,0 L32,32 M32,0 L0,32" stroke="#FFFFFF" stroke-width="4.5"/>
        <path d="M0,0 L32,32 M32,0 L0,32" stroke="#C8102E" stroke-width="2.5"/>
        <path d="M16,0 V32 M0,16 H32" stroke="#FFFFFF" stroke-width="7"/>
        <path d="M16,0 V32 M0,16 H32" stroke="#C8102E" stroke-width="4"/>
      </g>
    </svg>`
  },

  cad: {
    code: 'CAD',
    name: 'Dólares',
    country: 'Canadá',
    symbol: 'C$',
    defaultRate: 1.42,
    decimals: 2,
    chips: [
      { label: '$20', val: 20 },
      { label: '$50', val: 50 },
      { label: '$100', val: 100 },
      { label: '$500', val: 500 }
    ],
    flagSvg: `<svg viewBox="0 0 32 32" width="28" height="28">
      <clipPath id="circle-cad"><circle cx="16" cy="16" r="16"/></clipPath>
      <g clip-path="url(#circle-cad)">
        <rect width="8" height="32" fill="#FF0000"/>
        <rect x="8" width="16" height="32" fill="#FFFFFF"/>
        <rect x="24" width="8" height="32" fill="#FF0000"/>
        <polygon points="16,8 18,13 22,12 19,16 21,20 16,18 11,20 13,16 10,12 14,13" fill="#FF0000"/>
        <rect x="15.5" y="18" width="1" height="5" fill="#FF0000"/>
      </g>
    </svg>`
  },

  aud: {
    code: 'AUD',
    name: 'Dólares',
    country: 'Australia',
    symbol: 'A$',
    defaultRate: 1.43,
    decimals: 2,
    chips: [
      { label: '$20', val: 20 },
      { label: '$50', val: 50 },
      { label: '$100', val: 100 },
      { label: '$500', val: 500 }
    ],
    flagSvg: `<svg viewBox="0 0 32 32" width="28" height="28">
      <clipPath id="circle-aud"><circle cx="16" cy="16" r="16"/></clipPath>
      <g clip-path="url(#circle-aud)">
        <rect width="32" height="32" fill="#00008B"/>
        <rect width="16" height="16" fill="#012169"/>
        <path d="M0,0 L16,16 M16,0 L0,16" stroke="#FFFFFF" stroke-width="2.5"/>
        <path d="M0,0 L16,16 M16,0 L0,16" stroke="#C8102E" stroke-width="1.2"/>
        <path d="M8,0 V16 M0,8 H16" stroke="#FFFFFF" stroke-width="4"/>
        <path d="M8,0 V16 M0,8 H16" stroke="#C8102E" stroke-width="2"/>
        <circle cx="8" cy="23" r="2.5" fill="#FFFFFF"/>
        <circle cx="24" cy="8" r="1" fill="#FFFFFF"/>
        <circle cx="26" cy="13" r="1" fill="#FFFFFF"/>
        <circle cx="21" cy="18" r="1" fill="#FFFFFF"/>
        <circle cx="26" cy="22" r="1" fill="#FFFFFF"/>
      </g>
    </svg>`
  },

  jpy: {
    code: 'JPY',
    name: 'Yenes',
    country: 'Japón',
    symbol: '¥',
    defaultRate: 158.0,
    decimals: 0,
    chips: [
      { label: '¥2.000', val: 2000 },
      { label: '¥5.000', val: 5000 },
      { label: '¥20.000', val: 20000 },
      { label: '¥100.000', val: 100000 }
    ],
    flagSvg: `<svg viewBox="0 0 32 32" width="28" height="28">
      <clipPath id="circle-jpy"><circle cx="16" cy="16" r="16"/></clipPath>
      <g clip-path="url(#circle-jpy)">
        <rect width="32" height="32" fill="#FFFFFF"/>
        <circle cx="16" cy="16" r="9.5" fill="#BC002D"/>
      </g>
    </svg>`
  },

  chf: {
    code: 'CHF',
    name: 'Francos',
    country: 'Suiza',
    symbol: 'CHF',
    defaultRate: 0.83,
    decimals: 2,
    chips: [
      { label: '20 CHF', val: 20 },
      { label: '50 CHF', val: 50 },
      { label: '100 CHF', val: 100 },
      { label: '500 CHF', val: 500 }
    ],
    flagSvg: `<svg viewBox="0 0 32 32" width="28" height="28">
      <clipPath id="circle-chf"><circle cx="16" cy="16" r="16"/></clipPath>
      <g clip-path="url(#circle-chf)">
        <rect width="32" height="32" fill="#D52B1E"/>
        <rect x="13" y="7" width="6" height="18" fill="#FFFFFF"/>
        <rect x="7" y="13" width="18" height="6" fill="#FFFFFF"/>
      </g>
    </svg>`
  }
};

// =============================================================================
// ALMACENAMIENTO Y ESTADO
// =============================================================================
const STORAGE_KEYS = {
  SLOTS: 'divisas_active_slots_v2',
  RATE_PREFIX: 'divisas_rate_',
  LAST_AMOUNT: 'divisas_last_amount',
  LAST_SLOT: 'divisas_last_active_slot',
  // Claves legacy para usuarios existentes (retrocompatibilidad)
  LEGACY_RATE_COP: 'divisas_rate_cop_v1',
  LEGACY_RATE_CRC: 'divisas_rate_crc_v1',
  LEGACY_LAST_CUR: 'divisas_last_currency'
};

// Estado global de la aplicación
const state = {
  // Orden por defecto solicitado: Slot 0 = CRC, Slot 1 = USD, Slot 2 = COP
  slots: ['crc', 'usd', 'cop'],
  rates: {},
  activeSlotIndex: 0,
  modalTargetSlot: 0,
  deferredPrompt: null
};

// Referencias del DOM
const dom = {
  // Slots (0, 1, 2)
  cards: [
    document.getElementById('card-slot-0'),
    document.getElementById('card-slot-1'),
    document.getElementById('card-slot-2')
  ],
  inputs: [
    document.getElementById('input-slot-0'),
    document.getElementById('input-slot-1'),
    document.getElementById('input-slot-2')
  ],
  flags: [
    document.getElementById('flag-slot-0'),
    document.getElementById('flag-slot-1'),
    document.getElementById('flag-slot-2')
  ],
  codes: [
    document.getElementById('code-slot-0'),
    document.getElementById('code-slot-1'),
    document.getElementById('code-slot-2')
  ],
  countries: [
    document.getElementById('country-slot-0'),
    document.getElementById('country-slot-1'),
    document.getElementById('country-slot-2')
  ],
  symbols: [
    document.getElementById('symbol-slot-0'),
    document.getElementById('symbol-slot-1'),
    document.getElementById('symbol-slot-2')
  ],
  chipsContainers: [
    document.getElementById('chips-slot-0'),
    document.getElementById('chips-slot-1'),
    document.getElementById('chips-slot-2')
  ],
  selectorBtns: document.querySelectorAll('.currency-selector-btn'),

  // Elementos comunes
  crossText: document.getElementById('cross-text'),
  manualRatesContainer: document.getElementById('manual-rates-container'),
  btnRestore: document.getElementById('btn-restore'),
  btnClear: document.getElementById('btn-clear'),
  btnInstall: document.getElementById('btn-install'),
  toast: document.getElementById('toast'),

  // Modal selector de divisas
  currencyModal: document.getElementById('currency-modal'),
  currencyModalSubtitle: document.getElementById('currency-modal-subtitle'),
  btnCloseCurrencyModal: document.getElementById('btn-close-currency-modal'),
  currencySearchInput: document.getElementById('currency-search-input'),
  btnClearSearch: document.getElementById('btn-clear-search'),
  currencyList: document.getElementById('currency-list'),

  // Modal iOS Install
  iosInstallModal: document.getElementById('ios-install-modal'),
  btnCloseIosModal: document.getElementById('btn-close-ios-modal')
};

// =============================================================================
// INICIALIZACIÓN
// =============================================================================
function initApp() {
  loadStoredSlots();
  loadStoredRates();
  renderAllSlots();
  renderManualRatesPanel();
  setupEventListeners();
  updateCrossRatesDisplay();
  registerServiceWorker();
  setupPwaInstall();

  // Restaurar último monto ingresado o valor inicial por defecto (ej: 10.000 CRC)
  const savedAmount = localStorage.getItem(STORAGE_KEYS.LAST_AMOUNT);
  const savedSlot = parseInt(localStorage.getItem(STORAGE_KEYS.LAST_SLOT), 10);
  
  if (!isNaN(savedSlot) && savedSlot >= 0 && savedSlot <= 2) {
    state.activeSlotIndex = savedSlot;
  } else {
    state.activeSlotIndex = 0; // Slot 0 (CRC)
  }

  const targetInput = dom.inputs[state.activeSlotIndex];

  if (savedAmount && parseFloat(savedAmount) > 0) {
    targetInput.value = savedAmount;
    calculateConversions(state.activeSlotIndex, parseFloat(savedAmount));
    formatInputField(targetInput, parseFloat(savedAmount), state.slots[state.activeSlotIndex]);
  } else {
    // Demo inicial amigable: 10.000 CRC en Slot 0
    state.activeSlotIndex = 0;
    const initialAmt = 10000;
    dom.inputs[0].value = initialAmt;
    calculateConversions(0, initialAmt);
    formatInputField(dom.inputs[0], initialAmt, state.slots[0]);
  }

  highlightActiveCard(state.activeSlotIndex);
}

// =============================================================================
// GESTIÓN DE SLOTS Y TASAS (LOCALSTORAGE + RETROCOMPATIBILIDAD)
// =============================================================================
function loadStoredSlots() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SLOTS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === 3) {
        // Validar que cada código exista en el catálogo
        const valid = parsed.every(c => CURRENCIES[c]);
        if (valid) {
          state.slots = parsed;
          return;
        }
      }
    }
  } catch (e) {
    console.warn('Error al leer slots guardados:', e);
  }

  // Si no hay slots guardados, usar orden por defecto solicitado: CRC · USD · COP
  state.slots = ['crc', 'usd', 'cop'];
}

function saveSlots() {
  try {
    localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(state.slots));
  } catch (e) {
    console.warn('Error al guardar slots:', e);
  }
}

function loadStoredRates() {
  // Cargar tasas por defecto de todas las divisas
  Object.keys(CURRENCIES).forEach(cur => {
    state.rates[cur] = CURRENCIES[cur].defaultRate;
    
    // Buscar en localStorage si hay una tasa guardada personalizada
    const saved = parseFloat(localStorage.getItem(STORAGE_KEYS.RATE_PREFIX + cur));
    if (!isNaN(saved) && saved > 0) {
      state.rates[cur] = saved;
    }
  });

  // Retrocompatibilidad con versiones anteriores de la app:
  const legacyCop = parseFloat(localStorage.getItem(STORAGE_KEYS.LEGACY_RATE_COP));
  if (!isNaN(legacyCop) && legacyCop > 0) {
    state.rates['cop'] = legacyCop;
  }
  const legacyCrc = parseFloat(localStorage.getItem(STORAGE_KEYS.LEGACY_RATE_CRC));
  if (!isNaN(legacyCrc) && legacyCrc > 0) {
    state.rates['crc'] = legacyCrc;
  }
}

function saveRateForCurrency(currencyCode, rateValue) {
  state.rates[currencyCode] = rateValue;
  try {
    localStorage.setItem(STORAGE_KEYS.RATE_PREFIX + currencyCode, rateValue);
    // Sincronizar legacy si aplica
    if (currencyCode === 'cop') localStorage.setItem(STORAGE_KEYS.LEGACY_RATE_COP, rateValue);
    if (currencyCode === 'crc') localStorage.setItem(STORAGE_KEYS.LEGACY_RATE_CRC, rateValue);
  } catch (e) {
    console.warn('Error al guardar tasa:', e);
  }
}

// =============================================================================
// RENDERIZADO VISUAL DE SLOTS Y CHIPS
// =============================================================================
function renderSlot(slotIndex) {
  const curKey = state.slots[slotIndex];
  const cur = CURRENCIES[curKey];
  if (!cur) return;

  // Actualizar cabecera
  dom.flags[slotIndex].innerHTML = cur.flagSvg;
  dom.codes[slotIndex].textContent = cur.code;
  dom.countries[slotIndex].textContent = `${cur.country} · ${cur.name}`;
  dom.symbols[slotIndex].textContent = cur.symbol;

  // Actualizar chips de montos rápidos calibrados
  const container = dom.chipsContainers[slotIndex];
  container.innerHTML = '';

  cur.chips.forEach(chip => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip';
    btn.textContent = chip.label;
    btn.setAttribute('data-slot', slotIndex);
    btn.setAttribute('data-val', chip.val);
    btn.addEventListener('click', () => {
      onChipClicked(slotIndex, chip.val, chip.label);
    });
    container.appendChild(btn);
  });
}

function renderAllSlots() {
  for (let i = 0; i < 3; i++) {
    renderSlot(i);
  }
}

/**
 * Renderiza el panel dinámico de tasas manuales para las 3 divisas activas
 */
function renderManualRatesPanel() {
  dom.manualRatesContainer.innerHTML = '';

  // Identificar divisas activas que no sean USD
  // Si USD está presente, mostramos las otras 2.
  // Si USD no está presente, mostramos las 3 divisas respecto a 1 USD (el pivote universal).
  const activeCurrencies = state.slots;

  activeCurrencies.forEach(curKey => {
    if (curKey === 'usd') return; // 1 USD = 1 USD siempre

    const cur = CURRENCIES[curKey];
    if (!cur) return;

    const row = document.createElement('div');
    row.className = 'rate-row';

    const info = document.createElement('div');
    info.className = 'rate-info';

    const label = document.createElement('span');
    label.className = 'rate-label';
    label.textContent = `1 USD en ${cur.name.toLowerCase()}`;

    const sub = document.createElement('span');
    sub.className = 'rate-sub';
    sub.textContent = `${cur.country} · ${cur.code}`;

    info.appendChild(label);
    info.appendChild(sub);

    const inputBox = document.createElement('div');
    inputBox.className = 'rate-input-box';

    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'rate-number-input';
    input.value = state.rates[curKey] || cur.defaultRate;
    input.step = 'any';
    input.min = '0.0001';
    input.setAttribute('data-currency', curKey);

    input.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (!isNaN(val) && val > 0) {
        saveRateForCurrency(curKey, val);
        updateCrossRatesDisplay();

        // Recalcular con el valor actual del slot activo
        const activeInput = dom.inputs[state.activeSlotIndex];
        const rawAmt = parseCleanNumber(activeInput.value);
        if (rawAmt > 0) {
          calculateConversions(state.activeSlotIndex, rawAmt);
        }
      }
    });

    inputBox.appendChild(input);
    row.appendChild(info);
    row.appendChild(inputBox);

    dom.manualRatesContainer.appendChild(row);
  });
}

// =============================================================================
// CÁLCULO SIMULTÁNEO DE CONVERSIONES (PIVOTE USD)
// =============================================================================
function calculateConversions(sourceSlotIndex, amount) {
  const sourceCurKey = state.slots[sourceSlotIndex];
  const sourceRate = state.rates[sourceCurKey] || 1;

  if (isNaN(amount) || amount <= 0) {
    for (let i = 0; i < 3; i++) {
      if (i !== sourceSlotIndex) {
        dom.inputs[i].value = '';
      }
    }
    return;
  }

  // 1. Convertir la cantidad del slot de origen a USD
  const usdValue = (sourceCurKey === 'usd') ? amount : (amount / sourceRate);

  // 2. Calcular los otros 2 slots desde el valor en USD
  for (let i = 0; i < 3; i++) {
    if (i === sourceSlotIndex) continue;

    const targetCurKey = state.slots[i];
    const targetRate = state.rates[targetCurKey] || 1;
    const targetValue = (targetCurKey === 'usd') ? usdValue : (usdValue * targetRate);

    dom.inputs[i].value = formatNumber(targetValue, targetCurKey);
  }

  // Guardar última consulta para persistencia
  localStorage.setItem(STORAGE_KEYS.LAST_SLOT, sourceSlotIndex);
  localStorage.setItem(STORAGE_KEYS.LAST_AMOUNT, amount);
}

// =============================================================================
// FORMATEO NUMÉRICO Y PARSEO
// =============================================================================
function formatNumber(num, currencyKey) {
  if (num === null || isNaN(num)) return '';

  const cur = CURRENCIES[currencyKey] || { decimals: 2 };
  let decimals = cur.decimals;

  // Ajustes dinámicos inteligentes para cifras pequeñas o grandes
  if (num < 10 && decimals === 0) {
    decimals = 2; // Si es menos de 10 en COP/CRC, mostrar decimales para claridad
  } else if (num >= 1000 && decimals > 0 && Number.isInteger(num)) {
    decimals = 0;
  }

  // Región de formato según divisa
  let locale = 'es-CR';
  if (currencyKey === 'cop') locale = 'es-CO';
  if (currencyKey === 'mxn') locale = 'es-MX';
  if (currencyKey === 'usd' || currencyKey === 'cad' || currencyKey === 'aud') locale = 'en-US';
  if (currencyKey === 'eur') locale = 'es-ES';
  if (currencyKey === 'gbp') locale = 'en-GB';

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
}

function parseCleanNumber(str) {
  if (!str) return 0;
  let cleaned = str.toString().trim();

  // Si contiene puntos y comas estilo 100.000,50 o 100,000.50
  if (cleaned.includes('.') && cleaned.includes(',')) {
    const lastDot = cleaned.lastIndexOf('.');
    const lastComma = cleaned.lastIndexOf(',');
    if (lastComma > lastDot) {
      // Formato europeo/latam: 100.000,50 -> 100000.50
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      // Formato anglosajón: 100,000.50 -> 100000.50
      cleaned = cleaned.replace(/,/g, '');
    }
  } else if (cleaned.includes('.')) {
    // Si solo tiene puntos (ej: 100.000 como separador de miles)
    const parts = cleaned.split('.');
    if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3)) {
      cleaned = cleaned.replace(/\./g, '');
    }
  } else if (cleaned.includes(',')) {
    const parts = cleaned.split(',');
    if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3)) {
      cleaned = cleaned.replace(/,/g, '');
    } else {
      cleaned = cleaned.replace(',', '.');
    }
  }

  const result = parseFloat(cleaned);
  return isNaN(result) ? 0 : result;
}

function formatInputField(inputElem, rawNum, currencyKey) {
  if (!rawNum || isNaN(rawNum) || rawNum <= 0) return;
  inputElem.value = formatNumber(rawNum, currencyKey);
}

// =============================================================================
// PÍLDORA DE TASA CRUZADA DINÁMICA
// =============================================================================
function updateCrossRatesDisplay() {
  const [curAKey, curBKey, curCKey] = state.slots;
  const rateA = state.rates[curAKey] || 1;
  const rateB = state.rates[curBKey] || 1;
  const rateC = state.rates[curCKey] || 1;

  // Escoger dos divisas representativas para la tasa cruzada (priorizando las que no sean USD)
  let firstKey = curAKey;
  let secondKey = curBKey;

  if (firstKey === 'usd' && secondKey !== 'usd') {
    firstKey = curCKey;
  } else if (secondKey === 'usd') {
    secondKey = curCKey;
  }

  const rFirst = state.rates[firstKey] || 1;
  const rSecond = state.rates[secondKey] || 1;

  const curFirst = CURRENCIES[firstKey] || { code: firstKey.toUpperCase() };
  const curSecond = CURRENCIES[secondKey] || { code: secondKey.toUpperCase() };

  // 1 First en Second: (rSecond / rFirst)
  const oneFirstInSecond = (rSecond / rFirst);
  // Base 1 o 1.000 según la magnitud de la divisa
  const baseAmt = rFirst > 100 ? 1000 : 1;
  const baseConverted = ((baseAmt / rFirst) * rSecond);

  const formattedOne = oneFirstInSecond < 0.01 ? oneFirstInSecond.toFixed(4) : oneFirstInSecond.toFixed(2);
  const formattedBase = baseConverted < 0.01 ? baseConverted.toFixed(4) : baseConverted.toFixed(2);

  const baseLabel = baseAmt === 1 ? `1 ${curFirst.code}` : `1.000 ${curFirst.code}`;

  dom.crossText.innerHTML = `${baseLabel} ≈ <strong>${formattedBase} ${curSecond.code}</strong> · 1 ${curSecond.code} ≈ <strong>${(rFirst / rSecond).toFixed(2)} ${curFirst.code}</strong>`;
}

// =============================================================================
// INTERACCIÓN: SMART SWAP Y SELECTOR DE DIVISAS
// =============================================================================
function openCurrencySelector(slotIndex) {
  state.modalTargetSlot = slotIndex;
  const currentCurKey = state.slots[slotIndex];
  const cur = CURRENCIES[currentCurKey];

  dom.currencyModalSubtitle.textContent = `Cambiando Tarjeta ${slotIndex + 1} (${cur.code} · ${cur.name})`;
  dom.currencySearchInput.value = '';
  dom.btnClearSearch.classList.add('hidden');

  renderCurrencyList('');

  dom.currencyModal.classList.remove('hidden');
  dom.currencyModal.setAttribute('aria-hidden', 'false');
  triggerHaptic(20);

  setTimeout(() => {
    dom.currencySearchInput.focus();
  }, 100);
}

function closeCurrencySelector() {
  dom.currencyModal.classList.add('hidden');
  dom.currencyModal.setAttribute('aria-hidden', 'true');
  dom.currencySearchInput.blur();
}

/**
 * Renderiza la lista de 18 divisas en el modal con soporte de búsqueda en tiempo real
 */
function renderCurrencyList(filterQuery = '') {
  dom.currencyList.innerHTML = '';
  const query = filterQuery.toLowerCase().trim();

  const entries = Object.keys(CURRENCIES).map(key => ({
    key,
    ...CURRENCIES[key]
  }));

  const filtered = entries.filter(c => {
    if (!query) return true;
    return c.code.toLowerCase().includes(query) ||
           c.name.toLowerCase().includes(query) ||
           c.country.toLowerCase().includes(query) ||
           c.symbol.toLowerCase().includes(query);
  });

  if (filtered.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'currency-empty-search';
    empty.textContent = `No se encontró ninguna divisa para "${filterQuery}"`;
    dom.currencyList.appendChild(empty);
    return;
  }

  filtered.forEach(cur => {
    const item = document.createElement('div');
    item.className = 'currency-item';
    item.setAttribute('role', 'option');

    const slotIndexWithThisCur = state.slots.indexOf(cur.key);
    const isCurrentTarget = (slotIndexWithThisCur === state.modalTargetSlot);
    const isInAnotherSlot = (slotIndexWithThisCur !== -1 && !isCurrentTarget);

    if (isCurrentTarget) {
      item.classList.add('is-selected');
    }

    // Estructura izquierda: Bandera + Meta
    const left = document.createElement('div');
    left.className = 'item-left';

    const flagWrap = document.createElement('div');
    flagWrap.className = 'item-flag';
    flagWrap.innerHTML = cur.flagSvg;

    const info = document.createElement('div');
    info.className = 'item-info';

    const codeRow = document.createElement('div');
    codeRow.className = 'item-code-row';

    const codeSpan = document.createElement('span');
    codeSpan.className = 'item-code';
    codeSpan.textContent = cur.code;

    const symSpan = document.createElement('span');
    symSpan.className = 'item-symbol';
    symSpan.textContent = cur.symbol;

    codeRow.appendChild(codeSpan);
    codeRow.appendChild(symSpan);

    const countrySpan = document.createElement('span');
    countrySpan.className = 'item-country';
    countrySpan.textContent = `${cur.country} · ${cur.name}`;

    info.appendChild(codeRow);
    info.appendChild(countrySpan);

    left.appendChild(flagWrap);
    left.appendChild(info);

    // Estructura derecha: Badges de estado / Smart Swap Hint
    const right = document.createElement('div');
    right.className = 'item-right';

    if (isCurrentTarget) {
      const badge = document.createElement('span');
      badge.className = 'slot-badge current-slot';
      badge.textContent = 'En uso';
      right.appendChild(badge);
    } else if (isInAnotherSlot) {
      const badge = document.createElement('span');
      badge.className = 'slot-badge in-use';
      badge.textContent = `En Tarjeta ${slotIndexWithThisCur + 1} ⇅`;
      badge.title = 'Se intercambiarán de posición automáticamente';
      right.appendChild(badge);
    } else {
      const rateBadge = document.createElement('span');
      rateBadge.className = 'slot-badge swap-hint';
      rateBadge.textContent = cur.isBase ? '1.00 USD' : `1$ = ${cur.defaultRate}`;
      right.appendChild(rateBadge);
    }

    item.appendChild(left);
    item.appendChild(right);

    // Evento de selección con Smart Swap
    item.addEventListener('click', () => {
      selectCurrencyForSlot(state.modalTargetSlot, cur.key);
    });

    dom.currencyList.appendChild(item);
  });
}

/**
 * LÓGICA DE SMART SWAP:
 * Si la divisa elegida ya está en otro slot, intercambia posiciones limpiamente.
 */
function selectCurrencyForSlot(targetSlotIndex, selectedCurKey) {
  const existingSlotIndex = state.slots.indexOf(selectedCurKey);
  const currentSlotCurKey = state.slots[targetSlotIndex];

  if (existingSlotIndex === targetSlotIndex) {
    // Es la misma, no hacer nada
    closeCurrencySelector();
    return;
  }

  triggerHaptic(30);

  if (existingSlotIndex !== -1) {
    // SMART SWAP: Intercambio automático
    state.slots[targetSlotIndex] = selectedCurKey;
    state.slots[existingSlotIndex] = currentSlotCurKey;

    showToast(`Intercambio: ${currentSlotCurKey.toUpperCase()} ⇄ ${selectedCurKey.toUpperCase()}`);
  } else {
    // Reemplazo directo
    state.slots[targetSlotIndex] = selectedCurKey;
    showToast(`Tarjeta ${targetSlotIndex + 1}: ${selectedCurKey.toUpperCase()}`);
  }

  saveSlots();
  renderAllSlots();
  renderManualRatesPanel();
  updateCrossRatesDisplay();

  // Recalcular montos a partir del slot activo
  const activeInput = dom.inputs[state.activeSlotIndex];
  const rawAmt = parseCleanNumber(activeInput.value);
  if (rawAmt > 0) {
    calculateConversions(state.activeSlotIndex, rawAmt);
  }

  closeCurrencySelector();
}

// =============================================================================
// GESTIÓN DE EVENTOS Y ACCIONES
// =============================================================================
function onChipClicked(slotIndex, val, label) {
  triggerHaptic(15);
  state.activeSlotIndex = slotIndex;
  highlightActiveCard(slotIndex);

  const curKey = state.slots[slotIndex];
  const input = dom.inputs[slotIndex];
  input.value = val;

  calculateConversions(slotIndex, val);
  formatInputField(input, val, curKey);

  showToast(`Monto fijado: ${label} ${curKey.toUpperCase()}`);
}

function highlightActiveCard(slotIndex) {
  dom.cards.forEach((card, idx) => {
    if (idx === slotIndex) {
      card.classList.add('is-active');
    } else {
      card.classList.remove('is-active');
    }
  });
}

function triggerHaptic(duration = 15) {
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(duration);
    } catch (e) {
      // Ignorar restricciones del navegador
    }
  }
}

let toastTimeout = null;
function showToast(message) {
  dom.toast.textContent = message;
  dom.toast.classList.add('show');
  triggerHaptic(20);

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    dom.toast.classList.remove('show');
  }, 2600);
}

function setupEventListeners() {
  // Configurar los 3 inputs de slots
  for (let slotIndex = 0; slotIndex < 3; slotIndex++) {
    const input = dom.inputs[slotIndex];

    input.addEventListener('input', (e) => {
      state.activeSlotIndex = slotIndex;
      highlightActiveCard(slotIndex);

      const rawVal = parseCleanNumber(e.target.value);
      calculateConversions(slotIndex, rawVal);
    });

    input.addEventListener('focus', (e) => {
      state.activeSlotIndex = slotIndex;
      highlightActiveCard(slotIndex);

      const curKey = state.slots[slotIndex];
      const raw = parseCleanNumber(e.target.value);
      if (raw > 0) {
        // En USD y monedas con centavos preservar 2 decimales si no son enteros
        const hasDecimals = (CURRENCIES[curKey]?.decimals > 0 && raw % 1 !== 0);
        e.target.value = hasDecimals ? raw.toFixed(2) : Math.round(raw).toString();
      }
    });

    input.addEventListener('blur', (e) => {
      const curKey = state.slots[slotIndex];
      const raw = parseCleanNumber(e.target.value);
      if (raw > 0) {
        formatInputField(e.target, raw, curKey);
      }
    });
  }

  // Botones para abrir el selector de divisas en cada tarjeta
  dom.selectorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const slotIndex = parseInt(btn.getAttribute('data-slot'), 10);
      openCurrencySelector(slotIndex);
    });
  });

  // Botones para Copiar resultado
  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const slotIndex = parseInt(btn.getAttribute('data-slot'), 10);
      const input = dom.inputs[slotIndex];
      if (!input || !input.value) return;

      const curKey = state.slots[slotIndex];
      const cur = CURRENCIES[curKey];
      const valToCopy = input.value.trim();

      navigator.clipboard.writeText(valToCopy).then(() => {
        showToast(`Copiado: ${valToCopy} ${cur.code}`);
      }).catch(() => {
        input.select();
        document.execCommand('copy');
        showToast(`Copiado: ${valToCopy} ${cur.code}`);
      });
    });
  });

  // Botón Limpiar montos
  dom.btnClear.addEventListener('click', () => {
    triggerHaptic(30);
    dom.inputs.forEach(input => {
      input.value = '';
    });
    localStorage.removeItem(STORAGE_KEYS.LAST_AMOUNT);
    showToast('Montos borrados');
    dom.inputs[state.activeSlotIndex].focus();
  });

  // Botón Restaurar tasas a valores de fábrica
  dom.btnRestore.addEventListener('click', () => {
    triggerHaptic(40);

    // Restaurar tasas de las divisas actualmente activas
    state.slots.forEach(curKey => {
      const def = CURRENCIES[curKey].defaultRate;
      state.rates[curKey] = def;
      saveRateForCurrency(curKey, def);
    });

    renderManualRatesPanel();
    updateCrossRatesDisplay();

    // Recalcular
    const activeInput = dom.inputs[state.activeSlotIndex];
    const rawAmt = parseCleanNumber(activeInput.value);
    if (rawAmt > 0) {
      calculateConversions(state.activeSlotIndex, rawAmt);
    }

    showToast('Tasas de las 3 divisas restauradas');
  });

  // Búsqueda en el modal de divisas
  dom.currencySearchInput.addEventListener('input', (e) => {
    const q = e.target.value;
    if (q.length > 0) {
      dom.btnClearSearch.classList.remove('hidden');
    } else {
      dom.btnClearSearch.classList.add('hidden');
    }
    renderCurrencyList(q);
  });

  dom.btnClearSearch.addEventListener('click', () => {
    dom.currencySearchInput.value = '';
    dom.btnClearSearch.classList.add('hidden');
    dom.currencySearchInput.focus();
    renderCurrencyList('');
  });

  // Cerrar modal selector
  dom.btnCloseCurrencyModal.addEventListener('click', closeCurrencySelector);
  dom.currencyModal.addEventListener('click', (e) => {
    if (e.target === dom.currencyModal) {
      closeCurrencySelector();
    }
  });

  // Modal iOS Install
  if (dom.btnCloseIosModal && dom.iosInstallModal) {
    dom.btnCloseIosModal.addEventListener('click', () => {
      dom.iosInstallModal.classList.add('hidden');
    });
  }
}

// =============================================================================
// SERVICE WORKER & PWA INSTALL
// =============================================================================
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registrado:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Error Service Worker:', err);
        });
    });
  }
}

function isRunningStandalone() {
  return window.navigator.standalone === true || 
         window.matchMedia('(display-mode: standalone)').matches ||
         window.matchMedia('(display-mode: fullscreen)').matches;
}

function isIosDevice() {
  const ua = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua);
}

function setupPwaInstall() {
  if (isRunningStandalone()) {
    dom.btnInstall.classList.add('hidden');
    return;
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    state.deferredPrompt = e;
    dom.btnInstall.classList.remove('hidden');
  });

  dom.btnInstall.addEventListener('click', () => {
    if (isIosDevice()) {
      dom.iosInstallModal.classList.remove('hidden');
      return;
    }

    if (state.deferredPrompt) {
      state.deferredPrompt.prompt();
      state.deferredPrompt.userChoice.then((choice) => {
        if (choice.outcome === 'accepted') {
          dom.btnInstall.classList.add('hidden');
        }
        state.deferredPrompt = null;
      });
    } else {
      showToast('Para instalar, usa "Agregar a pantalla de inicio"');
    }
  });

  window.addEventListener('appinstalled', () => {
    dom.btnInstall.classList.add('hidden');
    showToast('¡Beso de 3 instalada con éxito!');
  });
}

// Arrancar la app al cargar el DOM
document.addEventListener('DOMContentLoaded', initApp);
