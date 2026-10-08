import { QueryCache, QueryClient } from '@tanstack/react-query'

const CACHE_STALE_TIME = 5 * 60 * 1000
const CACHE_GC_TIME = 30 * 60 * 1000
const TAB_ID = crypto.randomUUID()

type CachedQuery = {
  queryKey: readonly unknown[]
  data: unknown
  dataUpdatedAt: number
}

type CacheMessage =
  | { type: 'request'; tabId: string }
  | { type: 'hydrate'; tabId: string; queries: CachedQuery[] }
  | { type: 'update'; tabId: string; query: CachedQuery }

const CACHE_STORAGE_KEY = 'boxes.query-cache.v1'
const cacheChannel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel('boxes.query-cache')
let applyingRemoteUpdate = false

function publishCacheUpdate(query: CachedQuery) {
  if (applyingRemoteUpdate) return

  persistCache()
  cacheChannel?.postMessage({ type: 'update', tabId: TAB_ID, query } satisfies CacheMessage)
}

function persistCache() {
  if (typeof localStorage === 'undefined') return

  try {
    const snapshot = JSON.stringify({ queries: cachedQueries(), savedAt: Date.now() })
    localStorage.setItem(CACHE_STORAGE_KEY, snapshot)
  } catch {
    localStorage.removeItem(CACHE_STORAGE_KEY)
  }
}

function restoreCache() {
  if (typeof localStorage === 'undefined') return

  const raw = localStorage.getItem(CACHE_STORAGE_KEY)
  if (!raw) return

  let persisted: { queries?: CachedQuery[]; savedAt?: number }
  try {
    persisted = JSON.parse(raw) as { queries?: CachedQuery[]; savedAt?: number }
  } catch {
    localStorage.removeItem(CACHE_STORAGE_KEY)
    return
  }

  if (!persisted.savedAt || Date.now() - persisted.savedAt > CACHE_GC_TIME) {
    localStorage.removeItem(CACHE_STORAGE_KEY)
    return
  }

  applyingRemoteUpdate = true
  try {
    persisted.queries?.forEach((entry) => {
      if (Date.now() - entry.dataUpdatedAt <= CACHE_GC_TIME) writeCachedQuery(entry)
    })
  } finally {
    applyingRemoteUpdate = false
  }
}

function cachedQueries(): CachedQuery[] {
  return queryClient
    .getQueryCache()
    .findAll()
    .flatMap((query) => {
      if (query.state.status !== 'success' || query.state.data === undefined) return []

      return [
        {
          queryKey: query.queryKey,
          data: query.state.data,
          dataUpdatedAt: query.state.dataUpdatedAt,
        },
      ]
    })
}

function writeCachedQuery(entry: CachedQuery) {
  queryClient.setQueryData(entry.queryKey, entry.data, { updatedAt: entry.dataUpdatedAt })
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onSuccess: (data, query) => {
      publishCacheUpdate({
        queryKey: query.queryKey,
        data,
        dataUpdatedAt: query.state.dataUpdatedAt,
      })
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: CACHE_STALE_TIME,
      gcTime: CACHE_GC_TIME,
      refetchOnWindowFocus: false,
    },
  },
})

restoreCache()

if (cacheChannel) {
  cacheChannel.onmessage = (event: MessageEvent<CacheMessage>) => {
    const message = event.data
    if (!message || message.tabId === TAB_ID) return

    if (message.type === 'request') {
      cacheChannel.postMessage({ type: 'hydrate', tabId: TAB_ID, queries: cachedQueries() } satisfies CacheMessage)
      return
    }

    applyingRemoteUpdate = true
    try {
      if (message.type === 'hydrate') {
        message.queries.forEach(writeCachedQuery)
      } else {
        writeCachedQuery(message.query)
      }
    } finally {
      applyingRemoteUpdate = false
    }

    persistCache()
  }

  cacheChannel.postMessage({ type: 'request', tabId: TAB_ID } satisfies CacheMessage)
}
