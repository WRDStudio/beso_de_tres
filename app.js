/**
 * Conversor de Divisas PWA - COP · CRC · USD
 * Soporte Android PWA con conversión reactiva simultánea y tasas configurables
 */

// Constantes y Valores Predeterminados (según imagen)
const DEFAULT_RATES = {
  cop: 3200, // 1 USD = 3200 COP (Colombia)
  crc: 450   // 1 USD = 450 CRC (Costa Rica)
};

const STORAGE_KEYS = {
  RATE_COP: 'divisas_rate_cop_v1',
  RATE_CRC: 'divisas_rate_crc_v1',
  LAST_CURRENCY: 'divisas_last_currency',
  LAST_AMOUNT: 'divisas_last_amount'
};

// Estado de la aplicación
const state = {
  rates: {
    cop: DEFAULT_RATES.cop,
    crc: DEFAULT_RATES.crc
  },
  activeCurrency: 'cop',
  deferredPrompt: null
};

// Elementos DOM
const dom = {
  inputCop: document.getElementById('input-cop'),
  inputCrc: document.getElementById('input-crc'),
  inputUsd: document.getElementById('input-usd'),
  
  rateCopInput: document.getElementById('rate-cop'),
  rateCrcInput: document.getElementById('rate-crc'),
  btnRestore: document.getElementById('btn-restore'),
  
  crossText: document.getElementById('cross-text'),
  btnClear: document.getElementById('btn-clear'),
  btnInstall: document.getElementById('btn-install'),
  toast: document.getElementById('toast'),
  
  cards: {
    cop: document.getElementById('card-cop'),
    crc: document.getElementById('card-crc'),
    usd: document.getElementById('card-usd')
  }
};

/**
 * Inicialización de la App
 */
function initApp() {
  loadStoredRates();
  setupEventListeners();
  updateCrossRatesDisplay();
  registerServiceWorker();
  setupPwaInstall();
  
  // Valor inicial sugerido: 100.000 COP para ver la conversión inmediata
  const savedAmount = localStorage.getItem(STORAGE_KEYS.LAST_AMOUNT);
  const savedCur = localStorage.getItem(STORAGE_KEYS.LAST_CURRENCY) || 'cop';
  
  if (savedAmount && parseFloat(savedAmount) > 0) {
    state.activeCurrency = savedCur;
    if (dom[`input${capitalize(savedCur)}`]) {
      dom[`input${capitalize(savedCur)}`].value = savedAmount;
      calculateConversions(savedCur, parseFloat(savedAmount));
    }
  } else {
    // Demo inicial amigable: 100,000 COP
    state.activeCurrency = 'cop';
    dom.inputCop.value = '100000';
    calculateConversions('cop', 100000);
    formatInputField(dom.inputCop, 100000);
  }

  highlightActiveCard(state.activeCurrency);
}

/**
 * Carga las tasas guardadas en localStorage o asigna las predeterminadas
 */
function loadStoredRates() {
  const savedCop = parseFloat(localStorage.getItem(STORAGE_KEYS.RATE_COP));
  const savedCrc = parseFloat(localStorage.getItem(STORAGE_KEYS.RATE_CRC));

  state.rates.cop = (!isNaN(savedCop) && savedCop > 0) ? savedCop : DEFAULT_RATES.cop;
  state.rates.crc = (!isNaN(savedCrc) && savedCrc > 0) ? savedCrc : DEFAULT_RATES.crc;

  dom.rateCopInput.value = state.rates.cop;
  dom.rateCrcInput.value = state.rates.crc;
}

/**
 * Guarda las tasas en localStorage
 */
function saveRates() {
  localStorage.setItem(STORAGE_KEYS.RATE_COP, state.rates.cop);
  localStorage.setItem(STORAGE_KEYS.RATE_CRC, state.rates.crc);
}

/**
 * Cálculo simultáneo de conversiones
 * Usa USD como divisa base pivote
 */
function calculateConversions(sourceCurrency, amount) {
  if (isNaN(amount) || amount <= 0) {
    if (sourceCurrency !== 'cop') dom.inputCop.value = '';
    if (sourceCurrency !== 'crc') dom.inputCrc.value = '';
    if (sourceCurrency !== 'usd') dom.inputUsd.value = '';
    return;
  }

  let usdValue = 0;

  // 1. Convertir divisa origen a USD
  if (sourceCurrency === 'cop') {
    usdValue = amount / state.rates.cop;
  } else if (sourceCurrency === 'crc') {
    usdValue = amount / state.rates.crc;
  } else if (sourceCurrency === 'usd') {
    usdValue = amount;
  }

  // 2. Calcular las otras dos divisas desde USD
  if (sourceCurrency !== 'cop') {
    const copVal = usdValue * state.rates.cop;
    dom.inputCop.value = formatNumber(copVal, 'cop');
  }

  if (sourceCurrency !== 'crc') {
    const crcVal = usdValue * state.rates.crc;
    dom.inputCrc.value = formatNumber(crcVal, 'crc');
  }

  if (sourceCurrency !== 'usd') {
    dom.inputUsd.value = formatNumber(usdValue, 'usd');
  }

  // Guardar última consulta
  localStorage.setItem(STORAGE_KEYS.LAST_CURRENCY, sourceCurrency);
  localStorage.setItem(STORAGE_KEYS.LAST_AMOUNT, amount);
}

/**
 * Formateo estético de números
 */
function formatNumber(num, currency) {
  if (num === null || isNaN(num)) return '';

  if (currency === 'usd') {
    // Dólares: siempre 2 decimales si tiene centavos o para claridad
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  } else if (currency === 'cop') {
    // Pesos: usualmente enteros para cifras normales, 2 si es menor a 10
    const decimals = num < 10 ? 2 : 0;
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  } else {
    // Colones: enteros si >= 100, 2 si es menor
    const decimals = num < 100 ? 2 : 0;
    return new Intl.NumberFormat('es-CR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  }
}

/**
 * Limpia string ingresado para convertirlo a Float seguro
 */
function parseCleanNumber(str) {
  if (!str) return 0;
  // Elimina caracteres que no sean dígitos, puntos o comas
  let cleaned = str.toString().trim();
  
  // Si contiene puntos y comas estilo 100.000,50
  if (cleaned.includes('.') && cleaned.includes(',')) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (cleaned.includes('.')) {
    // Si solo tiene puntos (ej: 100.000 como separador de miles)
    // Verificamos si parece separador de miles (ej: 100.000)
    const parts = cleaned.split('.');
    if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3)) {
      cleaned = cleaned.replace(/\./g, '');
    }
  } else if (cleaned.includes(',')) {
    // Si tiene comas como decimal
    cleaned = cleaned.replace(',', '.');
  }

  const result = parseFloat(cleaned);
  return isNaN(result) ? 0 : result;
}

/**
 * Formatea un input cuando pierde el foco
 */
function formatInputField(inputElem, rawNum) {
  if (!rawNum || isNaN(rawNum) || rawNum <= 0) return;
  const curr = inputElem.id.replace('input-', '');
  inputElem.value = formatNumber(rawNum, curr);
}

/**
 * Actualiza el indicador visual de tasa cruzada directa COP ↔ CRC
 */
function updateCrossRatesDisplay() {
  const rateCop = state.rates.cop;
  const rateCrc = state.rates.crc;
  
  if (rateCrc <= 0 || rateCop <= 0) return;

  // 1 CRC en COP: (1 / rateCrc) * rateCop
  const oneCrcInCop = (rateCop / rateCrc).toFixed(2);
  
  // 1.000 COP en CRC: (1000 / rateCop) * rateCrc
  const thousandCopInCrc = ((1000 / rateCop) * rateCrc).toFixed(2);

  dom.crossText.innerHTML = `1 CRC ≈ <strong>${oneCrcInCop} COP</strong> · 1.000 COP ≈ <strong>${thousandCopInCrc} CRC</strong>`;
}

/**
 * Destaca visualmente la tarjeta que está activa / en foco
 */
function highlightActiveCard(cur) {
  Object.keys(dom.cards).forEach((key) => {
    if (key === cur) {
      dom.cards[key].classList.add('is-active');
    } else {
      dom.cards[key].classList.remove('is-active');
    }
  });
}

/**
 * Vibración háptica en Android
 */
function triggerHaptic(duration = 15) {
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(duration);
    } catch (e) {
      // Ignorar restricciones del navegador
    }
  }
}

/**
 * Muestra notificación Toast
 */
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

/**
 * Configuración de Eventos
 */
function setupEventListeners() {
  const currencies = ['cop', 'crc', 'usd'];

  currencies.forEach((cur) => {
    const input = dom[`input${capitalize(cur)}`];

    // Al escribir en cualquiera de los 3 inputs
    input.addEventListener('input', (e) => {
      state.activeCurrency = cur;
      highlightActiveCard(cur);

      const rawVal = parseCleanNumber(e.target.value);
      calculateConversions(cur, rawVal);
    });

    // Al enfocar el input
    input.addEventListener('focus', (e) => {
      state.activeCurrency = cur;
      highlightActiveCard(cur);
      
      // Si el valor contiene separadores de miles, limpiarlo para facilitar la edición
      const raw = parseCleanNumber(e.target.value);
      if (raw > 0) {
        // En USD preservar 2 decimales si los tiene, en COP/CRC enteros
        e.target.value = (cur === 'usd' && raw % 1 !== 0) ? raw.toFixed(2) : Math.round(raw).toString();
      }
    });

    // Al desenfocar el input, aplicar formato bonito
    input.addEventListener('blur', (e) => {
      const raw = parseCleanNumber(e.target.value);
      if (raw > 0) {
        formatInputField(e.target, raw);
      }
    });
  });

  // Botones para Copiar resultado
  document.querySelectorAll('.btn-copy').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input || !input.value) return;

      const curName = targetId.replace('input-', '').toUpperCase();
      const valToCopy = input.value.trim();

      navigator.clipboard.writeText(valToCopy).then(() => {
        showToast(`Copiado: ${valToCopy} ${curName}`);
      }).catch(() => {
        // Fallback
        input.select();
        document.execCommand('copy');
        showToast(`Copiado: ${valToCopy} ${curName}`);
      });
    });
  });

  // Chips de montos rápidos
  document.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const cur = chip.getAttribute('data-currency');
      const val = parseFloat(chip.getAttribute('data-val'));
      
      triggerHaptic(15);
      state.activeCurrency = cur;
      highlightActiveCard(cur);

      const input = dom[`input${capitalize(cur)}`];
      input.value = val;
      calculateConversions(cur, val);
      formatInputField(input, val);

      showToast(`Monto fijado: ${chip.textContent} ${cur.toUpperCase()}`);
    });
  });

  // Botón Limpiar
  dom.btnClear.addEventListener('click', () => {
    triggerHaptic(30);
    dom.inputCop.value = '';
    dom.inputCrc.value = '';
    dom.inputUsd.value = '';
    localStorage.removeItem(STORAGE_KEYS.LAST_AMOUNT);
    showToast('Montos borrados');
    dom.inputCop.focus();
  });

  // Modificación manual de tasas
  dom.rateCopInput.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val > 0) {
      state.rates.cop = val;
      saveRates();
      updateCrossRatesDisplay();
      
      // Recalcular con el valor actual de la divisa activa
      const currentInput = dom[`input${capitalize(state.activeCurrency)}`];
      const rawAmt = parseCleanNumber(currentInput.value);
      if (rawAmt > 0) {
        calculateConversions(state.activeCurrency, rawAmt);
      }
    }
  });

  dom.rateCrcInput.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val > 0) {
      state.rates.crc = val;
      saveRates();
      updateCrossRatesDisplay();
      
      const currentInput = dom[`input${capitalize(state.activeCurrency)}`];
      const rawAmt = parseCleanNumber(currentInput.value);
      if (rawAmt > 0) {
        calculateConversions(state.activeCurrency, rawAmt);
      }
    }
  });

  // Botón Restaurar tasas (según imagen: 3200 COP y 450 CRC)
  dom.btnRestore.addEventListener('click', () => {
    triggerHaptic(40);
    state.rates.cop = DEFAULT_RATES.cop;
    state.rates.crc = DEFAULT_RATES.crc;

    dom.rateCopInput.value = DEFAULT_RATES.cop;
    dom.rateCrcInput.value = DEFAULT_RATES.crc;

    saveRates();
    updateCrossRatesDisplay();

    // Recalcular
    const currentInput = dom[`input${capitalize(state.activeCurrency)}`];
    const rawAmt = parseCleanNumber(currentInput.value);
    if (rawAmt > 0) {
      calculateConversions(state.activeCurrency, rawAmt);
    }

    showToast('Tasas restauradas: 3.200 COP · 450 CRC');
  });
}

/**
 * PWA: Registro del Service Worker
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registrado con éxito:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Error al registrar Service Worker:', err);
        });
    });
  }
}

/**
 * PWA: Instalación en Android
 */
function setupPwaInstall() {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevenir mini-infobar automático en móviles
    e.preventDefault();
    state.deferredPrompt = e;
    
    // Mostrar botón de instalar en el header
    dom.btnInstall.classList.remove('hidden');

    dom.btnInstall.addEventListener('click', async () => {
      triggerHaptic(25);
      if (!state.deferredPrompt) return;
      
      state.deferredPrompt.prompt();
      const { outcome } = await state.deferredPrompt.userChoice;
      console.log(`[PWA] Resultado de instalación: ${outcome}`);
      
      state.deferredPrompt = null;
      dom.btnInstall.classList.add('hidden');
    });
  });

  window.addEventListener('appinstalled', () => {
    dom.btnInstall.classList.add('hidden');
    showToast('¡App instalada correctamente en tu dispositivo!');
  });
}

/**
 * Helper
 */
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Iniciar aplicación
document.addEventListener('DOMContentLoaded', initApp);
