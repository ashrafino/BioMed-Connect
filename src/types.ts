
export type UserRole = 'admin' | 'technician' | 'nurse' | 'service';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  service?: string;
  createdAt: string;
}

export type UrgencyLevel = 'Faible' | 'Moyenne' | 'Elevé';
export type PanneStatus = 'En cours' | 'Résolue' | 'Critique';

export interface Panne {
  id: string;
  equipmentId: string;
  equipmentName: string;
  service: string;
  description: string;
  urgencyLevel: UrgencyLevel;
  status: PanneStatus;
  priorityScore: number;
  priorityLevel: string;
  reportedBy: string; // User ID
  reportedByName?: string;
  technicianId?: string; // Assigned Tech
  technicianName?: string;
  createdAt: string;
  resolvedAt?: string;
  aiSuggestions?: string[];
  priorityDetails?: {
    equipmentType: number;
    service: number;
    patientImpact: number;
    repeatPanne: number;
    declaredUrgency: number;
  };
}

export interface Equipement {
  id: string;
  name: string;
  type: string;
  service: string;
  status: 'operational' | 'faulty' | 'critical';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  isRead: boolean;
  createdAt: string;
}
