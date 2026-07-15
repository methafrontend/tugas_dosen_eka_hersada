import { signal } from '@angular/core';
import { logger } from '@shared/utils/logger';

export interface SingleState<T> {
    value: T | null;
    loading: boolean;
    error?: string;
}

export function singleStoreFactory<T>() {
    const _state = signal<SingleState<T>>({ value: null, loading: false });

    return {
        state: _state,

        // Mutations
        set(value: T) {
            _state.set({ value, loading: false });
        },

        reset() {
            _state.set({ value: null, loading: false });
        },

        patch(partial: Partial<T>) {
            _state.update((curr) => ({
                ...curr,
                value: curr.value ? { ...curr.value, ...partial } : null
            }));
        },

        clear() {
            _state.set({ value: null, loading: false });
        },

        // Async Loader
        async load(fetchFn: () => Promise<T>) {
            _state.update((curr) => ({ ...curr, loading: true, error: undefined }));
            try {
                const data = await fetchFn();
                _state.set({ value: data, loading: false });
                return data;
            } catch (err: any) {
                _state.update((curr) => ({
                    ...curr,
                    loading: false,
                    error: err.message ?? 'Unknown error'
                }));
                return Promise.reject(err);
            }
        }
    };
}
