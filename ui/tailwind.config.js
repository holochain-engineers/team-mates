module.exports = {
  content: ['./src/**/*.{html,ts}'],
  //darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: {
        'green-mountain': "url('https://picsum.photos/id/1018/1000')",
        'river-rock': "url('https://images.pexels.com/photos/4381392/pexels-photo-4381392.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500')"
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
