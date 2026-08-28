import { useState, useEffect, useCallback } from 'react';

export const useRefresh = (refreshInterval = 60000) => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refresh = useCallback(async () => {
        setIsRefreshing(true);
        setRefreshKey(prev => prev + 1);
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsRefreshing(false);
    }, []);

    // Auto-refresh every interval
    useEffect(() => {
        const interval = setInterval(() => {
            refresh();
        }, refreshInterval);
        return () => clearInterval(interval);
    }, [refreshInterval, refresh]);

    return { refreshKey, refresh, isRefreshing };
};

export default useRefresh;
