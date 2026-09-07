import React, { createContext, useContext, useRef, useSyncExternalStore } from 'react';

type Store<T> = {
  get: () => T
  set: (next: Partial<T> | ((prev: T) => T)) => void
  subscribe: (cb: () => void) => () => void
}

export function createLocalStorageStoreNg<T extends object>(
  defaults: T,
  storageKey: string,
) {
  let state: T = loadFromStorage()

  const listeners = new Set<() => void>()

  function loadFromStorage(): T {
    if (typeof window === 'undefined') return defaults

    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return defaults
      const parsed = JSON.parse(raw)

      function merge(def: any, val: any) {
        if (def instanceof Set) {
          // parsed stored as array -> convert to Set
          if (Array.isArray(val)) return new Set(val)
          return new Set(Array.from(def))
        }

        if (def && typeof def === 'object' && !Array.isArray(def)) {
          const out: any = { ...def }
          const keys = new Set([...Object.keys(def), ...(val && typeof val === 'object' ? Object.keys(val) : [])])
          keys.forEach((k) => {
            if (val && Object.prototype.hasOwnProperty.call(val, k)) {
              out[k] = merge(def[k], val[k])
            } else {
              out[k] = def[k]
            }
          })
          return out
        }

        // primitives or arrays: prefer parsed value when present
        return val === undefined ? def : val
      }

      return merge(defaults as any, parsed) as T
    } catch {
      return defaults
    }
  }

  function saveToStorage(next: T) {
    try {
      function serialize(v: any): any {
        if (v instanceof Set) return Array.from(v)
        if (Array.isArray(v)) return v.map(serialize)
        if (v && typeof v === 'object') {
          const o: any = {}
          Object.keys(v).forEach((k) => { o[k] = serialize(v[k]) })
          return o
        }
        return v
      }

      localStorage.setItem(storageKey, JSON.stringify(serialize(next)))
    } catch {}
  }

  const store: Store<T> = {
    get: () => state,

    set: (next) => {
      const prev = state
      const resolved =
        typeof next === 'function' ? (next as any)(prev) : { ...prev, ...next }

      if (Object.is(prev, resolved)) return

      state = resolved
      saveToStorage(state)

      listeners.forEach((l) => l())
    },

    subscribe: (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
  }

  const Context = createContext<Store<T> | null>(null)

  function Provider({ children }: { children: React.ReactNode }) {
    return <Context.Provider value={store}>{children}</Context.Provider>
  }

  function useStore() {
    const s = useContext(Context)
    if (!s) throw new Error('StoreProvider missing')

    return useSyncExternalStore(
      s.subscribe,
      s.get,
      s.get
    )
  }

  function useStoreSelector<R>(
    selector: (state: T) => R
  ) {
    const s = useContext(Context)
    if (!s) throw new Error('StoreProvider missing')

    return useSyncExternalStore(
      s.subscribe,
      () => selector(s.get()),
      () => selector(s.get())
    )
  }

  function useSetStore() {
    const s = useContext(Context)
    if (!s) throw new Error('StoreProvider missing')

    const ref = useRef(s.set)
    return ref.current
  }

  return {
    Provider,
    useStore,
    useStoreSelector,
    useSetStore,
    getStore: store.get,
    setStore: store.set,
  }
}
