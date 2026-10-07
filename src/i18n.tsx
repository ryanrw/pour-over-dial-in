import { createContext, useContext, type ReactNode } from 'react'
import type { ScoreKey } from './types'

export type Lang = 'en' | 'th'

export const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'th', label: 'ไทย' },
]

export const en = {
  appName: 'Pour-over Dial-in',
  tagline: 'Log every brew and change one variable at a time until you nail the cup.',
  welcomeStart: 'Start with the coffee you’re about to brew.',
  startDialIn: 'Start dialing in',
  haveBackup: 'Have a backup file? Import it',
  invalidFile: 'Invalid file',

  coffees: 'Coffees',
  newCoffee: 'New coffee',
  editCoffee: 'Edit coffee',
  deleteCoffee: 'Delete coffee',
  confirmDeleteCoffee: (coffee: string, n: number) =>
    `Delete "${coffee}" and all ${n} ${n === 1 ? 'note' : 'notes'}?`,
  brews: (n: number) => `${n} ${n === 1 ? 'brew' : 'brews'}`,
  storageNote: 'Data stays on this device · back it up to a file',
  confirmImport: (sessions: number, drips: number) =>
    `Import ${sessions} coffees / ${drips} notes? Your current data will be replaced.`,
  addToHome: 'Add to Home Screen',
  close: 'Close',
  save: 'Save',
  edit: 'Edit',
  delete: 'Delete',
  language: 'Language',

  coffee: 'Coffee',
  coffeePlaceholder: 'e.g. Ethiopia Guji Natural',
  dripper: 'Dripper',
  dripperPlaceholder: 'e.g. V60 02',
  grinder: 'Grinder',
  grinderPlaceholder: 'e.g. Comandante C40',
  waterTds: 'Water TDS',
  tdsPlaceholder: 'e.g. 80',

  newNote: 'New note',
  editNote: 'Edit note',
  confirmDeleteNote: 'Delete this note?',
  noNotes: 'No notes yet. Tap New note to log your first brew.',
  useAsBase: 'Use as the base for a new note',
  lastTimeAdjust: 'Last time you planned to',

  dose: 'Dose',
  ratio: 'Ratio',
  water: 'Water',
  useComputedWater: (g: number) => `Use ${g} g (dose × ratio)`,
  grind: 'Grind',
  temp: 'Temp',
  finishTime: 'Finish time',
  recipe: 'Recipe',
  recipePlaceholder: 'e.g. bloom 40g 45s, then 3 pours of 70g',
  evaluation: 'How was it?',
  comment: 'Comment',
  commentPlaceholder: 'How did it taste?',
  adjustment: 'Next adjustment',
  adjustmentPlaceholder: 'What will you change next time?',
  dry: 'Dry',
  yes: 'Yes',
  no: 'No',

  chip: { dose: 'dose', ratio: 'ratio', water: 'water', grind: 'grind', temp: 'temp', time: 'time' },
  scores: {
    sweetness: 'Sweetness',
    acidity: 'Acidity',
    aroma: 'Aroma',
    body: 'Body',
    bitterness: 'Bitterness',
  } satisfies Record<ScoreKey, string>,
  scoresShort: {
    sweetness: 'Sweet',
    acidity: 'Acid',
    aroma: 'Aroma',
    body: 'Body',
    bitterness: 'Bitter',
  } satisfies Record<ScoreKey, string>,

  install: {
    title: 'Add to Home Screen',
    pitch: 'Open it straight from your home screen, full screen like an app.',
    later: 'Later',
    install: 'Install',
    gotIt: 'Got it',
    iosShare: (b: (s: string) => ReactNode) => <>Tap {b('Share')} in Safari</>,
    iosShareHint: 'Don’t see it? Tap ⋯ first',
    iosAdd: (b: (s: string) => ReactNode) => <>Choose {b('Add to Home Screen')}</>,
    iosAddHint: 'You may need to scroll down',
    iosConfirmIcon: 'Add',
    iosConfirm: (b: (s: string) => ReactNode) => <>Tap {b('Add')} in the top corner</>,
    androidMenu: (b: (s: string) => ReactNode) => <>Open the browser menu {b('⋮')}</>,
    androidAdd: (b: (s: string) => ReactNode) => (
      <>
        Choose {b('Install app')} or {b('Add to Home screen')}
      </>
    ),
  },
}

export type Dict = typeof en

const th: Dict = {
  appName: 'Pour-over Dial-in',
  tagline: 'จดทุกครั้งที่ดริป แล้วปรับทีละตัวแปรจนได้แก้วที่ใช่',
  welcomeStart: 'เริ่มจากกาแฟที่กำลังจะชงตัวแรก',
  startDialIn: 'เริ่ม dial-in',
  haveBackup: 'มีไฟล์สำรองอยู่แล้ว? นำเข้าข้อมูล',
  invalidFile: 'ไฟล์ไม่ถูกต้อง',

  coffees: 'รายการกาแฟ',
  newCoffee: 'กาแฟตัวใหม่',
  editCoffee: 'แก้ไขกาแฟ',
  deleteCoffee: 'ลบกาแฟ',
  confirmDeleteCoffee: (coffee, n) => `ลบ "${coffee}" และโน้ตทั้งหมด ${n} ครั้ง?`,
  brews: (n) => `${n} ครั้ง`,
  storageNote: 'ข้อมูลเก็บไว้ในเครื่องนี้ · สำรองไว้เป็นไฟล์ได้',
  confirmImport: (sessions, drips) =>
    `นำเข้า ${sessions} กาแฟ / ${drips} โน้ต? ข้อมูลปัจจุบันจะถูกแทนที่`,
  addToHome: 'เพิ่มลงหน้าโฮม',
  close: 'ปิด',
  save: 'บันทึก',
  edit: 'แก้ไข',
  delete: 'ลบ',
  language: 'ภาษา',

  coffee: 'กาแฟที่ใช้',
  coffeePlaceholder: 'เช่น Ethiopia Guji Natural',
  dripper: 'ดริปเปอร์',
  dripperPlaceholder: 'เช่น V60 02',
  grinder: 'Grinder',
  grinderPlaceholder: 'เช่น Comandante C40',
  waterTds: 'TDS น้ำ',
  tdsPlaceholder: 'เช่น 80',

  newNote: 'New note',
  editNote: 'แก้ไขโน้ต',
  confirmDeleteNote: 'ลบโน้ตนี้?',
  noNotes: 'ยังไม่มีโน้ต กด New note เพื่อจดการดริปครั้งแรก',
  useAsBase: 'ใช้เป็นฐานของโน้ตใหม่',
  lastTimeAdjust: 'รอบที่แล้วบอกว่าจะปรับ',

  dose: 'กาแฟ',
  ratio: 'อัตราส่วน',
  water: 'น้ำ',
  useComputedWater: (g) => `ใช้ ${g} g (กาแฟ × อัตราส่วน)`,
  grind: 'เบอร์บด',
  temp: 'อุณหภูมิ',
  finishTime: 'เวลาจบ',
  recipe: 'วิธีชง',
  recipePlaceholder: 'เช่น bloom 40g 45s, pour 3 รอบ ๆ ละ 70g',
  evaluation: 'ประเมินรอบนี้',
  comment: 'Comment',
  commentPlaceholder: 'รสชาติเป็นยังไง',
  adjustment: 'แนวทางปรับ',
  adjustmentPlaceholder: 'รอบหน้าจะลองเปลี่ยนอะไร',
  dry: 'Dry',
  yes: 'Yes',
  no: 'No',

  chip: { dose: 'กาแฟ', ratio: 'ratio', water: 'น้ำ', grind: 'บด', temp: 'temp', time: 'เวลา' },
  scores: {
    sweetness: 'หวาน',
    acidity: 'เปรี้ยว',
    aroma: 'กลิ่น',
    body: 'บอดี้',
    bitterness: 'ขม',
  },
  scoresShort: {
    sweetness: 'หวาน',
    acidity: 'เปรี้ยว',
    aroma: 'กลิ่น',
    body: 'บอดี้',
    bitterness: 'ขม',
  },

  install: {
    title: 'เพิ่มลงหน้าโฮม',
    pitch: 'เปิดจากหน้าโฮมได้ทันที เต็มจอเหมือนแอป ไม่ต้องพิมพ์ลิงก์',
    later: 'ไว้ทีหลัง',
    install: 'ติดตั้ง',
    gotIt: 'เข้าใจแล้ว',
    iosShare: (b) => <>แตะปุ่ม {b('แชร์')} ใน Safari</>,
    iosShareHint: 'ถ้าไม่เห็น ให้แตะ ⋯ ก่อน',
    iosAdd: (b) => <>เลือก {b('เพิ่มไปยังหน้าจอโฮม')}</>,
    iosAddHint: 'Add to Home Screen · อาจต้องเลื่อนลงไปหา',
    iosConfirmIcon: 'เพิ่ม',
    iosConfirm: (b) => <>แตะ {b('เพิ่ม')} มุมขวาบน</>,
    androidMenu: (b) => <>แตะเมนู {b('⋮')} ของเบราว์เซอร์</>,
    androidAdd: (b) => (
      <>
        เลือก {b('ติดตั้งแอป')} หรือ {b('เพิ่มลงในหน้าจอหลัก')}
      </>
    ),
  },
}

export const dicts: Record<Lang, Dict> = { en, th }
export const LOCALES: Record<Lang, string> = { en: 'en-US', th: 'th-TH' }

export interface I18n {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Dict
  /** English labels, used as a secondary hint next to Thai ones */
  en: Dict
  formatDateTime: (ts: number) => string
  formatDay: (ts: number) => string
}

export const I18nContext = createContext<I18n | null>(null)

export function useI18n(): I18n {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider')
  return ctx
}
