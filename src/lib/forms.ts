// Turning form fields into the data saved to the database.

export function GenerateFormData(fields: any[]) {
  let data: any = {}

  for (let i = 0; i < fields.length; i++) {
    var field = fields[i]

    if (field.type === 'phone' && field.value) {
      // Store digits only; the list formats them for display
      data[field.name] = field.value.replace(/[^a-zA-Z0-9]/g, '')
    } else if (field.value) {
      // An empty date stays unset rather than becoming today (a blank date of birth isn't today)
      data[field.name] = field.value
    }
  }

  return data
}
