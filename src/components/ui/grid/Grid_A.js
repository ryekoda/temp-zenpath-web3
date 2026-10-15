

// export function CellTapped(item, setSelectedItem) {
//   setSelectedItem(item)
// }

export function calculateCellPadding(name, currentItem, items) {
  let cellPadding = '20px 0px 20px 0px'
  let index = 0

  for (let i = 0; i < items.length; i++) {
    const item = items[i]

    if (item === currentItem) {
      index = i
    }
  }

  if (name === 'theme' && index > 3) {
    cellPadding = '16px 0px 16px 0px'
  }

  return cellPadding
}
