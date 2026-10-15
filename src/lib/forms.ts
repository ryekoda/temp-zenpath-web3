// Turning form fields into the data saved to the database.

export function GenerateFormData(fields: any[]) {
  let data: any = {}

  for (let i = 0; i < fields.length; i++) {
    var field = fields[i]

    if (field.type === 'date' && !field.value) {
      data[field.name] = new Date()
    }

    if (field.type === 'phone' && field.value) {
      data[field.name] = field.value.replace(/[^a-zA-Z0-9]/g, '')
    }

    if (field.value) {
      data[field.name] = field.value
    }
  }

  return data
}
