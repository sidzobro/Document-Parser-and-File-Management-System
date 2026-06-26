// applySettings.js

function setText(elId, value) {
      const el = document.getElementById(elId);
      if (el) el.textContent = value;
    }
    
    window.addEventListener("DOMContentLoaded", () => {
      // Text size
      const textSize = localStorage.getItem("textSize") || "text-medium";
      document.body.classList.remove("text-small", "text-medium", "text-large");
      document.body.classList.add(textSize);
    
      // Colourblind mode
      const cb = localStorage.getItem("colourblind") === "1";
      document.body.classList.toggle("colourblind", cb);
    
      // Language
      const lang = localStorage.getItem("language") || "en";
    
      const T = {
        en: {
          back: "Back",
          account: "Account",
          settings: "Settings",
          main: "Main Menu",
          login: "Login",
          logout: "Logout",
          language: "Language",
          email: "Email",
          address: "Address",
          phone: "Phone",
          password: "Password",
          goAccount: "Go to Account",
          goSettings: "Go to Settings",
          goLanguage: "Language"
        },
    
        es: {
          back: "Atrás",
          account: "Cuenta",
          settings: "Ajustes",
          main: "Menú",
          login: "Iniciar sesión",
          logout: "Cerrar sesión",
          language: "Idioma",
          email: "Correo",
          address: "Dirección",
          phone: "Teléfono",
          password: "Contraseña",
          goAccount: "Ir a Cuenta",
          goSettings: "Ir a Ajustes",
          goLanguage: "Idioma"
        },
    
        fr: {
          back: "Retour",
          account: "Compte",
          settings: "Paramètres",
          main: "Menu",
          login: "Connexion",
          logout: "Déconnexion",
          language: "Langue",
          email: "Email",
          address: "Adresse",
          phone: "Téléphone",
          password: "Mot de passe",
          goAccount: "Aller au Compte",
          goSettings: "Aller aux Paramètres",
          goLanguage: "Langue"
        },
    
        de: {
          back: "Zurück",
          account: "Konto",
          settings: "Einstellungen",
          main: "Hauptmenü",
          login: "Anmelden",
          logout: "Abmelden",
          language: "Sprache",
          email: "E-Mail",
          address: "Adresse",
          phone: "Telefon",
          password: "Passwort",
          goAccount: "Zum Konto",
          goSettings: "Zu Einstellungen",
          goLanguage: "Sprache"
        }
      };
    
      const t = T[lang] || T.en;
    
      // Back and titles
      setText("backBtn", t.back);
      setText("titleLogin", t.login);
      setText("titleMain", t.main);
      setText("titleAccount", t.account);
      setText("titleSettings", t.settings);
      setText("titleLanguage", t.language);
    
      // Navigation
      setText("navAccount", t.account);
      setText("navSettings", t.settings);
      setText("navMain", t.main);
    
      // Account labels
      setText("lblEmail", t.email);
      setText("lblAddress", t.address);
      setText("lblPhone", t.phone);
      setText("lblPassword", t.password);
    
      // Main menu buttons
      setText("btnGoAccount", t.goAccount);
      setText("btnGoSettings", t.goSettings);
      setText("btnGoLanguage", t.goLanguage);
      setText("btnLogout", t.logout);
    });