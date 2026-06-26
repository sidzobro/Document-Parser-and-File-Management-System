// settings.js

function $(id){ return document.getElementById(id); }

/* Full UI translations here only for EN/ES/FR/DE (others will still save & show). */
const translations = {
  en: { textSize:"Text Size", language:"Language", colourMode:"Colour Mode", layout:"Layout",
        small:"Small", medium:"Medium", large:"Large", colourblindMode:"Colourblind Mode", simplifiedLayout:"Simplified Layout",
        searchLang:"Search language..." },
  es: { textSize:"Tamaño de texto", language:"Idioma", colourMode:"Modo de color", layout:"Diseño",
        small:"Pequeño", medium:"Mediano", large:"Grande", colourblindMode:"Modo daltónico", simplifiedLayout:"Diseño simple",
        searchLang:"Buscar idioma..." },
  fr: { textSize:"Taille du texte", language:"Langue", colourMode:"Mode couleur", layout:"Mise en page",
        small:"Petit", medium:"Moyen", large:"Grand", colourblindMode:"Mode daltonien", simplifiedLayout:"Mode simple",
        searchLang:"Rechercher une langue..." },
  de: { textSize:"Textgröße", language:"Sprache", colourMode:"Farbmodus", layout:"Layout",
        small:"Klein", medium:"Mittel", large:"Groß", colourblindMode:"Farbenblind-Modus", simplifiedLayout:"Einfaches Layout",
        searchLang:"Sprache suchen..." }
};

/* Big language list (flags + European + Asian). Flags are emoji (works without images). */
const languages = [
  { code:"en", name:"English", flag:"🇬🇧" },
  { code:"es", name:"Español (Spanish)", flag:"🇪🇸" },
  { code:"fr", name:"Français (French)", flag:"🇫🇷" },
  { code:"de", name:"Deutsch (German)", flag:"🇩🇪" },
  { code:"it", name:"Italiano (Italian)", flag:"🇮🇹" },
  { code:"pt", name:"Português (Portuguese)", flag:"🇵🇹" },
  { code:"nl", name:"Nederlands (Dutch)", flag:"🇳🇱" },
  { code:"sv", name:"Svenska (Swedish)", flag:"🇸🇪" },
  { code:"no", name:"Norsk (Norwegian)", flag:"🇳🇴" },
  { code:"da", name:"Dansk (Danish)", flag:"🇩🇰" },
  { code:"fi", name:"Suomi (Finnish)", flag:"🇫🇮" },
  { code:"pl", name:"Polski (Polish)", flag:"🇵🇱" },
  { code:"cs", name:"Čeština (Czech)", flag:"🇨🇿" },
  { code:"hu", name:"Magyar (Hungarian)", flag:"🇭🇺" },
  { code:"ro", name:"Română (Romanian)", flag:"🇷🇴" },
  { code:"el", name:"Ελληνικά (Greek)", flag:"🇬🇷" },
  { code:"uk", name:"Українська (Ukrainian)", flag:"🇺🇦" },

  { code:"zh", name:"中文 (Chinese)", flag:"🇨🇳" },
  { code:"ja", name:"日本語 (Japanese)", flag:"🇯🇵" },
  { code:"ko", name:"한국어 (Korean)", flag:"🇰🇷" },
  { code:"hi", name:"हिन्दी (Hindi)", flag:"🇮🇳" },
  { code:"bn", name:"বাংলা (Bengali)", flag:"🇧🇩" },
  { code:"ur", name:"اردو (Urdu)", flag:"🇵🇰" },
  { code:"ta", name:"தமிழ் (Tamil)", flag:"🇮🇳" },
  { code:"te", name:"తెలుగు (Telugu)", flag:"🇮🇳" },
  { code:"th", name:"ไทย (Thai)", flag:"🇹🇭" },
  { code:"vi", name:"Tiếng Việt (Vietnamese)", flag:"🇻🇳" },
  { code:"id", name:"Bahasa Indonesia", flag:"🇮🇩" },
  { code:"ms", name:"Bahasa Melayu (Malay)", flag:"🇲🇾" }
];

function setTextSize(sizeClass){
  document.body.classList.remove("text-small","text-medium","text-large");
  document.body.classList.add(sizeClass);
  localStorage.setItem("textSize", sizeClass);
}

function setColourblindMode(isOn){
  document.body.classList.toggle("colourblind", isOn);
  localStorage.setItem("colourblind", isOn ? "1":"0");
}

function setSimpleLayout(isOn){
  document.body.classList.toggle("simple-layout", isOn);
  localStorage.setItem("simpleLayout", isOn ? "1":"0");
}

function applySettingsPageLanguage(code){
  const t = translations[code] || translations.en;

  if ($("labelTextSize")) $("labelTextSize").textContent = t.textSize;
  if ($("labelLanguage")) $("labelLanguage").textContent = t.language;
  if ($("labelColourMode")) $("labelColourMode").textContent = t.colourMode;
  if ($("labelLayout")) $("labelLayout").textContent = t.layout;

  if ($("btnSmall")) $("btnSmall").textContent = t.small;
  if ($("btnMedium")) $("btnMedium").textContent = t.medium;
  if ($("btnLarge")) $("btnLarge").textContent = t.large;

  if ($("txtColourblind")) $("txtColourblind").textContent = t.colourblindMode;
  if ($("txtSimpleLayout")) $("txtSimpleLayout").textContent = t.simplifiedLayout;

  if ($("langSearch")) $("langSearch").placeholder = t.searchLang;
}

function renderLanguageList(filterText){
  const list = $("langList");
  list.innerHTML = "";

  const q = (filterText || "").toLowerCase();

  languages
    .filter(l => l.name.toLowerCase().includes(q) || l.code.toLowerCase().includes(q))
    .forEach(l => {
      const item = document.createElement("div");
      item.className = "langItem";
      item.innerHTML = `<span class="langFlag">${l.flag}</span><span>${l.name}</span>`;
      item.addEventListener("click", () => selectLanguage(l.code));
      list.appendChild(item);
    });
}

function selectLanguage(code){
  const lang = languages.find(l => l.code === code) || languages[0];

  // show selection on button
  $("langBtnText").textContent = `${lang.flag} ${lang.name}`;

  // Save for all pages
  localStorage.setItem("language", lang.code);

  // Translate Settings page labels (full for EN/ES/FR/DE)
  applySettingsPageLanguage(lang.code);

  // Close dropdown
  $("langDropdown").classList.add("hidden");
}

window.addEventListener("DOMContentLoaded", () => {
  // Load saved settings
  const savedText = localStorage.getItem("textSize") || "text-medium";
  const savedColour = localStorage.getItem("colourblind") === "1";
  const savedLang = localStorage.getItem("language") || "en";
  const savedSimple = localStorage.getItem("simpleLayout") === "1";

  // Apply
  setTextSize(savedText);
  setColourblindMode(savedColour);
  setSimpleLayout(savedSimple);

  // Sync toggles
  $("colourblindToggle").checked = savedColour;
  $("simpleLayoutToggle").checked = savedSimple;

  // Apply language + button text
  applySettingsPageLanguage(savedLang);
  selectLanguage(savedLang);

  // Text size buttons
  $("smallText").addEventListener("click", () => setTextSize("text-small"));
  $("mediumText").addEventListener("click", () => setTextSize("text-medium"));
  $("largeText").addEventListener("click", () => setTextSize("text-large"));

  // Toggles
  $("colourblindToggle").addEventListener("change", e => setColourblindMode(e.target.checked));
  $("simpleLayoutToggle").addEventListener("change", e => setSimpleLayout(e.target.checked));

  // Language dropdown open/close
  $("langBtn").addEventListener("click", () => {
    $("langDropdown").classList.toggle("hidden");
    $("langSearch").value = "";
    renderLanguageList("");
    $("langSearch").focus();
  });

  $("langSearch").addEventListener("input", (e) => {
    renderLanguageList(e.target.value);
  });

  // click outside closes
  document.addEventListener("click", (e) => {
    const picker = document.querySelector(".langPicker");
    if (picker && !picker.contains(e.target)) {
      $("langDropdown").classList.add("hidden");
    }
  });

  renderLanguageList("");
});