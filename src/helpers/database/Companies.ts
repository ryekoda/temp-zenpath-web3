import axios from 'axios';



export async function SaveCompany(title: string, theme: { color: string, image: string }, userUID: string, baseURL: string) {
    const url = baseURL + '/api/companies'

    
    const doc = await axios.post(url, {
        'title': title,
        'admins': [userUID],
        'theme': theme
    })

    const data = doc['data'].companyUID
    if (data) {
        return data
    } else {
        return
    }
}


export async function UpdateCompany(uid: string, key: string, value: any, baseURL: string) {
    const url = baseURL + '/api/companies'
    

    const doc = await axios.put(url, {
        'uid': uid,
        'key': key, 
        'value': value
    })

    const data = doc['data'].companyUID
    if (data) {
        return data
    } else {
        return
    }
}


export async function GetCompany(companyUID: string, baseURL: string) {
    const url = baseURL + '/api/companies'

    
    const doc = await axios.get(url, {
        params: {
            'companyUID': companyUID,
            'userInfo': null
        }
    })

    const data = doc['data'].company
    
    if (data) {
        return data
    } else {
        return
    }
}


export async function GetCompanies(userUID: string, baseURL: string) {
    const url = baseURL + '/api/companies'


    const doc = await axios.get(url, {
        params: {
            'companyUID': null,
            'userUID': userUID
        }
    })

    const data = doc['data'].companies

    if (data) {
        return data
    } else {
        return
    }
}
