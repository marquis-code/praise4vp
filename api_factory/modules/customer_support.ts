import { GATEWAY_ENDPOINT } from '../axios.config'

export const customer_support_api = {
    $_get_tickets: (params: { startDate: string, endDate: string, page?: number, limit?: number }) => {
        const url = `/customer-support/tickets`
        return GATEWAY_ENDPOINT.get(url, { params })
    },
    $_get_ticket_by_id: (id: string) => {
        const url = `/customer-support/tickets/${id}`
        return GATEWAY_ENDPOINT.get(url)
    },
    $_update_ticket: (id: string, payload: any) => {
        const url = `/customer-support/tickets/${id}`
        return GATEWAY_ENDPOINT.patch(url, payload)
    },
    $_get_ticket_messages: (id: string) => {
        const url = `/customer-support/tickets/${id}/messages`
        return GATEWAY_ENDPOINT.get(url)
    },  
    $_send_message: (id: string, payload: any) => {
        const url = `/customer-support/tickets/${id}/messages`
        return GATEWAY_ENDPOINT.post(url, payload)
    },
}