import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAwardStore } from '../award';
import type { AwardInterface } from '@cv-generator/shared/src/types/resume.interface';
import { LocalStorageResumeRepository } from '@cv-generator/infrastructure/src/repositories/LocalStorageResumeRepository';

// Mock the repository
vi.mock('@cv-generator/infrastructure/src/repositories/LocalStorageResumeRepository', () => {
  return {
    LocalStorageResumeRepository: vi.fn().mockImplementation(() => ({
      load: vi.fn(),
      save: vi.fn(),
    })),
  };
});

describe('Award Store', () => {
  let store: ReturnType<typeof useAwardStore>;
  let repository: LocalStorageResumeRepository;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useAwardStore();
    repository = new LocalStorageResumeRepository();
  });

  it('should initialize with empty awards array', () => {
    expect(store.awards).toEqual([]);
    expect(store.loading).toBe(false);
  });

  it('should load awards from repository', async () => {
    const mockAwards = [
      {
        id: '1',
        title: 'Test Award',
        date: '2023-01-01',
        awarder: 'Test Awarder',
        summary: 'Test Summary',
      },
    ];

    (repository.load as any).mockResolvedValueOnce({
      toJSON: () => ({ awards: mockAwards }),
    });

    const result = await store.loadAwards();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: '1',
      title: 'Test Award',
      date: '2023-01-01',
      awarder: 'Test Awarder',
      summary: 'Test Summary',
    });
    expect(store.awards).toEqual(result);
  });

  it('should handle empty awards data', async () => {
    (repository.load as any).mockResolvedValueOnce({
      toJSON: () => ({ awards: [] }),
    });

    const result = await store.loadAwards();

    expect(result).toEqual([]);
    expect(store.awards).toEqual([]);
  });

  it('should add a new award', async () => {
    const newAward: AwardInterface = {
      title: 'New Award',
      date: '2023-01-01',
      awarder: 'New Awarder',
      summary: 'New Summary',
    };

    (repository.load as any).mockResolvedValueOnce({
      toJSON: () => ({ awards: [] }),
    });

    const result = await store.addAward(newAward);

    expect(result).toMatchObject({
      title: 'New Award',
      date: '2023-01-01',
      awarder: 'New Awarder',
      summary: 'New Summary',
    });
    expect(store.awards).toHaveLength(1);
    expect(store.awards[0]).toBe(result);
  });

  it('should update an existing award', async () => {
    const existingAward = {
      id: '1',
      title: 'Test Award',
      date: '2023-01-01',
      awarder: 'Test Awarder',
      summary: 'Test Summary',
    };

    (repository.load as any).mockResolvedValueOnce({
      toJSON: () => ({ awards: [existingAward] }),
    });

    await store.loadAwards();

    const updateData = {
      title: 'Updated Award',
      summary: 'Updated Summary',
    };

    await store.updateAward('1', updateData);

    expect(store.awards[0]).toMatchObject({
      id: '1',
      title: 'Updated Award',
      date: '2023-01-01',
      awarder: 'Test Awarder',
      summary: 'Updated Summary',
    });
  });

  it('should delete an award', async () => {
    const existingAward = {
      id: '1',
      title: 'Test Award',
      date: '2023-01-01',
      awarder: 'Test Awarder',
      summary: 'Test Summary',
    };

    (repository.load as any).mockResolvedValueOnce({
      toJSON: () => ({ awards: [existingAward] }),
    });

    await store.loadAwards();
    await store.deleteAward('1');

    expect(store.awards).toHaveLength(0);
  });

  it('should reorder awards', async () => {
    const mockAwards = [
      {
        id: '1',
        title: 'First Award',
        date: '2023-01-01',
        awarder: 'First Awarder',
        summary: 'First Summary',
      },
      {
        id: '2',
        title: 'Second Award',
        date: '2023-01-02',
        awarder: 'Second Awarder',
        summary: 'Second Summary',
      },
    ];

    (repository.load as any).mockResolvedValueOnce({
      toJSON: () => ({ awards: mockAwards }),
    });

    await store.loadAwards();
    await store.reorderAwards(['2', '1']);

    expect(store.awards[0].id).toBe('2');
    expect(store.awards[1].id).toBe('1');
  });
}); 