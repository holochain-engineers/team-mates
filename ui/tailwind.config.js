module.exports = {
  content: ['./src/**/*.{html,ts}'],
  //darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: {
        'green-mountain': "url('https://picsum.photos/id/1018/1000')"
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
