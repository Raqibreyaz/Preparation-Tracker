import { Category, TrackerState } from "@/lib/types";
import { v4 as uuid } from "uuid";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialData: Category[] = [
  {
    id: uuid(),
    name: "DSA",
    topics: [
      {
        id: uuid(),
        name: "Arrays",
        subtopics: [
          {
            id: uuid(),
            name: "Binary Search",
            status: "Done",
            notes: "",
            markForRevision: true,
            importance: 4,
          },
        ],
      },
    ],
  },
  {
    id: uuid(),
    name: "Computer Networking",
    topics: [
      {
        id: uuid(),
        name: "TCP/UDP Basics",
        subtopics: [
          {
            id: uuid(),
            name: "TCP Handshake",
            status: "In Progress",
            notes: "SYN → SYN-ACK → ACK",
            markForRevision: true,
            importance: 4,
          },
          {
            id: uuid(),
            name: "UDP Characteristics",
            status: "Done",
            notes: "No connection, no reliability",
            markForRevision: false,
            importance: 3,
          },
        ],
      },
      {
        id: uuid(),
        name: "HTTP & REST",
        subtopics: [
          {
            id: uuid(),
            name: "HTTP Methods",
            status: "Not Started",
            notes: "",
            markForRevision: false,
            importance: 2,
          },
        ],
      },
    ],
  },
  { id: uuid(), name: "Operating Systems", topics: [] },
  {
    id: uuid(),
    name: "DBMS",
    topics: [
      {
        id: uuid(),
        name: "Transactions",
        subtopics: [
          {
            id: uuid(),
            name: "ACID Properties",
            status: "In Progress",
            notes: "Atomicity, Consistency, Isolation, Durability",
            markForRevision: true,
            importance: 5,
          },
        ],
      },
    ],
  },
  {
    id: uuid(),
    name: "System Design",
    topics: [
      {
        id: uuid(),
        name: "Caching",
        subtopics: [
          {
            id: uuid(),
            name: "Cache Eviction (LRU/LFU)",
            status: "Not Started",
            notes: "",
            markForRevision: false,
            importance: 3,
          },
        ],
      },
    ],
  },
  {
    id: uuid(),
    name: "Soft Skills",
    topics: [
      {
        id: uuid(),
        name: "Communication",
        subtopics: [
          {
            id: uuid(),
            name: "STAR Method",
            status: "Done",
            notes: "Good for behavioral answers",
            markForRevision: false,
            importance: 2,
          },
        ],
      },
    ],
  },
];

export const useTracker = create<TrackerState>()(
  persist(
    (set, get) => ({
      categories: initialData,
      addCategory: (name) =>
        set((s) => ({
          categories: [...s.categories, { id: uuid(), name, topics: [] }],
        })),
      addTopic: (categoryId, name) =>
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id === categoryId
              ? {
                  ...c,
                  topics: [...c.topics, { id: uuid(), name, subtopics: [] }],
                }
              : c
          ),
        })),
      addSubtopic: (categoryId, topicId, sub) =>
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id === categoryId
              ? {
                  ...c,
                  topics: c.topics.map((t) =>
                    t.id === topicId
                      ? {
                          ...t,
                          subtopics: [...t.subtopics, { id: uuid(), ...sub }],
                        }
                      : t
                  ),
                }
              : c
          ),
        })),
      updateSubtopic: (categoryId, topicId, subtopicId, patch) =>
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id === categoryId
              ? {
                  ...c,
                  topics: c.topics.map((t) =>
                    t.id === topicId
                      ? {
                          ...t,
                          subtopics: t.subtopics.map((sub) =>
                            sub.id === subtopicId ? { ...sub, ...patch } : sub
                          ),
                        }
                      : t
                  ),
                }
              : c
          ),
        })),
      deleteCategory: (categoryId) =>
        set((s) => ({
          categories: s.categories.filter((c) => c.id !== categoryId),
        })),
      deleteTopic: (categoryId, topicId) =>
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id === categoryId
              ? { ...c, topics: c.topics.filter((t) => t.id !== topicId) }
              : c
          ),
        })),
      deleteSubtopic: (categoryId, topicId, subtopicId) =>
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id === categoryId
              ? {
                  ...c,
                  topics: c.topics.map((t) =>
                    t.id === topicId
                      ? {
                          ...t,
                          subtopics: t.subtopics.filter(
                            (s) => s.id !== subtopicId
                          ),
                        }
                      : t
                  ),
                }
              : c
          ),
        })),
      getSubtopic: (categoryId, topicId, subtopicId) => {
          const category = get().categories.find(cat => cat.id === categoryId);
          if (!category) return null;

          // find the topic
          const topic = category.topics.find(t => t.id === topicId);
          if (!topic) return null;

          // find the subtopic
          const subtopic = topic.subtopics.find(st => st.id === subtopicId);
          return subtopic || null;
      },
      importJSON: (data) => set({ categories: data }),
      clearAll: () => set({ categories: [] }),
    }),
    { name: "placement-tracker" }
  )
);
