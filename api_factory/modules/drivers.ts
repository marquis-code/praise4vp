import { GATEWAY_ENDPOINT } from '../axios.config'

interface GetDriversParams {
    page?: number;
    limit?: number;
    search?: string;
    startDate?: string;
    endDate?: string;
    status?: 'active' | 'inactive';
    countryCode?: string;
}

export const drivers_api = {
    $_get_drivers: (params: GetDriversParams = {}) => {
        const { 
            page = 1, 
            limit = 10, 
            search, 
            startDate, 
            endDate, 
            status, 
            countryCode 
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
        if (countryCode) queryParams.countryCode = countryCode;

        // Convert to URL search params
        const searchParams = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
            searchParams.append(key, String(value));
        });

        const url = `/drivers?${searchParams.toString()}`;
        return GATEWAY_ENDPOINT.get(url);
    },
    $_get_driver_by_id: (id: string) => {
        const url = `/drivers/${id}`
        return GATEWAY_ENDPOINT.get(url)
    },
    $_disable_account: (id: string) => {
        const url = `/drivers/${id}/deactivate`
        return GATEWAY_ENDPOINT.patch(url)
    },
    $_enable_account: (id: string) => {
        const url = `/drivers/${id}/activate`
        return GATEWAY_ENDPOINT.patch(url)
    },
    $_verify_country_specific_documents: (driverId: string, documentCode: string, payload: Record<string, any>) => {
        const url = `/drivers/${driverId}/documents/${documentCode}/verify`
        return GATEWAY_ENDPOINT.patch(url, payload)
    }
}