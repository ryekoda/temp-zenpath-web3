/** @type {import('next').NextConfig} */
// const nextConfig = {}

const nextConfig = {
    mode: 'universal',
    env: {
        test: process.env.REACT_APP_STRIPE_TEST_ACCESS_TOKEN,
        live: process.env.REACT_APP_STRIPE_ACCESS_TOKEN
    },
}

module.exports = nextConfig
