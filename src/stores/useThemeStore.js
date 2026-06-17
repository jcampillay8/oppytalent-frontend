import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    // Default to 'dark' as decided in the Master Plan
    theme: localStorage.getItem('oppy_theme') || 'dark',
    // Custom primary color (HSL) chosen by the user in theme-config
    customPrimaryHsl: localStorage.getItem('oppy_custom_primary_hsl') || null,
  }),

  actions: {
    initTheme() {
      this.applyTheme(this.theme);
      if (this.customPrimaryHsl) {
        this.applyCustomColor(this.customPrimaryHsl);
      }
    },

    setTheme(newTheme) {
      this.theme = newTheme;
      localStorage.setItem('oppy_theme', newTheme);
      this.applyTheme(newTheme);
    },

    setCustomColor(hslString) {
      this.customPrimaryHsl = hslString;
      if (hslString) {
        localStorage.setItem('oppy_custom_primary_hsl', hslString);
        this.applyCustomColor(hslString);
      } else {
        localStorage.removeItem('oppy_custom_primary_hsl');
        this.removeCustomColor();
      }
    },

    applyTheme(themeName) {
      const htmlEl = document.documentElement;
      
      // Remove previous themes
      htmlEl.classList.remove(
        'light', 'dark', 'ocean-blue', 
        'theme-light-minimalist', 'theme-dark-glass', 'theme-ocean-blue',
        'theme-cyber-neon', 'theme-rose-gold',
        'dark-glass', 'light-minimalist', 'cyber-neon', 'rose-gold'
      );
      
      // Add the theme class. We prepend 'theme-' if it's one of the known db values that lacks it
      let mappedTheme = themeName;
      const validThemes = ['light-minimalist', 'dark-glass', 'ocean-blue', 'cyber-neon', 'rose-gold'];
      
      if (validThemes.includes(themeName)) {
        mappedTheme = `theme-${themeName}`;
      } else if (themeName === 'dark') {
        mappedTheme = 'theme-dark-glass';
      } else if (themeName === 'light') {
        mappedTheme = 'theme-light-minimalist';
      }
      
      htmlEl.classList.add(mappedTheme);
      
      // Backward compatibility for Tailwind dark mode
      if (mappedTheme === 'theme-dark-glass' || mappedTheme === 'theme-cyber-neon' || mappedTheme === 'theme-rose-gold' || mappedTheme === 'theme-ocean-blue') {
        htmlEl.classList.add('dark');
      } else {
        htmlEl.classList.add('light');
      }
    },

    applyCustomColor(hslString) {
      // hslString should be in format "H S% L%" e.g., "161 72% 45%"
      document.documentElement.style.setProperty('--primary', hslString);
      document.documentElement.style.setProperty('--ring', hslString);
    },

    removeCustomColor() {
      document.documentElement.style.removeProperty('--primary');
      document.documentElement.style.removeProperty('--ring');
    }
  }
});
