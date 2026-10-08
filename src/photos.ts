import { useEffect, useState } from 'react'

// Photos live in IndexedDB: localStorage only holds ~5 MB, a handful of photos.
const DB_NAME = 'pour-over-dial-in'
const STORE = 'photos'
const MAX_SIDE = 1200
const JPEG_QUALITY = 0.8

let dbPromise: Promise<IDBDatabase> | null = null

function db(): Promise<IDBDatabase> {
  dbPromise ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  return dbPromise
}

async function run<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const tx = (await db()).transaction(STORE, mode)
  const req = fn(tx.objectStore(STORE))
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(req.result)
    tx.onerror = () => reject(tx.error)
  })
}

export const getPhoto = (id: string) => run<Blob | undefined>('readonly', (s) => s.get(id))
export const putPhoto = (id: string, blob: Blob) => run('readwrite', (s) => s.put(blob, id))

/** Delete photos no coffee points to any more (replaced, removed, or coffee deleted). */
export async function prunePhotos(keep: Set<string>) {
  const keys = await run('readonly', (s) => s.getAllKeys())
  const stale = keys.filter((k) => !keep.has(String(k)))
  if (stale.length) {
    await run('readwrite', (s) => {
      stale.forEach((k) => s.delete(k))
      return s.count()
    })
  }
  stale.forEach((k) => {
    const url = urlCache.get(String(k))
    if (url) URL.revokeObjectURL(url)
    urlCache.delete(String(k))
  })
}

/** Downscale and re-encode a camera photo so it stays around 100–300 KB. */
export async function resizeImage(file: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('encode failed'))), 'image/jpeg', JPEG_QUALITY),
  )
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

export const dataUrlToBlob = async (dataUrl: string) => (await fetch(dataUrl)).blob()

const urlCache = new Map<string, string>()

/** Object URL for a stored photo, shared between every place that shows it. */
export function usePhotoUrl(id: string | null): string | null {
  const [loaded, setLoaded] = useState<{ id: string; url: string } | null>(null)
  const cached = id ? urlCache.get(id) : undefined

  useEffect(() => {
    if (!id || urlCache.has(id)) return
    let cancelled = false
    getPhoto(id)
      .then((blob) => {
        if (cancelled || !blob) return
        const url = urlCache.get(id) ?? URL.createObjectURL(blob)
        urlCache.set(id, url)
        setLoaded({ id, url })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [id])

  if (!id) return null
  return cached ?? (loaded?.id === id ? loaded.url : null)
}
