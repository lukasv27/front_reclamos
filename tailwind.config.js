/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface:                    '#f9f9ff',
        'surface-dim':              '#d0daef',
        'surface-bright':           '#f9f9ff',
        'surface-variant':          '#d9e3f7',
        'surface-container-lowest': '#ffffff',
        'surface-container-low':    '#eff3ff',
        'surface-container':        '#e6eeff',
        'surface-container-high':   '#dee9fd',
        'surface-container-highest':'#d9e3f7',
        'surface-tint':             '#20619e',

        'on-surface':         '#121c2a',
        'on-surface-variant': '#414750',
        'inverse-surface':    '#273140',
        'inverse-on-surface': '#ebf1ff',

        primary:               '#1c5e9c',
        'on-primary':          '#ffffff',
        'primary-container':   '#3d77b6',
        'on-primary-container':'#fdfcff',
        'primary-fixed':       '#d2e4ff',
        'primary-fixed-dim':   '#a1c9ff',
        'on-primary-fixed':    '#001c37',
        'on-primary-fixed-variant': '#004880',
        'inverse-primary':     '#a1c9ff',

        secondary:                    '#5d5f5f',
        'on-secondary':               '#ffffff',
        'secondary-container':        '#dfe0e0',
        'on-secondary-container':     '#616363',
        'secondary-fixed':            '#e2e2e2',
        'secondary-fixed-dim':        '#c6c6c7',
        'on-secondary-fixed':         '#1a1c1c',
        'on-secondary-fixed-variant': '#454747',

        tertiary:                    '#795600',
        'on-tertiary':               '#ffffff',
        'tertiary-container':        '#986d00',
        'on-tertiary-container':     '#fffbff',
        'tertiary-fixed':            '#ffdea7',
        'tertiary-fixed-dim':        '#f5be53',
        'on-tertiary-fixed':         '#271900',
        'on-tertiary-fixed-variant': '#5e4200',

        error:               '#ba1a1a',
        'on-error':          '#ffffff',
        'error-container':   '#ffdad6',
        'on-error-container':'#93000a',

        success:      '#107c10',
        'on-success': '#ffffff',

        outline:         '#727781',
        'outline-variant':'#c1c7d1',

        background:    '#f9f9ff',
        'on-background':'#121c2a',
      },

      borderRadius: {
        DEFAULT: '0.125rem',
        lg:      '0.25rem',
        xl:      '0.5rem',
        full:    '0.75rem',
      },

      spacing: {
        xs:     '4px',
        sm:     '8px',
        base:   '8px',
        md:     '16px',
        lg:     '24px',
        xl:     '32px',
        gutter: '24px',
        margin: '32px',
      },

      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },

      fontSize: {
        h1:         ['32px', { lineHeight: '1.2', fontWeight: '600' }],
        h2:         ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        h3:         ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg':  ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-md':  ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'label-sm': ['12px', { lineHeight: '1',   fontWeight: '500', letterSpacing: '0.02em' }],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
