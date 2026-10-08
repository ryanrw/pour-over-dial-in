import { blobToDataUrl, dataUrlToBlob, getPhoto, putPhoto } from './photos'
import { isAppData } from './store'
import { normalizeData, type AppData } from './types'

/** JSON backup including photos, so moving to a new phone keeps them. */
export async function buildBackup(data: AppData): Promise<string> {
  const photos: Record<string, string> = {}
  for (const s of data.sessions) {
    if (!s.photoId) continue
    const blob = await getPhoto(s.photoId).catch(() => undefined)
    if (blob) photos[s.photoId] = await blobToDataUrl(blob)
  }
  return JSON.stringify({ ...data, photos }, null, 2)
}

/** Parse a backup file; returns null when it isn't one of ours. */
export function parseBackup(text: string): AppData | null {
  try {
    const parsed: unknown = JSON.parse(text)
    return isAppData(parsed) ? parsed : null
  } catch {
    return null
  }
}

/** Write the backup's photos to this device and return the data to keep. */
export async function restoreBackup(backup: AppData): Promise<AppData> {
  for (const [id, dataUrl] of Object.entries(backup.photos ?? {})) {
    await putPhoto(id, await dataUrlToBlob(dataUrl))
  }
  return normalizeData(backup)
}
