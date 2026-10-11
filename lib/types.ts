export interface Employee {
  id: string
  user_id: string
  name: string
  email: string
  department: string | null
  employee_number: string | null
  created_at: string
}

export interface ProtectedDocument {
  id: string
  user_id: string
  original_filename: string
  document_hash: string
  total_copies: number
  created_at: string
}

export interface DocumentCopy {
  id: string
  document_id: string
  employee_id: string
  token: string
  distributed_at: string
}

export interface LeakDetection {
  id: string
  user_id: string
  document_id: string | null
  employee_id: string | null
  leaked_filename: string
  confidence_score: number
  detected_at: string
  employee?: Employee
}

export interface ActivityLog {
  id: string
  user_id: string
  action_type: string
  description: string | null
  created_at: string
  previous_hash?: string
  current_hash?: string
}