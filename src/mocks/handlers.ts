
import { http, HttpResponse } from 'msw'

// Sample data for fallback
const mockCustomers = [
  { custno: 'C001', custname: 'Acme Corporation', address: '123 Business St', payterm: 'Net 30' },
  { custno: 'C002', custname: 'TechCorp Inc', address: '456 Tech Ave', payterm: 'Net 45' },
]

const mockSales = [
  { transno: 'S001', salesdate: '2025-03-15', custno: 'C001', empno: 'E001', amount: 1500 },
  { transno: 'S002', salesdate: '2025-03-28', custno: 'C002', empno: 'E002', amount: 2700 },
]

const mockPayments = [
  { orno: 'P001', paydate: '2025-03-20', transno: 'S001', amount: 1500 },
  { orno: 'P002', paydate: '2025-04-05', transno: 'S002', amount: 2000 },
]

export const handlers = [
  // These handlers will only be used if the Supabase requests fail
  http.get('*/rest/v1/customer', () => {
    return HttpResponse.json(mockCustomers)
  }),
  
  http.get('*/rest/v1/sales', () => {
    return HttpResponse.json(mockSales)
  }),
  
  http.get('*/rest/v1/payment', () => {
    return HttpResponse.json(mockPayments)
  }),
]
