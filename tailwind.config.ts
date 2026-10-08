import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", "dark"],

  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    /*--------------------------------------------------------------------------
    | PAGE GRID — outer (edge) spacing per breakpoint
    |--------------------------------------------------------------------------
    | xs  < 640px          px-4    1rem (16px)
    | sm  ≥ 640px   sm:px-6        1.5rem (24px)
    | md  ≥ 768px   md:px-8        2rem (32px)
    | lg  ≥ 1024px  lg:px-12       3rem (48px)
    | xl  ≥ 1280px  xl:px-16       4rem (64px)
    | 2xl ≥ 1536px  2xl:px-24      6rem (96px)
    |--------------------------------------------------------------------------
    | Usage: `container-page` class (see globals.css) or
    | `px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24`
    |--------------------------------------------------------------------------*/
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        md: "2rem",
        lg: "3rem",
        xl: "4rem",
        "2xl": "6rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },

    /*--------------------------------------------------------------------------
    | BREAKPOINTS
    |--------------------------------------------------------------------------*/
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1920px",
      "4xl": "2560px",
    },

    /*
    |--------------------------------------------------------------------------
    | COLORS
    |--------------------------------------------------------------------------
    |
    | Naming convention:
    |
    | primary-extra-light
    | primary-light
    | primary
    | primary-dark
    | primary-extra-dark
    |
    */

    colors: {
      transparent: "transparent",
      current: "currentColor",
      inherit: "inherit",

      white: {
        "extra-light": "#FFFFFF",
        light: "#FAFAFA",
        DEFAULT: "#F5F4F4",
        dark: "#EAE9E9",
        "extra-dark": "#D9D8D8",
      },

      black: {
        "extra-light": "#4A4A4A",
        light: "#202020",
        DEFAULT: "#020202",
        dark: "#010101",
        "extra-dark": "#000000",
      },

      primary: {
        "extra-light": "#E6EEF8",
        light: "#8FA8C8",
        DEFAULT: "#012A6C",
        dark: "#001F52",
        "extra-dark": "#001536",
      },

      gold: {
        "extra-light": "#FFF4D9",
        light: "#FFD98A",
        DEFAULT: "#FFBF43",
        dark: "#D99000",
        "extra-dark": "#8A5600",
      },

      secondary: {
        "extra-light": "#F8FAFC",
        light: "#E2E8F0",
        DEFAULT: "#64748B",
        dark: "#475569",
        "extra-dark": "#1E293B",
      },

      accent: {
        "extra-light": "#ECFEFF",
        light: "#A5F3FC",
        DEFAULT: "#06B6D4",
        dark: "#0891B2",
        "extra-dark": "#164E63",
      },

      neutral: {
        "extra-light": "#FAFAFA",
        light: "#F4F4F5",
        DEFAULT: "#71717A",
        dark: "#3F3F46",
        "extra-dark": "#18181B",
      },

      gray: {
        50: "#FAFAFA",
        100: "#F4F4F5",
        200: "#E4E4E7",
        300: "#D4D4D8",
        400: "#A1A1AA",
        500: "#71717A",
        600: "#52525B",
        700: "#3F3F46",
        800: "#27272A",
        900: "#18181B",
        950: "#09090B",
      },

      success: {
        "extra-light": "#ECFDF5",
        light: "#A7F3D0",
        DEFAULT: "#10B981",
        dark: "#059669",
        "extra-dark": "#064E3B",
      },

      warning: {
        "extra-light": "#FFFBEB",
        light: "#FDE68A",
        DEFAULT: "#F59E0B",
        dark: "#D97706",
        "extra-dark": "#78350F",
      },

      error: {
        "extra-light": "#FEF2F2",
        light: "#FECACA",
        DEFAULT: "#EF4444",
        dark: "#DC2626",
        "extra-dark": "#7F1D1D",
      },

      info: {
        "extra-light": "#EFF6FF",
        light: "#BFDBFE",
        DEFAULT: "#3B82F6",
        dark: "#2563EB",
        "extra-dark": "#1E3A8A",
      },

      surface: {
        "extra-light": "#FFFFFF",
        light: "#FAFAFA",
        DEFAULT: "#F4F4F5",
        dark: "#E4E4E7",
        "extra-dark": "#D4D4D8",
      },

      background: {
        "extra-light": "#FFFFFF",
        light: "#FAFAFA",
        DEFAULT: "#f5f4f4",
        dark: "#E4E4E7",
        "extra-dark": "#18181B",
      },

      foreground: {
        "extra-light": "#71717A",
        light: "#52525B",
        DEFAULT: "#27272A",
        dark: "#18181B",
        "extra-dark": "#09090B",
      },

      border: {
        "extra-light": "#F4F4F5",
        light: "#E4E4E7",
        DEFAULT: "#D4D4D8",
        dark: "#A1A1AA",
        "extra-dark": "#71717A",
      },
    },

    /*
    |--------------------------------------------------------------------------
    | SPACING
    |--------------------------------------------------------------------------
    |
    | 4px base grid + useful extended values.
    |
    */

    spacing: {
      0: "0px",

      px: "1px",

      "0.5": "2px",
      1: "4px",
      1.5: "6px",
      2: "8px",
      2.5: "10px",
      3: "12px",
      3.5: "14px",
      4: "16px",
      5: "20px",
      6: "24px",
      7: "28px",
      8: "32px",
      9: "36px",
      10: "40px",
      11: "44px",
      12: "48px",
      14: "56px",
      16: "64px",
      18: "72px",
      20: "80px",
      24: "96px",
      28: "112px",
      32: "128px",
      36: "144px",
      40: "160px",
      44: "176px",
      48: "192px",
      52: "208px",
      56: "224px",
      60: "240px",
      64: "256px",
      72: "288px",
      80: "320px",
      96: "384px",
    },

    /*
    |--------------------------------------------------------------------------
    | SIZING
    |--------------------------------------------------------------------------
    |
    | Semantic xs → 4xl scale.
    |
    */

    width: {
      auto: "auto",
      full: "100%",
      screen: "100vw",

      xs: "20rem",
      sm: "24rem",
      md: "28rem",
      lg: "32rem",
      xl: "36rem",
      "2xl": "42rem",
      "3xl": "48rem",
      "4xl": "56rem",
    },

    minWidth: {
      0: "0px",
      full: "100%",
      xs: "20rem",
      sm: "24rem",
      md: "28rem",
      lg: "32rem",
      xl: "36rem",
      "2xl": "42rem",
      "3xl": "48rem",
      "4xl": "56rem",
    },

    maxWidth: {
      none: "none",
      xs: "20rem",
      sm: "24rem",
      md: "28rem",
      lg: "32rem",
      xl: "36rem",
      "2xl": "42rem",
      "3xl": "48rem",
      "4xl": "56rem",
      prose: "65ch",
      screen: "100vw",
      "screen-sm": "640px",
      "screen-md": "768px",
      "screen-lg": "1024px",
      "screen-xl": "1280px",
      "screen-2xl": "1536px",
      "screen-3xl": "1920px",
      "screen-4xl": "2560px",
    },

    /*
    |--------------------------------------------------------------------------
    | TYPOGRAPHY
    |--------------------------------------------------------------------------
    |
    | Montserrat = headings
    | Open Sans = body
    |
    */

    fontFamily: {
      heading: ["Montserrat", "ui-sans-serif", "system-ui", "sans-serif"],

      body: ["Open Sans", "ui-sans-serif", "system-ui", "sans-serif"],

      sans: ["Open Sans", "ui-sans-serif", "system-ui", "sans-serif"],

      display: ["Montserrat", "ui-sans-serif", "system-ui", "sans-serif"],
    },

    fontSize: {
      /*
      |--------------------------------------------------------------------------
      | UI TEXT
      |--------------------------------------------------------------------------
      */

      button: [
        "0.875rem",
        {
          lineHeight: "1.25rem",
          fontWeight: "600",
          letterSpacing: "0em",
        },
      ],

      link: [
        "0.875rem",
        {
          lineHeight: "1.25rem",
          fontWeight: "600",
          letterSpacing: "0em",
        },
      ],

      label: [
        "0.875rem",
        {
          lineHeight: "1.25rem",
          fontWeight: "600",
          letterSpacing: "0em",
        },
      ],

      caption: [
        "0.75rem",
        {
          lineHeight: "1rem",
          fontWeight: "400",
          letterSpacing: "0em",
        },
      ],

      overline: [
        "0.75rem",
        {
          lineHeight: "1rem",
          fontWeight: "700",
          letterSpacing: "0.08em",
        },
      ],

      /*
      |--------------------------------------------------------------------------
      | HEADINGS
      |--------------------------------------------------------------------------
      */

      "header-1": [
        "4.75rem",
        {
          lineHeight: "1.1",
          fontWeight: "700",
          letterSpacing: "-0.025em",
        },
      ],

      "header-2": [
        "3rem",
        {
          lineHeight: "1.15",
          fontWeight: "700",
          letterSpacing: "-0.02em",
        },
      ],

      "header-3": [
        "2.25rem",
        {
          lineHeight: "1.2",
          fontWeight: "700",
          letterSpacing: "-0.015em",
        },
      ],

      "header-4": [
        "1.875rem",
        {
          lineHeight: "1.25",
          fontWeight: "700",
          letterSpacing: "-0.01em",
        },
      ],

      "header-5": [
        "1.5rem",
        {
          lineHeight: "1.3",
          fontWeight: "700",
          letterSpacing: "0em",
        },
      ],

      "header-6": [
        "1.25rem",
        {
          lineHeight: "1.35",
          fontWeight: "700",
          letterSpacing: "0em",
        },
      ],

      /*
      |--------------------------------------------------------------------------
      | BODY
      |--------------------------------------------------------------------------
      */

      body: [
        "1rem",
        {
          lineHeight: "1.6",
          fontWeight: "400",
          letterSpacing: "0em",
        },
      ],

      "body-lg": [
        "1.125rem",
        {
          lineHeight: "1.7",
          fontWeight: "400",
          letterSpacing: "0em",
        },
      ],

      "body-sm": [
        "0.875rem",
        {
          lineHeight: "1.5",
          fontWeight: "400",
          letterSpacing: "0em",
        },
      ],

      "body-xs": [
        "0.75rem",
        {
          lineHeight: "1.4",
          fontWeight: "400",
          letterSpacing: "0em",
        },
      ],

      /*
      |--------------------------------------------------------------------------
      | STANDARD SCALE
      |--------------------------------------------------------------------------
      */

      xs: [
        "0.75rem",
        {
          lineHeight: "1rem",
        },
      ],

      sm: [
        "0.875rem",
        {
          lineHeight: "1.25rem",
        },
      ],

      base: [
        "1rem",
        {
          lineHeight: "1.5rem",
        },
      ],

      lg: [
        "1.125rem",
        {
          lineHeight: "1.75rem",
        },
      ],

      xl: [
        "1.25rem",
        {
          lineHeight: "1.75rem",
        },
      ],

      "2xl": [
        "1.5rem",
        {
          lineHeight: "2rem",
        },
      ],

      "3xl": [
        "1.875rem",
        {
          lineHeight: "2.25rem",
        },
      ],

      "4xl": [
        "2.25rem",
        {
          lineHeight: "2.5rem",
        },
      ],

      "5xl": [
        "3rem",
        {
          lineHeight: "1",
        },
      ],

      "6xl": [
        "3.75rem",
        {
          lineHeight: "1",
        },
      ],

      "7xl": [
        "4.5rem",
        {
          lineHeight: "1",
        },
      ],

      "8xl": [
        "6rem",
        {
          lineHeight: "1",
        },
      ],

      "9xl": [
        "8rem",
        {
          lineHeight: "1",
        },
      ],
    },

    /*
    |--------------------------------------------------------------------------
    | FONT WEIGHTS
    |--------------------------------------------------------------------------
    */

    fontWeight: {
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      black: "900",
    },

    /*
    |--------------------------------------------------------------------------
    | LETTER SPACING
    |--------------------------------------------------------------------------
    */

    letterSpacing: {
      tighter: "-0.04em",
      tight: "-0.02em",
      normal: "0em",
      wide: "0.02em",
      wider: "0.04em",
      widest: "0.08em",
    },

    /*
    |--------------------------------------------------------------------------
    | BORDER RADIUS
    |--------------------------------------------------------------------------
    */

    borderRadius: {
      none: "0px",

      xs: "2px",
      sm: "4px",
      md: "6px",
      lg: "8px",
      xl: "12px",
      "2xl": "16px",
      "3xl": "24px",
      "4xl": "32px",

      full: "9999px",
    },

    /*
    |--------------------------------------------------------------------------
    | SHADOWS
    |--------------------------------------------------------------------------
    */

    boxShadow: {
      none: "none",

      xs: "0 1px 2px rgba(0, 0, 0, 0.04)",

      sm: [
        "0 1px 2px rgba(0, 0, 0, 0.04)",
        "0 2px 6px rgba(0, 0, 0, 0.04)",
      ].join(", "),

      md: [
        "0 4px 6px rgba(0, 0, 0, 0.05)",
        "0 10px 20px rgba(0, 0, 0, 0.06)",
      ].join(", "),

      lg: [
        "0 10px 20px rgba(0, 0, 0, 0.06)",
        "0 20px 40px rgba(0, 0, 0, 0.08)",
      ].join(", "),

      xl: "0 20px 50px rgba(0, 0, 0, 0.10)",

      "2xl": "0 30px 70px rgba(0, 0, 0, 0.14)",

      inner: "inset 0 2px 4px rgba(0, 0, 0, 0.05)",

      card: "0 4px 16px rgba(0, 0, 0, 0.06)",

      dropdown: "0 8px 24px rgba(0, 0, 0, 0.10)",

      modal: "0 20px 60px rgba(0, 0, 0, 0.15)",

      button: "0 2px 8px rgba(0, 0, 0, 0.08)",

      focus: "0 0 0 3px rgba(37, 99, 235, 0.20)",
    },

    /*
    |--------------------------------------------------------------------------
    | OPACITY
    |--------------------------------------------------------------------------
    */

    opacity: {
      0: "0",
      5: "0.05",
      10: "0.1",
      15: "0.15",
      20: "0.2",
      25: "0.25",
      30: "0.3",
      40: "0.4",
      50: "0.5",
      60: "0.6",
      70: "0.7",
      75: "0.75",
      80: "0.8",
      90: "0.9",
      95: "0.95",
      100: "1",
    },

    /*
    |--------------------------------------------------------------------------
    | Z-INDEX
    |--------------------------------------------------------------------------
    */

    zIndex: {
      auto: "auto",
      0: "0",
      10: "10",
      20: "20",
      30: "30",
      40: "40",
      50: "50",

      dropdown: "100",
      sticky: "200",
      overlay: "300",
      modal: "400",
      popover: "500",
      toast: "600",
      tooltip: "700",
    },

    /*
    |--------------------------------------------------------------------------
    | TRANSITIONS
    |--------------------------------------------------------------------------
    */

    transitionDuration: {
      0: "0ms",
      75: "75ms",
      100: "100ms",
      150: "150ms",
      200: "200ms",
      300: "300ms",
      500: "500ms",
      700: "700ms",
      1000: "1000ms",
    },

    transitionTimingFunction: {
      linear: "linear",
      ease: "ease",
      "ease-in": "ease-in",
      "ease-out": "ease-out",
      "ease-in-out": "ease-in-out",

      standard: "cubic-bezier(0.2, 0, 0, 1)",
      emphasized: "cubic-bezier(0.2, 0, 0, 1.2)",
    },

    /*
    |--------------------------------------------------------------------------
    | ANIMATION
    |--------------------------------------------------------------------------
    */

    keyframes: {
      "fade-in": {
        from: {
          opacity: "0",
        },
        to: {
          opacity: "1",
        },
      },

      "fade-out": {
        from: {
          opacity: "1",
        },
        to: {
          opacity: "0",
        },
      },

      "slide-up": {
        from: {
          opacity: "0",
          transform: "translateY(12px)",
        },
        to: {
          opacity: "1",
          transform: "translateY(0)",
        },
      },

      "slide-down": {
        from: {
          opacity: "0",
          transform: "translateY(-12px)",
        },
        to: {
          opacity: "1",
          transform: "translateY(0)",
        },
      },

      "scale-in": {
        from: {
          opacity: "0",
          transform: "scale(0.96)",
        },
        to: {
          opacity: "1",
          transform: "scale(1)",
        },
      },

      "accordion-down": {
        from: {
          height: "0",
        },
        to: {
          height: "var(--radix-accordion-content-height)",
        },
      },

      "accordion-up": {
        from: {
          height: "var(--radix-accordion-content-height)",
        },
        to: {
          height: "0",
        },
      },
    },

    animation: {
      "fade-in": "fade-in 200ms ease-out",
      "fade-out": "fade-out 200ms ease-in",
      "slide-up": "slide-up 300ms ease-out",
      "slide-down": "slide-down 300ms ease-out",
      "scale-in": "scale-in 200ms ease-out",

      "accordion-down": "accordion-down 200ms ease-out",
      "accordion-up": "accordion-up 200ms ease-out",
    },

    /*
    |--------------------------------------------------------------------------
    | ASPECT RATIOS
    |--------------------------------------------------------------------------
    */

    aspectRatio: {
      auto: "auto",
      square: "1 / 1",
      video: "16 / 9",
      portrait: "3 / 4",
      landscape: "4 / 3",
      wide: "21 / 9",
    },

    /*
    |--------------------------------------------------------------------------
    | BLUR
    |--------------------------------------------------------------------------
    */

    blur: {
      none: "0",
      xs: "2px",
      sm: "4px",
      md: "8px",
      lg: "12px",
      xl: "20px",
      "2xl": "32px",
      "3xl": "48px",
    },

    /*
    |--------------------------------------------------------------------------
    | BACKDROP BLUR
    |--------------------------------------------------------------------------
    */

    backdropBlur: {
      none: "0",
      xs: "2px",
      sm: "4px",
      md: "8px",
      lg: "12px",
      xl: "20px",
      "2xl": "32px",
      "3xl": "48px",
    },

    /*
    |--------------------------------------------------------------------------
    | GRADIENTS
    |--------------------------------------------------------------------------
    */

    backgroundImage: {
      "gradient-primary": "linear-gradient(135deg, #006BB6 0%, #004A80 100%)",

      "gradient-primary-soft":
        "linear-gradient(135deg, #EAF4FB 0%, #FFFFFF 100%)",

      "gradient-dark": "linear-gradient(135deg, #18181B 0%, #27272A 100%)",

      "gradient-light": "linear-gradient(135deg, #FFFFFF 0%, #F4F4F5 100%)",

      "gradient-overlay":
        "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 100%)",
    },

    /*
    |--------------------------------------------------------------------------
    | DIVIDE WIDTH
    |--------------------------------------------------------------------------
    */

    divideWidth: {
      DEFAULT: "1px",
      0: "0px",
      2: "2px",
      4: "4px",
      8: "8px",
    },

    /*
    |--------------------------------------------------------------------------
    | RING WIDTH
    |--------------------------------------------------------------------------
    */

    ringWidth: {
      DEFAULT: "3px",
      0: "0px",
      1: "1px",
      2: "2px",
      3: "3px",
      4: "4px",
      8: "8px",
    },
  },

  plugins: [],
};

export default config;
