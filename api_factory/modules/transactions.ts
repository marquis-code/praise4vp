import { GATEWAY_ENDPOINT } from '../axios.config'

interface GetTransactionsParams {
    page?: number;
    limit?: number
}

export const transactions_api = {
    $_get_transactions: (params: GetTransactionsParams = {}) => {
        const { 
            page = 1, 
            limit = 10,
        } = params;

        // Build query parameters object, only including defined values
        const queryParams: Record<string, string | number> = {
            page,
            limit
        };
        // Convert to URL search params
        const searchParams = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
            searchParams.append(key, String(value));
        });

        const url = `/transactions?${searchParams.toString()}`;
        return GATEWAY_ENDPOINT.get(url);
    },
    $_get_user_transactions_history: (id: any, params: GetTransactionsParams = {}) => {
        const { 
            page = 1, 
            limit = 10,
        } = params;

        // Build query parameters object, only including defined values
        const queryParams: Record<string, string | number> = {
            page,
            limit
        };
        // Convert to URL search params
        const searchParams = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
            searchParams.append(key, String(value));
        });

        const url = `/transactions/${id}?${searchParams.toString()}`;
        return GATEWAY_ENDPOINT.get(url);
    }
}