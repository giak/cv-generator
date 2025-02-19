import { describe, expect, it } from 'vitest';
import type { ResumeType } from '../types/resume';

describe('ResumeType', () => {
  it('should have the correct structure', () => {
    const resume: ResumeType = {
      basics: {
        name: 'John Doe',
        email: 'john@example.com'
      },
      work: [],
      education: [],
      skills: []
    };

    expect(resume).toHaveProperty('basics');
    expect(resume.basics).toHaveProperty('name');
    expect(resume.basics).toHaveProperty('email');
    expect(resume).toHaveProperty('work');
    expect(resume).toHaveProperty('education');
    expect(resume).toHaveProperty('skills');
  });
}); 