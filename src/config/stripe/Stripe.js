
// export const stripeConfig = {
//     test: process.env.REACT_APP_STRIPE_TEST_ACCESS_TOKEN,
//     live: process.env.REACT_APP_STRIPE_ACCESS_TOKEN
//   }


  export const stripeConfig = {
    test: `${process.env.REACT_APP_STRIPE_TEST_ACCESS_TOKEN}`,
    live: `${process.env.REACT_APP_STRIPE_ACCESS_TOKEN}`
  }
  