import { GATEWAY_ENDPOINT } from "../axios.config"

interface GetTripsParams {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    isPrivate?: boolean;
    isScheduled?: boolean;
    startDate?: string;
    endDate?: string;
}

interface GetTripHistoryParams {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    isPrivate?: boolean;
    isScheduled?: boolean;
    startDate?: string;
    endDate?: string;
}

export const trips_api = {
    $_fetch_trips: (params: GetTripsParams = {}) => {
        const { 
            page = 1, 
            limit = 10, 
            status, 
            type, 
            isPrivate, 
            isScheduled, 
            startDate, 
            endDate 
        } = params;

        // Build query parameters object, only including defined values
        const queryParams: Record<string, string | number | boolean> = {
            page,
            limit
        };

        // Add optional parameters only if they exist
        if (status) queryParams.status = status;
        if (type) queryParams.type = type;
        if (isPrivate !== undefined) queryParams.isPrivate = isPrivate;
        if (isScheduled !== undefined) queryParams.isScheduled = isScheduled;
        if (startDate) queryParams.startDate = startDate;
        if (endDate) queryParams.endDate = endDate;

        // Convert to URL search params
        const searchParams = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
            searchParams.append(key, String(value));
        });

        const url = `/trips?${searchParams.toString()}`;
        return GATEWAY_ENDPOINT.get(url);
    },
    $_fetch_trip_by_id: (id: string) => {
        const url = `/trips/${id}`
        return GATEWAY_ENDPOINT.get(url)
    },
    $_fetch_driver_trip_history: (id: string, params: GetTripHistoryParams = {}) => {
        const { 
            page = 1, 
            limit = 10, 
            status, 
            type, 
            isPrivate, 
            isScheduled, 
            startDate, 
            endDate 
        } = params;

        // Build query parameters object, only including defined values
        const queryParams: Record<string, string | number | boolean> = {
            page,
            limit
        };

        // Add optional parameters only if they exist
        if (status) queryParams.status = status;
        if (type) queryParams.type = type;
        if (isPrivate !== undefined) queryParams.isPrivate = isPrivate;
        if (isScheduled !== undefined) queryParams.isScheduled = isScheduled;
        if (startDate) queryParams.startDate = startDate;
        if (endDate) queryParams.endDate = endDate;

        // Convert to URL search params
        const searchParams = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
            searchParams.append(key, String(value));
        });

        const url = `/trips/drivers/${id}?${searchParams.toString()}`;
        return GATEWAY_ENDPOINT.get(url);
    },
    $_fetch_passenger_trip_history: (id: string, params: GetTripHistoryParams = {}) => {
        const { 
            page = 1, 
            limit = 10, 
            status, 
            type, 
            isPrivate, 
            isScheduled, 
            startDate, 
            endDate 
        } = params;

        // Build query parameters object, only including defined values
        const queryParams: Record<string, string | number | boolean> = {
            page,
            limit
        };

        // Add optional parameters only if they exist
        if (status) queryParams.status = status;
        if (type) queryParams.type = type;
        if (isPrivate !== undefined) queryParams.isPrivate = isPrivate;
        if (isScheduled !== undefined) queryParams.isScheduled = isScheduled;
        if (startDate) queryParams.startDate = startDate;
        if (endDate) queryParams.endDate = endDate;

        // Convert to URL search params
        const searchParams = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
            searchParams.append(key, String(value));
        });

        const url = `/trips/passengers/${id}?${searchParams.toString()}`;
        return GATEWAY_ENDPOINT.get(url);
    },
    $_cancel_trip: (id: string) => {
        const url = `/trips/${id}/cancel-trip`
        return GATEWAY_ENDPOINT.get(url)
    },
    $_reschedule_trip: (id: string) => {
        const url = `/trips/${id}/reschedule-trip`
        return GATEWAY_ENDPOINT.patch(url)
    },
}