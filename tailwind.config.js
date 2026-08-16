/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          elevated: 'rgb(var(--color-surface-elevated) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
          strong: 'rgb(var(--color-border-strong) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--color-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
        },
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        element: {
          DEFAULT: 'rgb(var(--color-element) / <alpha-value>)',
          border: 'rgb(var(--color-element-border) / <alpha-value>)',
        },
        comparing: "rgb(var(--color-comparing) / <alpha-value>)",
        swapping: "rgb(var(--color-swapping) / <alpha-value>)",
        sorted: "rgb(var(--color-sorted) / <alpha-value>)",
        pivot: "rgb(var(--color-pivot) / <alpha-value>)",
        frontier: "rgb(var(--color-frontier) / <alpha-value>)",
        visited: "rgb(var(--color-visited) / <alpha-value>)",

        // text on algorithm state backgrounds
        comparingText: "rgb(var(--color-comparing-text) / <alpha-value>)",
        swappingText: "rgb(var(--color-swapping-text) / <alpha-value>)",
        sortedText: "rgb(var(--color-sorted-text) / <alpha-value>)",
        pivotText: "rgb(var(--color-pivot-text) / <alpha-value>)",
        frontierText: "rgb(var(--color-frontier-text) / <alpha-value>)",
        visitedText: "rgb(var(--color-visited-text) / <alpha-value>)",

        // text on algorithm state backgrounds (kebab-case)
        'comparing-text': "rgb(var(--color-comparing-text) / <alpha-value>)",
        'swapping-text': "rgb(var(--color-swapping-text) / <alpha-value>)",
        'sorted-text': "rgb(var(--color-sorted-text) / <alpha-value>)",
        'pivot-text': "rgb(var(--color-pivot-text) / <alpha-value>)",
        'frontier-text': "rgb(var(--color-frontier-text) / <alpha-value>)",
        'visited-text': "rgb(var(--color-visited-text) / <alpha-value>)",
      },
      height: {
        '1p': '1%',
        '2p': '2%',
        '3p': '3%',
        '5p': '5%',
        '10p': '10%',
        '20p': '20%',
        '30p': '30%',
        '40p': '40%',
        '50p': '50%',
        '60p': '60%',
        '70p': '70%',
        '80p': '80%',
        '90p': '90%',
        '100p': '100%',
      },
      spacing: (() => {
        let spacingValues = {};
        let basePixelValue = 128; // Starting base value for pixels
        let basePercentageValue = 2; // Starting base value for percentages
        let numberOfValues = 10; // Number of values to generate
        let numberOfValues2 = 50;
        let pixelStep = 2; // Difference between each pixel value
        let percentageStep = 2; // Difference between each percentage value

        // Generate pixel-based values
        for (let i = 0; i < numberOfValues; i++) {
          spacingValues[`${basePixelValue + i * pixelStep}`] = `${32 + i * pixelStep}px`;
        }

        // Generate percentage-based values
        for (let i = 0; i <= numberOfValues2; i++) {
          spacingValues[`${basePercentageValue + i * percentageStep}p`] = `${2 + i * percentageStep}%`;
        }

        return spacingValues;
      })(),
      '1px': '1px',
      '2px': '2px',
      '3px': '3px',
      '4px': '4px',
      '5px': '5px',
      '6px': '6px',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
    },
    animation: {
      fadeIn: 'fadeIn 0.5s ease-in-out',
    },
  },
  plugins: [],
}

