import { v1 } from "uuid";



export function Reload(setRefreshUID: any) {
    const uid = v1()
    setRefreshUID(uid)
}