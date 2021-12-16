module.exports = {
  mode: 'jit',
  purge: {
    enabled: true,
    content: ['./src/**/*.{html,ts}'],
    transform: {
      md: (content) => {
        return remark().process(content)
      }
    }
  },
  darkMode: false, // or 'media' or 'class'
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
