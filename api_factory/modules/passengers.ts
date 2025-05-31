import { GATEWAY_ENDPOINT } from '../axios.config'

interface GetPassengersParams {
    page?: number;
    limit?: number;
    search?: string;
    startDate?: string;
    endDate?: string;
    status?: 'active' | 'inactive';
}

export const passengers_api = {
    $_get_passengers: (params: GetPassengersParams = {}) => {
        const { 
            page = 1, 
            limit = 10, 
            search, 
            startDate, 
            endDate, 
            status
        } = params;

        // Build query parameters object, only including defined values
        const queryParams: Record<string, string | number> = {
            page,
            limit
        };

        // Add optional parameters only if they exist
        if (search) queryParams.search = search;
        if (startDate) queryParams.startDate = startDate;
        if (endDate) queryParams.endDate = endDate;
        if (status) queryParams.status = status;

        // Convert to URL search params
        const searchParams = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
            searchParams.append(key, String(value));
        });

        const url = `/passengers?${searchParams.toString()}`;
        return GATEWAY_ENDPOINT.get(url);
    },
    $_get_passenger_by_id: (id: string) => {
        const url = `/passengers/${id}`
        return GATEWAY_ENDPOINT.get(url)
    }
}