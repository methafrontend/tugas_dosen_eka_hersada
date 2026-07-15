import { signal, computed } from '@angular/core';

export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

export interface PaginatedResponse<T, M = PaginationMeta> {
    data: T[];
    meta: M;
}

export interface EntityState<T, M = PaginationMeta> {
    value: T[];
    loading: boolean;
    error?: string;
    meta?: M;
}

export function ListStoreFactory<
    T extends Record<any, any>,
    M extends PaginationMeta = PaginationMeta,
    K extends keyof T = 'id'
>(keyField?: K | any) {

    const field = (keyField ?? ('id' as K));

    const _state = signal<EntityState<T, M>>({
        value: [],
        loading: false,
    });

    // ========================
    // Computed Selectors
    // ========================

    const all = computed(() => _state().value);
    const count = computed(() => _state().value.length);
    const meta = computed(() => _state().meta);
    const loading = computed(() => _state().loading);
    const error = computed(() => _state().error);

    const hasNextPage = computed(() => {
        const m = _state().meta;
        if (!m) return false;
        return m.current_page < m.last_page;
    });

    const currentPage = computed(() => _state().meta?.current_page ?? 1);

    const mapByKey = computed(() => {
        const map = new Map<T[K], T>();
        for (const item of _state().value) {
            map.set(item[field], item);
        }
        return map;
    });

    const getByKey = (key: T[K]) =>
        computed(() => mapByKey().get(key));

    // ========================
    // Private Helpers
    // ========================

    function deduplicate(items: T[]): T[] {
        const map = new Map<T[K], T>();
        for (const item of items) {
            map.set(item[field], item);
        }
        return Array.from(map.values());
    }

    function setLoading(value: boolean) {
        _state.update(s => ({ ...s, loading: value }));
    }

    function setError(message?: string) {
        _state.update(s => ({ ...s, error: message }));
    }

    // ========================
    // Public API
    // ========================

    async function loadPage(
        page: number,
        fetchFn: (page: number) => Promise<PaginatedResponse<T, M>>
    ) {
        setLoading(true);
        setError(undefined);

        try {
            const response = await fetchFn(page);

            console.log(response);
            _state.update(curr => ({
                value: page === 1
                    ? response.data
                    : deduplicate([...curr.value, ...response.data]),
                meta: response.meta,
                loading: false,
            }));

            return response;
        } catch (err: any) {
            setLoading(false);
            setError(err?.message ?? 'Unknown error');
            return null;
        }
    }

    // --- Async Loader ---
    async function load(
        page: number,
        fetchFn: (page: number) => Promise<PaginatedResponse<T, M>>
    ) {
        _state.update((curr) => ({
            ...curr,
            loading: true,
            error: undefined,
        }));
        try {
            const response = await fetchFn(page);
            // console.log('Entity Store Loaded Data:', data);
            _state.set({ value: response.data, meta: response.meta, loading: false });
            return response.data;
        } catch (err: any) {
            _state.update((curr) => ({
                ...curr,
                loading: false,
                error: err.message ?? 'Unknown error',
            }));
            return [];
        }
    }



    async function loadNextPage(
        fetchFn: (page: number) => Promise<PaginatedResponse<T, M>>
    ) {
        if (!hasNextPage() || loading()) return;

        const nextPage = currentPage() + 1;
        return loadPage(nextPage, fetchFn);
    }

    async function refresh(
        fetchFn: (page: number) => Promise<PaginatedResponse<T, M>>
    ) {
        return loadPage(1, fetchFn);
    }

    function reset() {
        _state.set({
            value: [],
            loading: false,
        });
    }

    function clear() {
        reset();
    }

    function update(key: T[K], partial: Partial<T>) {
        _state.update(curr => ({
            ...curr,
            value: curr.value.map(i =>
                i[field] === key ? { ...i, ...partial } : i
            ),
        }));
    }

    function remove(key: T[K]) {
        _state.update(curr => ({
            ...curr,
            value: curr.value.filter(i => i[field] !== key),
        }));
    }

    return {
        state: _state,

        // selectors
        all,
        count,
        meta,
        loading,
        error,
        hasNextPage,
        currentPage,
        getByKey,

        // actions
        load,
        loadPage,
        loadNextPage,
        refresh,
        update,
        remove,
        reset,
        clear,
    };
}
