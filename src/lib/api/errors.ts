export interface FieldIssue {
  field?: string;
  name?: string;
  message?: string;
  reason?: string;
}

export class ApiError extends Error {
  issues: FieldIssue[] | null;
  field: string | null;
  constructor(message: string, opts: { issues?: FieldIssue[]; field?: string } = {}) {
    super(message);
    this.name = 'ApiError';
    this.issues = opts.issues ?? null;
    this.field = opts.field ?? null;
  }
}
