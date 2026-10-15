// Employee fields the search looks at (current column uid, then the name older employees used)
const POSITION = ['45566', 'position']
const PHONE = ['23800', 'phone']

const firstValue = (employee: any, fields: string[]) => fields.map((field) => employee[field]).find(Boolean)

// Lowercase, commas/periods as spaces, single spaces: 'Smith,  John' -> 'smith john'
const normalize = (text: any) => String(text ?? '').toLowerCase().replace(/[,.]+/g, ' ').replace(/\s+/g, ' ').trim()

// Employees matching what was typed into the search box, in their original order. Matches anywhere in
// the name (either order, so 'smith, john' works), the position (its stored value or the title the
// list shows) or, when the search has 3+ digits, the phone number with its punctuation ignored.
export function FilterEmployees(employees: any[], query: string, companySettings: any): any[] {
    const search = normalize(query)
    if (!search) return employees

    const digits = query.replace(/\D/g, '')
    const isPhoneSearch = /^[\d\s()+.-]+$/.test(query.trim()) && digits.length >= 3
    const positionHeader = companySettings?.headers?.find((header: any) => header.uid === POSITION[0])
    const positionTitle = (value: any) => positionHeader?.options?.dropDown?.find((option: any) => option.value === value)?.title

    return employees.filter((employee) => {
        if (isPhoneSearch) {
            return String(firstValue(employee, PHONE) ?? '').replace(/\D/g, '').includes(digits)
        }

        const fName = normalize(employee.fName)
        const lName = normalize(employee.lName)
        const position = firstValue(employee, POSITION)
        const searchable = [`${fName} ${lName}`, `${lName} ${fName}`, normalize(position), normalize(positionTitle(position))]

        return searchable.some((text) => text.includes(search))
    })
}
