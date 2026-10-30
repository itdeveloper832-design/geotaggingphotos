/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./*.js"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-bright": "#f7f9fb",
        "inverse-surface": "#2d3133",
        "on-tertiary": "#ffffff",
        "on-tertiary-fixed-variant": "#005236",
        "on-surface": "#191c1e",
        "outline": "#76777d",
        "surface-container-highest": "#e0e3e5",
        "error": "#ba1a1a",
        "surface-container-high": "#e6e8ea",
        "tertiary": "#000000",
        "surface-tint": "#565e74",
        "tertiary-container": "#002113",
        "on-secondary-container": "#fefcff",
        "surface-container-lowest": "#ffffff",
        "inverse-on-surface": "#eff1f3",
        "on-error": "#ffffff",
        "on-tertiary-container": "#009668",
        "on-secondary-fixed-variant": "#003ea8",
        "secondary-fixed-dim": "#b4c5ff",
        "primary-fixed-dim": "#bec6e0",
        "primary-container": "#131b2e",
        "on-primary-container": "#7c839b",
        "tertiary-fixed-dim": "#4edea3",
        "on-error-container": "#93000a",
        "surface-container": "#eceef0",
        "on-primary": "#ffffff",
        "background": "#f7f9fb",
        "error-container": "#ffdad6",
        "on-secondary": "#ffffff",
        "tertiary-fixed": "#6ffbbe",
        "on-tertiary-fixed": "#002113",
        "surface-container-low": "#f2f4f6",
        "outline-variant": "#c6c6cd",
        "surface": "#f7f9fb",
        "inverse-primary": "#bec6e0",
        "primary-fixed": "#dae2fd",
        "on-secondary-fixed": "#00174b",
        "secondary-fixed": "#dbe1ff",
        "on-primary-fixed": "#131b2e",
        "on-background": "#191c1e",
        "secondary": "#0051d5",
        "primary": "#000000",
        "on-surface-variant": "#45464d",
        "surface-dim": "#d8dadc",
        "on-primary-fixed-variant": "#3f465c",
        "surface-variant": "#e0e3e5",
        "secondary-container": "#316bf3"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        "container-max": "1280px",
        "margin-desktop": "40px",
        unit: "8px",
        "margin-mobile": "16px",
        gutter: "24px"
      },
      fontFamily: {
        "mono-data": ["Geist", "monospace"],
        "label-md": ["Geist", "sans-serif"],
        "headline-lg": ["Geist", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        display: ["Geist", "sans-serif"],
        "headline-lg-mobile": ["Geist", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"]
      },
      fontSize: {
        "mono-data": ["13px", { lineHeight: "1.4", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "1.4", letterSpacing: "0.01em", fontWeight: "500" }],
        "headline-lg": ["32px", { lineHeight: "1.2", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        display: ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg-mobile": ["24px", { lineHeight: "1.2", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }]
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ]
};
