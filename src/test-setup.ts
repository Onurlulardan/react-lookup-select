import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock CSS imports for testing
const mockCSSModule = new Proxy(
  {},
  {
    get: () => 'mock-class-name',
  }
);

// Global test utilities
(globalThis as any).ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver for virtualization tests
(globalThis as any).IntersectionObserver = class MockIntersectionObserver {
  constructor(private callback: IntersectionObserverCallback) {}

  observe() {}
  unobserve() {}
  disconnect() {}

  // Trigger callback for tests
  trigger(entries: IntersectionObserverEntry[]) {
    this.callback(entries, this as any);
  }
};

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

export default mockCSSModule;
