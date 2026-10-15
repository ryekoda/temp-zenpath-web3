import axios from 'axios';


// export async function UpdateTableSettings(id, headerUID, headerTitle, headerIsHidden, allHeaders, updatedHeaders, baseURL) {
//     const url = baseURL + '/tableSettings'


//     const doc = await axios.put(url, {
//         'id': id,
//         'headerUID': headerUID, 
//         'headerTitle': headerTitle, 
//         'headerIsHidden': headerIsHidden,
//         'allHeaders': allHeaders,
//         'updatedHeaders': updatedHeaders
//     })

//     const data = doc['data'].tableSettings
//     if (data) {
//         return data
//     } else {
//         return
//     }
// }