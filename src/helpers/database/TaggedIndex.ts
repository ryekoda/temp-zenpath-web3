import axios from 'axios';


// Items whose name (or, for clients, phone number) starts with `value`. `limit` caps the matches (API default 5, max 50).
export async function GetTaggedIndex(category: string, value: any, boardUID: string, baseURL: any, limit?: number) {
    const url = baseURL + '/api/tagged-index'

    
    const doc = await axios.get(url, {
        params: {
            'category': category,
            'value': value, 
            'boardUID': boardUID,
            'limit': limit
        }
    })

    const data = doc['data'].taggedIndex

    if (data) {
        return data
    } else {
        return
    }
}