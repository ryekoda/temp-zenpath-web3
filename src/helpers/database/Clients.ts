import axios from 'axios';



export async function SaveClient(item: any, companyUID: string, baseURL: string) {
    const url = baseURL + '/api/clients'


    const doc = await axios.post(url, {
        'item': item,
        'companyUID': companyUID
    })

    const data = doc['data'].clientUID
    if (data) {
        return data
    } else {
        return
    }
}


export async function UpdateClient(itemUID: string, item: any, baseURL: string) {
    const url = baseURL + '/api/clients'


    const doc = await axios.put(url, {
        'uid': itemUID,
        'item': item
    })

    // const data = doc['data'].clientUID
    const data = doc['data'].client
    if (data) {        
        return data
    } else {
        return
    }
}


export async function GetClients(uids: string[], companyUID: string, lastDoc: any, includeRecentlyDeleted: boolean, baseURL: string) {
    const page = await GetClientsPage(uids, companyUID, lastDoc, includeRecentlyDeleted, baseURL)
    return page?.clients
}


// One page of the company's clients plus the cursor for the next page (null when there are no more).
// The API returns the cursor next to the list, not on each client.
export async function GetClientsPage(uids: string[], companyUID: string, lastDoc: any, includeRecentlyDeleted: boolean, baseURL: string) {
    const url = baseURL + '/api/clients'

    
    const doc = await axios.get(url, {
        params: {
            'uids': JSON.stringify(uids),
            'companyUID': companyUID,
            'lastDoc': lastDoc ? JSON.stringify(lastDoc) : undefined,
            'includeRecentlyDeleted': includeRecentlyDeleted
        }
    })

    const data = doc['data'].clients

    if (data) {
        return { clients: data, lastDoc: doc['data'].lastDoc ?? null }
    } else {
        return
    }
}


export async function DeleteClient(itemUID: string, companyUID: string, baseURL: string) {
    const url = baseURL + '/api/clients'


    const doc = await axios.delete(url, {
        params: {
            'uid': itemUID,
            'companyUID': companyUID
        }
    })

    return
}