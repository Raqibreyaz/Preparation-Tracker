export type Status = 'Not Started' | 'In Progress' | 'Done';

export interface Subtopic {
  id: string;
  name: string;
  status: Status;
  notes?: string;
  markForRevision: boolean;
  importance: 1 | 2 | 3 | 4 | 5;
}

export interface Topic {
  id: string;
  name: string;
  subtopics: Subtopic[];
}

export interface Category {
  id: string;
  name: string;
  topics: Topic[];
}

export interface TrackerState {
  categories: Category[];
  // CRUD
  addCategory: (name: string) => void;
  addTopic: (categoryId: string, name: string) => void;
  addSubtopic: (categoryId: string, topicId: string, sub: Omit<Subtopic, 'id'>) => void;
  updateSubtopic: (
    categoryId: string,
    topicId: string,
    subtopicId: string,
    patch: Partial<Subtopic>
  ) => void;
  // Import/Export
  importJSON: (data: Category[]) => void;
  clearAll: () => void;
}