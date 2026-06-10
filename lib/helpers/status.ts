export function computeStatus(stocks: number): 'in_stock' | 'low_stock' | 'out_of_stock' {
    if (stocks <= 0)  return 'out_of_stock'
    if (stocks <= 10) return 'low_stock'
    return 'in_stock'
}
