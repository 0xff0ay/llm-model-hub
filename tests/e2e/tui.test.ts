/**
 * e2e test for TUI
 */

import { TUIApplication } from '../src/tui/app';

describe('TUI Application', () => {
  test('can create TUI instance', () => {
    const app = new TUIApplication();
    expect(app).toBeDefined();
  });
});
