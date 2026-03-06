/**
 * Python integration utilities
 */

import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';

export interface PythonOptions {
  script: string;
  args?: string[];
  cwd?: string;
  env?: Record<string, string>;
}

export class PythonRunner {
  private processes: Map<string, ChildProcess> = new Map();

  async run(options: PythonOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      const args = [options.script, ...(options.args || [])];
      const proc = spawn('python3', args, {
        cwd: options.cwd || process.cwd(),
        env: { ...process.env, ...options.env }
      });

      const processId = `proc-${Date.now()}`;
      this.processes.set(processId, proc);

      let stdout = '';
      let stderr = '';

      proc.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      proc.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      proc.on('close', (code) => {
        this.processes.delete(processId);
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new Error(stderr || `Process exited with code ${code}`));
        }
      });

      proc.on('error', (err) => {
        this.processes.delete(processId);
        reject(err);
      });
    });
  }

  kill(processId: string): boolean {
    const proc = this.processes.get(processId);
    if (proc) {
      proc.kill();
      this.processes.delete(processId);
      return true;
    }
    return false;
  }

  killAll(): void {
    for (const [id, proc] of this.processes) {
      proc.kill();
    }
    this.processes.clear();
  }
}

export const pythonRunner = new PythonRunner();
