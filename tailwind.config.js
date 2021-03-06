module.exports = {
  purge: {
    enabled: true,
    content: [
      './public/*.html',
      './src/**/*.vue'
    ]
  },
  theme: {
    screens: {
      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      xxl: '1560px'
    }
  }
}
