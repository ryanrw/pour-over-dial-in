import { useMemo, useState } from 'react'
import { DripForm } from './components/DripForm'
import { DripperIcon, MenuIcon } from './components/Icons'
import { Modal } from './components/Modal'
import { SessionForm } from './components/SessionForm'
import { SessionView } from './components/SessionView'
import { Sidebar } from './components/Sidebar'
import { isAppData, sortSessions, useAppData } from './store'
import { emptyScores, type AppData, type Drip, type DripInput, type Session, type SessionInput } from './types'

type SessionEditor = { mode: 'new' } | { mode: 'edit'; session: Session }
type DripEditor = { mode: 'new'; initial: DripInput; previousAdjustment?: string } | { mode: 'edit'; drip: Drip }

const DEFAULT_DRIP: DripInput = {
  dose: 15,
  ratio: 16,
  water: 240,
  grind: '',
  temp: 93,
  recipe: '',
  finishTime: '',
  scores: emptyScores(),
  dry: false,
  comment: '',
  adjustment: '',
}

/** Carry over brew parameters; the evaluation is always filled in fresh. */
function draftFrom(base: Drip | undefined, keepGrind: boolean): DripInput {
  if (!base) return { ...DEFAULT_DRIP, scores: emptyScores() }
  return {
    ...DEFAULT_DRIP,
    dose: base.dose,
    ratio: base.ratio,
    water: base.water,
    grind: keepGrind ? base.grind : '',
    temp: base.temp,
    recipe: base.recipe,
    finishTime: base.finishTime,
    scores: emptyScores(),
  }
}

export default function App() {
  const store = useAppData()
  const { data } = store

  const sessions = useMemo(() => sortSessions(data), [data])
  // on launch, open the most recently used coffee
  const [selectedId, setSelectedId] = useState<string | null>(() => sessions[0]?.id ?? null)
  const current = sessions.find((s) => s.id === selectedId) ?? sessions[0] ?? null

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sessionEditor, setSessionEditor] = useState<SessionEditor | null>(null)
  const [dripEditor, setDripEditor] = useState<DripEditor | null>(null)

  const dripCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const d of data.drips) counts.set(d.sessionId, (counts.get(d.sessionId) ?? 0) + 1)
    return counts
  }, [data.drips])

  const currentDrips = useMemo(
    () =>
      current
        ? data.drips.filter((d) => d.sessionId === current.id).sort((a, b) => a.createdAt - b.createdAt)
        : [],
    [data.drips, current],
  )

  const selectSession = (id: string) => {
    setSelectedId(id)
    setSidebarOpen(false)
    window.scrollTo({ top: 0 })
  }

  const openNewSession = () => {
    setSidebarOpen(false)
    setSessionEditor({ mode: 'new' })
  }

  const createSession = (input: SessionInput) => {
    const session = store.addSession(input)
    setSelectedId(session.id)
    setSessionEditor(null)
  }

  const openNewDrip = (base?: Drip) => {
    if (!current) return
    const latest = currentDrips.at(-1)
    if (base ?? latest) {
      setDripEditor({
        mode: 'new',
        initial: draftFrom(base ?? latest, true),
        previousAdjustment: (base ?? latest)?.adjustment,
      })
      return
    }
    // first brew of this coffee: start from the most recent brew of any coffee
    const lastAnywhere = [...data.drips].sort((a, b) => b.createdAt - a.createdAt)[0]
    const lastSession = lastAnywhere && data.sessions.find((s) => s.id === lastAnywhere.sessionId)
    setDripEditor({
      mode: 'new',
      initial: draftFrom(lastAnywhere, lastSession?.grinder === current.grinder),
    })
  }

  const saveDrip = (input: DripInput) => {
    if (!dripEditor || !current) return
    if (dripEditor.mode === 'new') store.addDrip(current.id, input)
    else store.updateDrip(dripEditor.drip.id, input)
    setDripEditor(null)
  }

  const deleteSession = () => {
    if (!current) return
    if (confirm(`ลบ "${current.coffee}" และโน้ตทั้งหมด ${currentDrips.length} ครั้ง?`)) {
      store.deleteSession(current.id)
      setSelectedId(null)
    }
  }

  const deleteDrip = (drip: Drip) => {
    if (confirm('ลบโน้ตนี้?')) store.deleteDrip(drip.id)
  }

  // new sessions start with the gear from the last coffee; only the beans change
  const newSessionInitial = sessions[0]
    ? { dripper: sessions[0].dripper, grinder: sessions[0].grinder, waterTds: sessions[0].waterTds }
    : {}

  if (!current) {
    return (
      <main className="welcome">
        <div className="welcome-mark">
          <DripperIcon width={40} height={40} strokeWidth={1.5} />
        </div>
        <h1>Pour-over Dial-in</h1>
        <p className="welcome-lede">
          จดทุกครั้งที่ดริป แล้วปรับทีละตัวแปรจนได้แก้วที่ใช่
          <br />
          เริ่มจากกาแฟที่กำลังจะชงตัวแรก
        </p>
        <div className="card">
          <SessionForm id="welcome-session" initial={{}} sessions={[]} onSubmit={createSession} />
          <button type="submit" form="welcome-session" className="btn primary block">
            เริ่ม dial-in
          </button>
        </div>
        <ImportLink onImport={store.replaceAll} />
      </main>
    )
  }

  return (
    <div className="layout">
      <button
        type="button"
        className="fab-menu"
        onClick={() => setSidebarOpen(true)}
        aria-label="รายการกาแฟ"
      >
        <MenuIcon />
      </button>

      <Sidebar
        open={sidebarOpen}
        sessions={sessions}
        dripCounts={dripCounts}
        currentId={current.id}
        data={data}
        onSelect={selectSession}
        onNew={openNewSession}
        onClose={() => setSidebarOpen(false)}
        onImport={(next) => {
          store.replaceAll(next)
          setSelectedId(null)
          setSidebarOpen(false)
        }}
      />

      <main className="main">
        <SessionView
          session={current}
          drips={currentDrips}
          onEditSession={() => setSessionEditor({ mode: 'edit', session: current })}
          onDeleteSession={deleteSession}
          onNewDrip={openNewDrip}
          onEditDrip={(drip) => setDripEditor({ mode: 'edit', drip })}
          onDeleteDrip={deleteDrip}
        />
      </main>

      {sessionEditor && (
        <Modal
          title={sessionEditor.mode === 'new' ? 'กาแฟตัวใหม่' : 'แก้ไขกาแฟ'}
          onClose={() => setSessionEditor(null)}
          footer={
            <button type="submit" form="session-form" className="btn primary block">
              {sessionEditor.mode === 'new' ? 'เริ่ม dial-in' : 'บันทึก'}
            </button>
          }
        >
          <SessionForm
            id="session-form"
            initial={sessionEditor.mode === 'new' ? newSessionInitial : sessionEditor.session}
            sessions={data.sessions}
            onSubmit={(input) => {
              if (sessionEditor.mode === 'new') createSession(input)
              else {
                store.updateSession(sessionEditor.session.id, input)
                setSessionEditor(null)
              }
            }}
          />
        </Modal>
      )}

      {dripEditor && (
        <Modal
          title={dripEditor.mode === 'new' ? 'New note' : 'แก้ไขโน้ต'}
          onClose={() => setDripEditor(null)}
          footer={
            <button type="submit" form="drip-form" className="btn primary block">
              บันทึก
            </button>
          }
        >
          <DripForm
            id="drip-form"
            initial={dripEditor.mode === 'new' ? dripEditor.initial : dripEditor.drip}
            previousAdjustment={dripEditor.mode === 'new' ? dripEditor.previousAdjustment : undefined}
            grinder={current.grinder}
            onSubmit={saveDrip}
          />
        </Modal>
      )}
    </div>
  )
}

function ImportLink({ onImport }: { onImport: (data: AppData) => void }) {
  const pick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json,.json'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      try {
        const parsed: unknown = JSON.parse(await file.text())
        if (!isAppData(parsed)) throw new Error('invalid')
        onImport(parsed)
      } catch {
        alert('ไฟล์ไม่ถูกต้อง')
      }
    }
    input.click()
  }
  return (
    <button type="button" className="link-btn welcome-import" onClick={pick}>
      มีไฟล์สำรองอยู่แล้ว? นำเข้าข้อมูล
    </button>
  )
}
