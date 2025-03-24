import { describe, it, expect } from 'vitest';
import { User } from '../User';

describe('User', () => {
  describe('createWithResultType', () => {
    it('should create a user successfully with valid data', () => {
      const result = User.createWithResultType('user-123', 'test@example.com', 'John Doe');
      
      expect(result.isSuccess()).toBe(true);
      expect(result.entity).toBeDefined();
      expect(result.entity?.getId()).toBe('user-123');
      expect(result.entity?.getName()).toBe('John Doe');
      expect(result.entity?.getEmail().getValue()).toBe('test@example.com');
    });
    
    it('should return failure when email is invalid', () => {
      const result = User.createWithResultType('user-123', 'invalid-email', 'John Doe');
      
      expect(result.isFailure()).toBe(true);
      expect(result.entity).toBeUndefined();
      
      const errors = result.getErrors();
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].field).toBe('email');
    });
    
    it('should return failure when name is empty', () => {
      const result = User.createWithResultType('user-123', 'test@example.com', '');
      
      expect(result.isFailure()).toBe(true);
      expect(result.entity).toBeUndefined();
      
      const errors = result.getErrors();
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].field).toBe('name');
    });
    
    it('should return failure when name is too short', () => {
      const result = User.createWithResultType('user-123', 'test@example.com', 'J');
      
      expect(result.isFailure()).toBe(true);
      expect(result.entity).toBeUndefined();
      
      const errors = result.getErrors();
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].field).toBe('name');
    });
  });
  
  describe('updateNameWithResultType', () => {
    it('should update the name successfully with valid data', () => {
      const user = User.create('user-123', 'test@example.com', 'John Doe');
      const result = user.updateNameWithResultType('Jane Doe');
      
      expect(result.isSuccess()).toBe(true);
      expect(user.getName()).toBe('Jane Doe');
    });
    
    it('should return failure when name is empty', () => {
      const user = User.create('user-123', 'test@example.com', 'John Doe');
      const result = user.updateNameWithResultType('');
      
      expect(result.isFailure()).toBe(true);
      expect(user.getName()).toBe('John Doe'); // Name should not change
      
      const errors = result.getErrors();
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].field).toBe('name');
    });
  });
  
  describe('updateEmailWithResultType', () => {
    it('should update the email successfully', () => {
      const user = User.create('user-123', 'test@example.com', 'John Doe');
      const emailResult = user.getEmail(); // Using current email for simplicity
      
      const result = user.updateEmailWithResultType(emailResult);
      
      expect(result.isSuccess()).toBe(true);
    });
  });
  
  describe('create (deprecated method)', () => {
    it('should create a user with valid data', () => {
      const user = User.create('user-123', 'test@example.com', 'John Doe');
      
      expect(user.getId()).toBe('user-123');
      expect(user.getName()).toBe('John Doe');
      expect(user.getEmail().getValue()).toBe('test@example.com');
    });
    
    it('should throw error when email is invalid', () => {
      expect(() => {
        User.create('user-123', 'invalid-email', 'John Doe');
      }).toThrow('Invalid email');
    });
  });
  
  describe('preferences', () => {
    it('should get and set preferences correctly', () => {
      const user = User.create('user-123', 'test@example.com', 'John Doe');
      
      user.setPreference('theme', 'dark');
      expect(user.getPreference('theme', 'light')).toBe('dark');
      expect(user.getPreference('nonexistent', 'default')).toBe('default');
      
      const prefs = user.getPreferences();
      expect(prefs.theme).toBe('dark');
    });
  });
}); 