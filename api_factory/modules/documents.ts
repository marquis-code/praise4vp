import { GATEWAY_ENDPOINT } from '../axios.config'

export const country_documents_api = {
    $_create_document_requirement: (payload: {
        countryCode: string
        documentCode: string
        name: string
        required: boolean
    }) => {
        const url = `/documents`
        return GATEWAY_ENDPOINT.post(url, payload)
    },

    $_get_all_country_document_requirements: (params?: { 
        page?: number
        limit?: number
        countryCode?: string
        documentCode?: string
    }) => {
        const url = `/documents`
        return GATEWAY_ENDPOINT.get(url, { params })
    },

    $_get_document_by_id: (id: string) => {
        const url = `/documents/${id}`
        return GATEWAY_ENDPOINT.get(url)
    },

    $_update_document_requirement: (id: string, payload: Partial<{
        countryCode: string
        documentCode: string
        name: string
        required: boolean
    }>) => {
        const url = `/documents/${id}`
        return GATEWAY_ENDPOINT.patch(url, payload)
    },

    $_delete_document_requirement: (id: string) => {
        const url = `/documents/${id}`
        return GATEWAY_ENDPOINT.delete(url)
    }
}