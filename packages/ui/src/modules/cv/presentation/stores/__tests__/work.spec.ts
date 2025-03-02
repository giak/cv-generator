import type { WorkInterface } from "@cv-generator/shared/src/types/resume.interface"
import { createPinia, setActivePinia } from "pinia"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { ManageResume } from "@cv-generator/core"
import { useErrorStore } from '../../../../../core/stores/error'
import { useWorkStore } from "../work"

// Mock des dépendances
vi.mock("@cv-generator/core", () => {
  // Mock de l'entité Work
  const mockWork = {
    toJSON: vi.fn().mockReturnValue({
      name: "Company",
      position: "Developer",
      startDate: "2020-01-01"
    })
  };
  
  return {
    ManageResume: vi.fn().mockImplementation(() => ({
      loadResume: vi.fn().mockResolvedValue({
        work: mockWorkExperiences,
        toJSON: vi.fn().mockReturnValue({ work: mockWorkExperiences })
      }),
      createResume: vi.fn().mockResolvedValue(undefined)
    })),
    // Mock de l'import dynamique pour Work.create
    Work: {
      create: vi.fn(async (data) => {
        // Simuler la validation - accepter si name, position et startDate sont présents
        if (data.name && data.position && data.startDate) {
          return {
            isValid: true,
            work: {
              id: "work-123",
              ...data,
              toJSON: () => data
            }
          };
        }
        return {
          isValid: false,
          errors: ["Invalid work data"]
        };
      })
    }
  };
});

// Mock du store d'erreurs
vi.mock('../../../../../core/stores/error', () => ({
  useErrorStore: vi.fn(() => ({
    executeWithErrorHandling: vi.fn(async (fn) => {
      try {
        return await fn();
      } catch (error) {
        console.error('Error in executeWithErrorHandling mock:', error);
        throw error;
      }
    }),
    hasFieldError: vi.fn().mockReturnValue(false),
    getFieldError: vi.fn().mockReturnValue(null),
    hasError: false,
    error: null,
    recoveryAction: null
  }))
}));

// Données de test pour les expériences de travail
const mockWorkExperiences: WorkInterface[] = [
  {
    name: "Company A",
    position: "Senior Developer",
    startDate: "2018-01-01",
    endDate: "2020-12-31",
    summary: "Worked on various projects"
  },
  {
    name: "Company B",
    position: "Junior Developer",
    startDate: "2015-01-01",
    endDate: "2017-12-31",
    summary: "Learned the basics"
  }
];

// Données pour une nouvelle expérience de travail
const newWorkExperience: WorkInterface = {
  name: "Company C",
  position: "Tech Lead",
  startDate: "2021-01-01",
  summary: "Leading a team of developers"
};

// Données pour une expérience de travail invalide
const invalidWorkExperience: Partial<WorkInterface> = {
  name: "Invalid Company",
  // Position manquante
  startDate: undefined // Date de début invalide
};

describe("Work Store", () => {
  let store: ReturnType<typeof useWorkStore>;
  let mockManageResume: any;
  let mockErrorStore: any;
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Initialisation des mocks
    mockManageResume = {
      loadResume: vi.fn().mockResolvedValue({
        work: mockWorkExperiences,
        toJSON: vi.fn().mockReturnValue({ work: mockWorkExperiences })
      }),
      createResume: vi.fn().mockResolvedValue(undefined)
    };
    
    mockErrorStore = {
      executeWithErrorHandling: vi.fn().mockImplementation(async (fn) => await fn()),
      hasFieldError: vi.fn().mockReturnValue(false),
      getFieldError: vi.fn().mockReturnValue(null)
    };
    
    // Configuration des mocks
    vi.mocked(ManageResume).mockImplementation(() => mockManageResume);
    vi.mocked(useErrorStore).mockReturnValue(mockErrorStore as any);
    
    // Création d'un store Pinia de test
    setActivePinia(createPinia());
    
    // Récupération de l'instance du store
    store = useWorkStore();
    
    // Silence des logs de console pendant les tests
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  describe("État initial", () => {
    it("devrait avoir un état initial correct", () => {
      expect(store.works).toBeNull();
      expect(store.loading).toBe(false);
    });
  });
  
  describe("loadWorks", () => {
    it("devrait charger les expériences de travail avec succès", async () => {
      await store.loadWorks();
      
      expect(mockManageResume.loadResume).toHaveBeenCalled();
      expect(store.works?.length).toBe(2);
      expect(store.works?.[0].name).toBe("Company A");
    });
    
    it("devrait gérer les erreurs lors du chargement", async () => {
      const error = new Error("Erreur de chargement");
      mockManageResume.loadResume.mockRejectedValueOnce(error);
      mockErrorStore.executeWithErrorHandling.mockRejectedValueOnce(error);
      
      await expect(store.loadWorks()).rejects.toThrow("Erreur de chargement");
      
      expect(mockErrorStore.executeWithErrorHandling).toHaveBeenCalled();
      expect(store.works).toBeNull();
    });
  });
  
  describe("addWork", () => {
    it("devrait ajouter une nouvelle expérience de travail", async () => {
      // D'abord charger les expériences
      await store.loadWorks();
      
      // Ensuite ajouter une nouvelle expérience
      const updatedWorkExperience = {
        name: "Company C",
        position: "Tech Lead",
        startDate: "2021-01-01",
        summary: "Leading a team of developers",
        endDate: "",
        url: "",
        highlights: []
      };
      
      await store.addWork(updatedWorkExperience);
      
      // Vérifie que le CV a été mis à jour avec la nouvelle expérience
      expect(mockManageResume.createResume).toHaveBeenCalled();
      const createResumeCall = mockManageResume.createResume.mock.calls[0][0];
      expect(createResumeCall.work.length).toBe(3);
      expect(createResumeCall.work[2]).toEqual(updatedWorkExperience);
    });
    
    it("devrait gérer les données invalides", async () => {
      await expect(store.addWork(invalidWorkExperience as WorkInterface)).rejects.toThrow();
      
      expect(mockManageResume.createResume).not.toHaveBeenCalled();
    });
  });
  
  describe("updateWork", () => {
    it("devrait mettre à jour une expérience existante", async () => {
      // D'abord charger les expériences
      await store.loadWorks();
      
      // Ensuite mettre à jour une expérience
      const updatedExperience = {
        ...mockWorkExperiences[0],
        position: "Updated Position"
      };
      
      await store.updateWork(0, updatedExperience);
      
      // Vérifie que le CV a été mis à jour
      expect(mockManageResume.createResume).toHaveBeenCalled();
      const createResumeCall = mockManageResume.createResume.mock.calls[0][0];
      expect(createResumeCall.work[0].position).toBe("Updated Position");
    });
    
    it("devrait échouer si les expériences ne sont pas chargées", async () => {
      await expect(store.updateWork(0, newWorkExperience)).rejects.toThrow("Work experiences not loaded");
      
      expect(mockManageResume.createResume).not.toHaveBeenCalled();
    });
    
    it("devrait échouer si l'index est invalide", async () => {
      // D'abord charger les expériences
      await store.loadWorks();
      
      await expect(store.updateWork(99, newWorkExperience)).rejects.toThrow("Invalid work index: 99");
      
      expect(mockManageResume.createResume).not.toHaveBeenCalled();
    });
  });
  
  describe("deleteWork", () => {
    it("devrait supprimer une expérience existante", async () => {
      // D'abord charger les expériences
      await store.loadWorks();
      
      // Ensuite supprimer une expérience
      await store.deleteWork(0);
      
      // Vérifie que le CV a été mis à jour
      expect(mockManageResume.createResume).toHaveBeenCalled();
      const createResumeCall = mockManageResume.createResume.mock.calls[0][0];
      expect(createResumeCall.work.length).toBe(1);
      expect(createResumeCall.work[0].name).toBe("Company B");
    });
    
    it("devrait échouer si les expériences ne sont pas chargées", async () => {
      await expect(store.deleteWork(0)).rejects.toThrow("Work experiences not loaded");
      
      expect(mockManageResume.createResume).not.toHaveBeenCalled();
    });
    
    it("devrait échouer si l'index est invalide", async () => {
      // D'abord charger les expériences
      await store.loadWorks();
      
      await expect(store.deleteWork(99)).rejects.toThrow("Invalid work index: 99");
      
      expect(mockManageResume.createResume).not.toHaveBeenCalled();
    });
  });
  
  describe("reorderWorks", () => {
    it("devrait réorganiser les expériences", async () => {
      // D'abord charger les expériences
      await store.loadWorks();
      
      // Ensuite réorganiser les expériences (inverser l'ordre)
      await store.reorderWorks([1, 0]);
      
      // Vérifie que le CV a été mis à jour
      expect(mockManageResume.createResume).toHaveBeenCalled();
      const createResumeCall = mockManageResume.createResume.mock.calls[0][0];
      expect(createResumeCall.work[0].name).toBe("Company B");
      expect(createResumeCall.work[1].name).toBe("Company A");
    });
    
    it("devrait échouer si les expériences ne sont pas chargées", async () => {
      await expect(store.reorderWorks([1, 0])).rejects.toThrow("Work experiences not loaded");
      
      expect(mockManageResume.createResume).not.toHaveBeenCalled();
    });
    
    it("devrait échouer si l'ordre est invalide", async () => {
      // D'abord charger les expériences
      await store.loadWorks();
      
      await expect(store.reorderWorks([0])).rejects.toThrow("Invalid order length: 1, expected 2");
      
      expect(mockManageResume.createResume).not.toHaveBeenCalled();
    });
  });
  
  describe("Gestion des erreurs", () => {
    it("devrait exposer les méthodes de gestion des erreurs", () => {
      store.hasFieldError("work.0.name");
      store.getFieldError("work.0.name");
      
      expect(mockErrorStore.hasFieldError).toHaveBeenCalledWith("work.0.name");
      expect(mockErrorStore.getFieldError).toHaveBeenCalledWith("work.0.name");
    });
  });
}); 