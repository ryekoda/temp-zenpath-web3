import axios from 'axios';



export async function SaveCompanySettings(title: string, theme: string, userUID: string, baseURL: string) {
    // const url = baseURL + '/companies'
    // // const url = 'http://localhost:3002' + '/companies'

    
    // const doc = await axios.post(url, {
    //     'title': title,
    //     'admins': [userUID],
    //     'theme': theme
    // })

    // const data = doc['data'].companyUID
    // if (data) {
    //     return data
    // } else {
    //     return
    // }
}


export async function UpdateTableSettings(id: string, baseURL: string, headerUID?: any, headerTitle?: any, headerIsHidden?: any, allHeaders?: any, updatedHeaders?: any) {
    const url = baseURL + '/api/company-settings'


    const doc = await axios.put(url, {
        'id': id,
        'headerUID': headerUID, 
        'headerTitle': headerTitle, 
        'headerIsHidden': headerIsHidden,
        'allHeaders': allHeaders,
        'updatedHeaders': updatedHeaders
    })

    const data = doc['data'].tableSettings
    if (data) {
        return data
    } else {
        return
    }
}


export async function GetCompanySettings(table: string, companyUID: string, baseURL: string) {
    const url = baseURL + '/api/company-settings'


    const doc = await axios.get(url, {
        params: {
            'table': table,
            'companyUID': companyUID
        }
    })

    const data = doc['data'].companySettings
    
    if (data) {
        return data
    } else {
        return
    }
}
