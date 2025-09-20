import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, CSSProperties } from 'react'
import * as Blockly from 'blockly/core'
import 'blockly/blocks'
import * as trLocale from 'blockly/msg/tr'
import './App.css'
import { lifecycleBlockOrder, generateProbotCode } from './blockly/generator'
import { registerProbotBlocks } from './blockly/blocks'
import nfrLogoWhite from '../nfr-logo-white.png'
import hljs from 'highlight.js/lib/core'
import cpp from 'highlight.js/lib/languages/cpp'
import 'highlight.js/styles/atom-one-dark.css'

const locale = { ...(trLocale as unknown as Record<string, string>) }
delete (locale as { default?: unknown }).default

hljs.registerLanguage('cpp', cpp)
Blockly.setLocale(locale)

const createSessionPassword = () => {
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = new Uint32Array(6)
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes)
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * charset.length)
    }
  }
  let result = 'PB-'
  for (let i = 0; i < bytes.length; i += 1) {
    result += charset[bytes[i] % charset.length]
    if (i === 2) {
      result += '-'
    }
  }
  return result
}

const probotTheme = Blockly.Theme.defineTheme('probot-theme', {
  name: 'probot-theme',
  base: Blockly.Themes.Classic,
  blockStyles: {
    logic_blocks: {
      colourPrimary: '#0f3c66',
      colourSecondary: '#154c80',
      colourTertiary: '#1f5f9e',
    },
    loop_blocks: {
      colourPrimary: '#154c80',
      colourSecondary: '#1f5f9e',
      colourTertiary: '#2a71ba',
    },
    math_blocks: {
      colourPrimary: '#22608f',
      colourSecondary: '#2e70a2',
      colourTertiary: '#3a82b8',
    },
    text_blocks: {
      colourPrimary: '#395773',
      colourSecondary: '#476785',
      colourTertiary: '#557799',
    },
    list_blocks: {
      colourPrimary: '#af7920',
      colourSecondary: '#c38c32',
      colourTertiary: '#d89f45',
    },
    variable_blocks: {
      colourPrimary: '#485e75',
      colourSecondary: '#576c82',
      colourTertiary: '#687a90',
    },
    procedure_blocks: {
      colourPrimary: '#00204d',
      colourSecondary: '#12305f',
      colourTertiary: '#234071',
    },
    custom_probot_blocks: {
      colourPrimary: '#00204d',
      colourSecondary: '#12305f',
      colourTertiary: '#234071',
    },
  },
  categoryStyles: {
    logic_category: { colour: '#0f3c66' },
    loop_category: { colour: '#154c80' },
    math_category: { colour: '#22608f' },
    text_category: { colour: '#395773' },
    list_category: { colour: '#af7920' },
    variable_category: { colour: '#485e75' },
    procedure_category: { colour: '#00204d' },
    probot_category: { colour: '#00204d' },
    arduino_category: { colour: '#5c7a1a' },
  },
  componentStyles: {
    workspaceBackgroundColour: '#f7f7f5',
    toolboxBackgroundColour: '#00204d',
    toolboxForegroundColour: '#e5e4e2',
    flyoutBackgroundColour: '#ffffff',
    flyoutForegroundColour: '#00204d',
    flyoutOpacity: 0.95,
    scrollbarColour: '#9aa7b8',
  },
})

type Notification = { id: number; type: 'success' | 'error'; message: string }

function App() {
  const blocklyRef = useRef<HTMLDivElement | null>(null)
  const mainRef = useRef<HTMLDivElement | null>(null)
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null)
  const [code, setCode] = useState('')
  const [panelWidth, setPanelWidth] = useState(360)
  const [isResizing, setIsResizing] = useState(false)
  const notificationIdRef = useRef(0)
  const notificationTimers = useRef<Record<number, number>>({})
  const [notifications, setNotifications] = useState<Notification[]>([])
  const codeElementRef = useRef<HTMLElement | null>(null)
  const [driverPassword, setDriverPassword] = useState(createSessionPassword)
  const driverPasswordRef = useRef(driverPassword)
  const [projectName, setProjectName] = useState('Probot Projesi')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id))
    if (notificationTimers.current[id]) {
      clearTimeout(notificationTimers.current[id])
      delete notificationTimers.current[id]
    }
  }

  const pushNotification = (type: Notification['type'], message: string) => {
    const id = notificationIdRef.current++
    setNotifications((prev) => [...prev, { id, type, message }])
    const timeoutId = window.setTimeout(() => removeNotification(id), 5000)
    notificationTimers.current[id] = timeoutId
  }

  const toolbox = useMemo(
    () => ({
      kind: 'categoryToolbox',
      contents: [
        {
          kind: 'category',
          name: 'Kontrol',
          categorystyle: 'loop_category',
          contents: [
            { kind: 'block', type: 'controls_if' },
            {
              kind: 'block',
              type: 'controls_repeat_ext',
              inputs: {
                TIMES: {
                  block: {
                    type: 'math_number',
                    fields: {
                      NUM: 5,
                    },
                  },
                },
              },
            },
            {
              kind: 'block',
              type: 'controls_whileUntil',
              fields: {
                MODE: 'WHILE',
              },
            },
            { kind: 'block', type: 'controls_flow_statements' },
            {
              kind: 'block',
              type: 'controls_for',
              inputs: {
                FROM: {
                  block: {
                    type: 'math_number',
                    fields: { NUM: 0 },
                  },
                },
                TO: {
                  block: {
                    type: 'math_number',
                    fields: { NUM: 10 },
                  },
                },
                BY: {
                  block: {
                    type: 'math_number',
                    fields: { NUM: 1 },
                  },
                },
              },
            },
            {
              kind: 'block',
              type: 'controls_forEach',
              inputs: {
                LIST: {
                  block: {
                    type: 'lists_create_with',
                    extraState: {
                      itemCount: 2,
                    },
                  },
                },
              },
            },
          ],
        },
        {
          kind: 'category',
          name: 'Mantık',
          categorystyle: 'logic_category',
          contents: [
            { kind: 'block', type: 'logic_compare' },
            { kind: 'block', type: 'logic_operation' },
            { kind: 'block', type: 'logic_boolean' },
            { kind: 'block', type: 'logic_negate' },
            { kind: 'block', type: 'logic_null' },
            { kind: 'block', type: 'logic_ternary' },
          ],
        },
        {
          kind: 'category',
          name: 'Matematik',
          categorystyle: 'math_category',
          contents: [
            { kind: 'block', type: 'math_number' },
            {
              kind: 'block',
              type: 'math_arithmetic',
              fields: {
                OP: 'ADD',
              },
              inputs: {
                A: {
                  block: {
                    type: 'math_number',
                    fields: { NUM: 1 },
                  },
                },
                B: {
                  block: {
                    type: 'math_number',
                    fields: { NUM: 1 },
                  },
                },
              },
            },
            { kind: 'block', type: 'math_single' },
            { kind: 'block', type: 'math_trig' },
            { kind: 'block', type: 'math_round' },
            { kind: 'block', type: 'math_modulo' },
            { kind: 'block', type: 'math_constrain' },
            { kind: 'block', type: 'math_number_property' },
            { kind: 'block', type: 'math_random_int' },
            { kind: 'block', type: 'math_random_float' },
          ],
        },
        {
          kind: 'category',
          name: 'Listeler',
          categorystyle: 'list_category',
          contents: [
            {
              kind: 'block',
              type: 'lists_create_with',
              extraState: {
                itemCount: 3,
              },
            },
            { kind: 'block', type: 'lists_repeat' },
            { kind: 'block', type: 'lists_length' },
            { kind: 'block', type: 'lists_isEmpty' },
            {
              kind: 'block',
              type: 'lists_indexOf',
              fields: {
                END: 'FIRST',
              },
            },
            {
              kind: 'block',
              type: 'lists_getIndex',
              fields: {
                MODE: 'GET',
                WHERE: 'FROM_START',
              },
            },
            {
              kind: 'block',
              type: 'lists_setIndex',
              fields: {
                MODE: 'SET',
                WHERE: 'FROM_START',
              },
            },
            { kind: 'block', type: 'lists_getSublist' },
          ],
        },
        {
          kind: 'category',
          name: 'Metin',
          categorystyle: 'text_category',
          contents: [
            { kind: 'block', type: 'text' },
            { kind: 'block', type: 'text_join' },
            {
              kind: 'block',
              type: 'text_join',
              extraState: {
                itemCount: 3,
              },
            },
            { kind: 'block', type: 'text_length' },
            { kind: 'block', type: 'text_isEmpty' },
            { kind: 'block', type: 'text_changeCase' },
            { kind: 'block', type: 'text_trim' },
            { kind: 'block', type: 'text_print' },
          ],
        },
        {
          kind: 'category',
          name: 'Değişkenler',
          categorystyle: 'variable_category',
          custom: 'VARIABLE',
        },
        {
          kind: 'category',
          name: 'Arduino',
          categorystyle: 'arduino_category',
          contents: [
            { kind: 'block', type: 'arduino_digital_write' },
            {
              kind: 'block',
              type: 'arduino_delay',
              inputs: {
                DELAY: {
                  block: {
                    type: 'math_number',
                    fields: { NUM: 1000 },
                  },
                },
              },
            },
            {
              kind: 'block',
              type: 'arduino_serial_print',
              inputs: {
                TEXT: {
                  block: {
                    type: 'text',
                    fields: { TEXT: 'Merhaba Probot' },
                  },
                },
              },
            },
            {
              kind: 'block',
              type: 'arduino_serial_print_raw',
              inputs: {
                TEXT: {
                  block: {
                    type: 'text',
                    fields: { TEXT: 'Probot' },
                  },
                },
              },
            },
          ],
        },
        {
          kind: 'category',
          name: 'Probot',
          categorystyle: 'probot_category',
          contents: [{ kind: 'block', type: 'probot_nfr_motor' }],
        },
      ],
    }),
    []
  )

  const mainStyle = useMemo(() => ({ '--side-panel-width': `${panelWidth}px` } as CSSProperties), [panelWidth])

  useEffect(() => {
    driverPasswordRef.current = driverPassword || 'ProBot1234'
  }, [driverPassword])

  useEffect(() => {
    Blockly.setLocale(locale)
    registerProbotBlocks()

    if (!blocklyRef.current) {
      return
    }

    const workspace = Blockly.inject(blocklyRef.current, {
      toolbox,
      renderer: 'thrasos',
      theme: probotTheme,
      collapse: false,
      comments: false,
      sounds: false,
      trashcan: true,
      scrollbars: true,
      move: {
        wheel: true,
        drag: true,
        scrollbars: true,
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 0.9,
        maxScale: 1.4,
        minScale: 0.6,
        scaleSpeed: 1.1,
      },
      grid: {
        spacing: 30,
        length: 1,
        colour: '#d4d2cf',
        snap: true,
      },
    })

    lifecycleBlockOrder.forEach(({ type }, index) => {
      const block = workspace.newBlock(type)
      block.initSvg()
      block.render()
      block.moveBy(24, 24 + index * 120)
    })

    const updateCode = () => {
      const generated = generateProbotCode(workspace, driverPasswordRef.current)
      setCode(generated)
    }

    workspace.addChangeListener(updateCode)
    workspaceRef.current = workspace

    updateCode()

    const handleResize = () => {
      workspaceRef.current && Blockly.svgResize(workspaceRef.current)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      workspace.removeChangeListener(updateCode)
      workspace.dispose()
      workspaceRef.current = null
    }
  }, [toolbox])

  useEffect(() => {
    if (!codeElementRef.current) {
      return
    }

    const element = codeElementRef.current
    if (!code.trim()) {
      element.textContent = '// Henüz kod oluşturulmadı'
      element.classList.remove('hljs')
      return
    }

    const highlighted = hljs.highlight(code, { language: 'cpp' })
    element.innerHTML = highlighted.value
    element.classList.add('hljs')
  }, [code])

  useEffect(() => {
    if (workspaceRef.current) {
      const generated = generateProbotCode(
        workspaceRef.current,
        driverPassword || 'ProBot1234',
      )
      setCode(generated)
    }
  }, [driverPassword])

  const handleCopyCode = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = code
        textArea.style.position = 'fixed'
        textArea.style.top = '0'
        textArea.style.left = '0'
        textArea.style.width = '1px'
        textArea.style.height = '1px'
        textArea.style.padding = '0'
        textArea.style.border = 'none'
        textArea.style.outline = 'none'
        textArea.style.boxShadow = 'none'
        textArea.style.background = 'transparent'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        if (!successful) {
          throw new Error('Kopyalama başarısız')
        }
      }
      pushNotification('success', 'Kod panoya kopyalandı.')
    } catch (error) {
      console.error('Kopyalama başarısız oldu', error)
      pushNotification('error', 'Kopyalama başarısız oldu.')
    }
  }

  const handleDownload = () => {
    downloadBlob(code, 'probot-sketch.ino', 'text/plain')
    pushNotification('success', '.ino dosyası indirildi.')
  }

  const handleRegeneratePassword = () => {
    const nextPassword = createSessionPassword()
    setDriverPassword(nextPassword)
    pushNotification('success', 'Yeni Driver Station şifresi oluşturuldu.')
  }

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value.toUpperCase()
    const sanitized = raw.replace(/[^A-Z0-9-]/g, '').slice(0, 16)
    setDriverPassword(sanitized)
  }

  const handleProjectNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProjectName(event.target.value)
  }

  const downloadBlob = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleDownloadBlocks = () => {
    if (!workspaceRef.current) {
      return
    }
    const workspaceState = Blockly.serialization.workspaces.save(workspaceRef.current)
    const payload = {
      format: 'probot-blocks',
      version: 1,
      projectName: projectName.trim() || 'Probot Projesi',
      generatedAt: new Date().toISOString(),
      driverPassword: driverPasswordRef.current,
      workspace: workspaceState,
    }
    const slug = (projectName || 'probot-projesi')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const filename = slug ? `${slug}.probot.json` : 'probot-project.probot.json'
    downloadBlob(JSON.stringify(payload, null, 2), filename, 'application/json')
    pushNotification('success', 'Blok projesi indirildi.')
  }

  const handleTriggerImport = () => {
    fileInputRef.current?.click()
  }

  const handleImportBlocks = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    try {
      const text = await file.text()
      const data = JSON.parse(text)
      const workspaceData = data?.workspace ?? data

      if (data?.projectName && typeof data.projectName === 'string') {
        setProjectName(data.projectName)
      }

      if (data?.driverPassword && typeof data.driverPassword === 'string') {
        setDriverPassword(data.driverPassword.toUpperCase())
      }

      if (workspaceRef.current) {
        workspaceRef.current.clear()
        Blockly.serialization.workspaces.load(workspaceData, workspaceRef.current)
        const regenerated = generateProbotCode(
          workspaceRef.current,
          driverPasswordRef.current,
        )
        setCode(regenerated)
        pushNotification('success', 'Blok projesi yüklendi.')
      }
    } catch (error) {
      console.error('Blok projesi yüklenemedi', error)
      pushNotification('error', 'Blok projesi yüklenemedi.')
    } finally {
      event.target.value = ''
    }
  }

  useEffect(() => {
    return () => {
      Object.values(notificationTimers.current).forEach((timeoutId) => clearTimeout(timeoutId))
    }
  }, [])

  useEffect(() => {
    if (!isResizing) {
      document.body.style.removeProperty('user-select')
      document.body.style.removeProperty('cursor')
      return undefined
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!mainRef.current) {
        return
      }

      const bounds = mainRef.current.getBoundingClientRect()
      const minPanelWidth = 240
      const minWorkspaceWidth = 360
      const maxPanelWidth = Math.max(minPanelWidth, bounds.width - minWorkspaceWidth)
      let newWidth = bounds.right - event.clientX
      newWidth = Math.min(maxPanelWidth, Math.max(minPanelWidth, newWidth))
      setPanelWidth(newWidth)
      workspaceRef.current && Blockly.svgResize(workspaceRef.current)
    }

    const handleMouseUp = () => setIsResizing(false)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'col-resize'

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      document.body.style.removeProperty('user-select')
      document.body.style.removeProperty('cursor')
    }
  }, [isResizing])

  useEffect(() => {
    const handleWindowResize = () => {
      if (!mainRef.current) {
        return
      }

      const bounds = mainRef.current.getBoundingClientRect()
      const minPanelWidth = 240
      const minWorkspaceWidth = 360
      const maxPanelWidth = Math.max(minPanelWidth, bounds.width - minWorkspaceWidth)
      if (panelWidth > maxPanelWidth) {
        setPanelWidth(maxPanelWidth)
        workspaceRef.current && Blockly.svgResize(workspaceRef.current)
      }
    }

    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [panelWidth])

  const startResize = (event: React.MouseEvent) => {
    event.preventDefault()
    setIsResizing(true)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <img src={nfrLogoWhite} alt="NFR" />
          <div>
            <h1>Probot Blocks</h1>
            <p>probot-lib ile uyumlu blok tabanlı kodlama aracı</p>
          </div>
        </div>
        <div className="project-name">
          <label>
            <span>Proje adı</span>
            <input
              value={projectName}
              onChange={handleProjectNameChange}
              placeholder="Probot Projesi"
              spellCheck={false}
              maxLength={60}
            />
          </label>
        </div>
        <div className="header-actions">
          <button className="primary" onClick={handleCopyCode}>
            Kodu kopyala
          </button>
          <button onClick={handleDownload}>.ino indir</button>
          <button onClick={handleDownloadBlocks}>Blokları indir</button>
          <button onClick={handleTriggerImport}>Blokları yükle</button>
        </div>
      </header>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleImportBlocks}
        style={{ display: 'none' }}
      />
      <main className={`app-main${isResizing ? ' resizing' : ''}`} ref={mainRef} style={mainStyle}>
        <div className="blockly-wrapper" ref={blocklyRef} />
        <div className="resize-handle" onMouseDown={startResize} />
        <aside className="side-panel">
          <section className="code-preview">
            <div className="section-header">
              <h2>Kod Önizleme</h2>
            </div>
            <div className="password-chip" aria-live="polite">
              <label className="password-field">
                <span>Driver Station şifresi</span>
                <input
                  value={driverPassword}
                  onChange={handlePasswordChange}
                  placeholder="ProBot1234"
                  spellCheck={false}
                  maxLength={16}
                />
              </label>
              <button onClick={handleRegeneratePassword}>Şifreyi yenile</button>
            </div>
            <pre>
              <code ref={codeElementRef} className="language-cpp" />
            </pre>
          </section>
        </aside>
      </main>
      <div className="notifications">
        {notifications.map((item) => (
          <div key={item.id} className={`notification ${item.type}`}>
            {item.message}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
