const baseURLs: any = {
    db: {
        'url': 'https://backend-n4cp.onrender.com',
        'testURL': 'http://localhost:5001'
    },
    stripe: {
        'url': 'https://backend-n4cp.onrender.com',
        'testURL': 'http://localhost:5001'
    }
}


export default function GetBaseURL(name: string, isLive: boolean): string {
    return isLive ? baseURLs[name].url : baseURLs[name].testURL
}