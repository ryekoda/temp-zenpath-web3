import axios from 'axios';


export async function GetTaggedIndex(category: string, value: any, boardUID: string, baseURL: any) {
    const url = baseURL + '/api/tagged-index'

    
    const doc = await axios.get(url, {
        params: {
            'category': category,
            'value': value, 
            'boardUID': boardUID
        }
    })

    const data = doc['data'].taggedIndex

    if (data) {
        return data
    } else {
        return
    }
}