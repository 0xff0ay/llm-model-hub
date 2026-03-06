/**
 * Command interface
 */

export interface Command {
  name: string;
  description: string;
  execute: (args: string[]) => Promise<void>;
}

export class CommandManager {
  private commands: Map<string, Command> = new Map();

  register(command: Command): void {
    this.commands.set(command.name, command);
  }

  execute(name: string, args: string[] = []): Promise<void> {
    const command = this.commands.get(name);
    if (!command) {
      throw new Error(`Command not found: ${name}`);
    }
    return command.execute(args);
  }

  get(name: string): Command | undefined {
    return this.commands.get(name);
  }

  list(): Command[] {
    return Array.from(this.commands.values());
  }
}

export const commandManager = new CommandManager();
