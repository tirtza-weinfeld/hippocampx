export interface CodeFile {
  id: string
  name: string
  content: string
  language: string
  path?: string
  isDirty?: boolean
}

export interface EditorTab {
  id: string
  fileId: string
  isActive: boolean
  isPinned?: boolean
}

export interface EditorGroup {
  id: string
  tabs: EditorTab[]
  activeTabId: string | null
}

export interface SplitConfig {
  direction: 'horizontal' | 'vertical'
  groups: EditorGroup[]
  sizes?: number[]
}

export interface EditorState {
  files: Map<string, CodeFile>
  splitConfig: SplitConfig
  activeGroupId: string
}

export interface EditorActions {
  openFile: (file: CodeFile, targetGroupId?: string) => void
  closeFile: (fileId: string, groupId?: string) => void
  switchTab: (tabId: string, groupId: string) => void
  moveTab: (tabId: string, fromGroupId: string, toGroupId: string, toIndex: number) => void
  splitEditor: (direction: 'horizontal' | 'vertical', groupId: string, tabId?: string) => void
  closeSplit: (groupId: string) => void
  updateFileContent: (fileId: string, content: string) => void
}

export type FileIcon = 
  | 'typescript'
  | 'javascript'  
  | 'python'
  | 'json'
  | 'markdown'
  | 'css'
  | 'html'
  | 'unknown'

export interface EditorTheme {
  background: string
  foreground: string
  tabBackground: string
  tabActiveForeground: string
  tabInactiveForeground: string
  borderColor: string
  sidebarBackground: string
}