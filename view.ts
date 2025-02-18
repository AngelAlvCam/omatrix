import ExamplePlugin from 'main';
import { ItemView, Plugin, WorkspaceLeaf } from 'obsidian';

export const VIEW_TYPE_EXAMPLE = 'example-view';

export class ExampleView extends ItemView {
  private intervalId: number | undefined;
  private N: number;
  private lines: string[] = [];
  private binary: number[][] = [];
  private plugin;

  constructor(leaf: WorkspaceLeaf, plugin: ExamplePlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType() {
    return VIEW_TYPE_EXAMPLE;
  }

  getDisplayText() {
    return 'Example view';
  }

  addLine() {
    const container = this.containerEl.children[1];
    let current_binary = this.generateRandomArray(this.N);
    this.binary.push(current_binary);
    this.lines.push(""); // Dummy placeholder

    let local_count: number = 0;
    
    container.empty();
    const matrix = container.createEl("div", { cls: "matrix" });
    for (let i = this.binary.length - 1; i >= 0; i--) {
      local_count++;
      let current_binary = this.binary[i];
    
      // Ensure that i - 1 is >= 0 to prevent accessing undefined
      let previous_binary = (i - 1 >= 0) ? this.binary[i - 1] : new Array(this.N).fill(0);
      let previous_string = (i - 1 >= 0) ? this.lines[i - 1] : " ".repeat(this.N);
      let current_string = this.merge(previous_binary, current_binary, previous_string);
      this.lines[i] = current_string;

      if (local_count > this.N) {
        break;
      }

      matrix.createEl("div", { text: this.lines[i], cls: "line" });
    }

    // Remove items that can't be printed
    while (this.binary.length > this.N) {
      this.binary.shift();
      this.lines.shift();
    }

  }

  andOperation(arr1: number[], arr2: number[]): number[] {
    return arr1.map((val, i) => (val === 1 && arr2[i] === 1 ? 1 : 0));
  }

  generateRandomArray(length: number): number[] {
    return Array.from({ length }, () => (Math.random() < 0.7 ? 0 : 1));
  }

  getRandomAlphanumeric(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomIndex = Math.floor(Math.random() * chars.length);
    return chars[randomIndex];
  }

  merge(previous_binary: number[], new_binary: number[], old_string: string): string {
    let output_string = "";
    for (let i = 0; i < this.N; i++) {
      if (previous_binary[i] == 1 && new_binary[i] == 1) {
        output_string += old_string[i];
      } else if (new_binary[i] == 1) {
        output_string += this.getRandomAlphanumeric();
      } else {
        output_string += ' ';
      }
    }
    return output_string;
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();

    // Set the matrix size
    this.N = this.plugin.settings.matrixSize;

    // Store the interval ID
    this.intervalId = window.setInterval(() => {
      this.addLine();
    }, 100);
  }

  async onClose() {
    // Clear the interval when closing the view
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}