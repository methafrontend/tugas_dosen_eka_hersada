import { signal, computed } from '@angular/core';
import { filter } from 'rxjs';

export interface EntityState<T> {
    value: T[];
    loading: boolean;
    error?: string;
}

export function entityStoreFactory<
    T extends Record<any, any>,
    K extends keyof T = 'id'
>(keyField?: K | any) {

    // console.log('ListStoreFactory keyField:', keyField);
    const field = (keyField ?? ('id' as K));

    const _state = signal<EntityState<T>>({ value: [], loading: false });

    const mapByKey = computed(() => {
        const map = new Map<T[K], T>();
        for (const item of _state().value) {
            map.set(item[field], item);
        }
        return map;
    });

    return {
        state: _state,
        keyField: field,
        mapByKey,

        // --- Mutations ---
        setAll(value: T[]) {
            _state.set({ value, loading: false });
        },

        filtered(predicate?: (item: T) => boolean) {
            return computed(() =>
                predicate ? _state().value.filter(predicate) : _state().value
            );
        },

        add(item: T) {
            _state.update((curr) => ({
                ...curr,
                value: [...curr.value, item],
            }));
        },

        update(key: T[K], partial: Partial<T>) {
            _state.update((curr) => ({
                ...curr,
                value: curr.value.map((i) =>
                    i[field] === key ? { ...i, ...partial } : i
                ),
            }));
        },

        remove(key: T[K]) {
            _state.update((curr) => ({
                ...curr,
                value: curr.value.filter((i) => i[field] !== key),
            }));
        },

        clear() {
            _state.set({ value: [], loading: false });
        },

        // --- Selectors ---
        getByKey: (key: T[K]) => computed(() => mapByKey().get(key)),

        all: computed(() => _state().value),
        count: computed(() => _state().value.length),

        // --- Async Loader ---
        async load(fetchFn: () => Promise<T[]>) {
            _state.update((curr) => ({
                ...curr,
                loading: true,
                error: undefined,
            }));
            try {
                const data = await fetchFn();
                _state.set({ value: data, loading: false });
                return data;
            } catch (err: any) {
                _state.update((curr) => ({
                    ...curr,
                    loading: false,
                    error: err.message ?? 'Unknown error',
                }));
                return [];
            }
        },
    };
}
