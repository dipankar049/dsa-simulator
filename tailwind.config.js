/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
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
  },
  plugins: [],
}

