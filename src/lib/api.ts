const API_BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export const api = {
  questions: {
    getAll: (params?: { moduleId?: string; level?: string }) => {
      const qs = new URLSearchParams();
      if (params?.moduleId) qs.set('moduleId', params.moduleId);
      if (params?.level) qs.set('level', params.level);
      const q = qs.toString();
      return request<{ questions: import('../types/question').Question[] }>(
        `/questions${q ? `?${q}` : ''}`
      );
    },
    getById: (id: string) =>
      request<{ question: import('../types/question').Question }>(`/questions/${id}`),
  },

  modules: {
    getAll: () =>
      request<{ modules: import('../types/question').Module[] }>('/modules'),
  },

  progress: {
    get: () =>
      request<{ progress: import('../types/question').ProgressState }>('/progress'),
    save: (data: { questionId: string; status: string; answer: unknown }) =>
      request<{ success: boolean }>('/progress', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getStats: () =>
      request<{ stats: Record<string, import('../types/question').ModuleProgress> }>(
        '/progress/stats'
      ),
  },

  diagnostics: {
    submit: (result: import('../types/question').DiagnosticsResult) =>
      request<{ success: boolean }>('/diagnostics', {
        method: 'POST',
        body: JSON.stringify(result),
      }),
  },

  exam: {
    submit: (result: import('../types/question').ExamResult) =>
      request<{ success: boolean }>('/exam', {
        method: 'POST',
        body: JSON.stringify(result),
      }),
  },
};
