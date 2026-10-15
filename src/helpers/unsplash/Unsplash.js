import axios from 'axios';




export async function SearchPhoto(searchString, baseURL) {
  const url = baseURL + '/api/unsplash'

  const doc = await axios.get(url, {
    params: {
      'term': searchString
    }
  })

  const data = doc['data'].photos
   
  if (data) {
    return data
  } else {
    return
  }
}