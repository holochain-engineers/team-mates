/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      backgroundImage: {
        'green-mountain': "url('https://picsum.photos/id/1018/1000')",
        'holo-arc': "url('./assets/holo_arc.gif')",
        'nature-hc': "url('./assets/nature-hc.jpg')",
        'web3-hc': "url('./assets/web3_hc.jpeg')",
        'river-rock': "url('https://images.pexels.com/photos/4381392/pexels-photo-4381392.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500')"
      }
    },
  },
  plugins: [],
}

