/**
 * Input handler
 */

import readline from 'readline';

export interface InputOptions {
  prompt?: string;
  silent?: boolean;
  timeout?: number;
}

export class InputHandler {
  private rl: readline.Interface | null = null;

  async read(options: InputOptions = {}): Promise<string> {
    return new Promise((resolve, reject) => {
      this.rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      this.rl.question(options.prompt || '> ', (answer) => {
        this.rl?.close();
        resolve(answer);
      });
    });
  }

  close(): void {
    this.rl?.close();
  }
}
