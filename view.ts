import ExamplePlugin from 'main';
import { ItemView, WorkspaceLeaf } from 'obsidian';

export const VIEW_TYPE_EXAMPLE = 'example-view';

export class ExampleView extends ItemView {
  private intervalId: number | undefined;
  private ROWS: number;
  private COLS: number;
  private REFRESH: number;
  private header: number[];
  private terminal: number[][];
  private textBoard: string[][];
  private plugin: ExamplePlugin;

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
    const max = this.ROWS;
    const min = Math.floor(this.ROWS / 4);

    // Update header
    for (let i = 0; i < this.COLS; i++) {
      if (this.header[i] == 0 && Math.random() > 0.95) {
        this.header[i] = Math.floor(Math.random() * (max - min + 1)) + min; 
      }
    }

    let top_row: number[] = new Array(this.COLS).fill(0);
    for (let j = 0; j < this.COLS; j++) {
      if (this.header[j] > 0) {
        top_row[j] = 1;
        this.header[j]--;
      }
    }
    this.terminal.unshift(top_row);
    this.terminal.pop();


    // Print terminal in the view
    container.empty();
    const matrix = container.createEl("div", { cls: "matrix" });
    for (let i = 0; i < this.ROWS; i++) {
      matrix.createEl("div", { text: this.toString(this.terminal[i], i), cls: "line" });
    }

    this.updateTextMatrix();
  }

  toString(binary: number[], row: number) {
    let out = "";
    for (let i = 0; i < this.COLS; i++) {
      if (binary[i] == 1) {
        out += this.textBoard[row][i];
      } else {
        out += " ";
      }
    }
    return out;
  }

  // Function to generate a random alphanumeric character
  randomAlphanumeric(): string {
    const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const index = Math.floor(Math.random() * alphanumeric.length);
    return alphanumeric[index];
  }

  // Function to generate a 2D array of random alphanumeric characters
  generateTextMatrix(n: number, m: number): string[][] {
      return Array.from({ length: n }, () =>
          Array.from({ length: m }, () => this.randomAlphanumeric())
      );
  }

  updateTextMatrix() {
    for (let i = 0; i < this.ROWS; i++) {
      for (let j = 0; j < this.COLS; j++) {
        if (this.terminal[i][j] == 0) {
          this.textBoard[i][j] = this.randomAlphanumeric();
        }
      }
    }
  }

  initialize() {
    // Set the matrix parameters
    this.ROWS = this.plugin.settings.matrixRows;
    this.COLS = this.plugin.settings.matrixCols;
    this.REFRESH = this.plugin.settings.refresh;

    // Set the header as a array of 0s
    this.header = new Array(this.COLS).fill(0);

    // Set the terminal as bidimensional array of 0s
    this.terminal = Array.from({ length: this.ROWS }, () => new Array(this.COLS).fill(0));

    // Set text board with random text
    this.textBoard = this.generateTextMatrix(this.ROWS, this.COLS);

    // Clear the interval if possible
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
    }

    // Start a new interval to execute the algorithm
    this.intervalId = window.setInterval(() => {
      this.addLine();
    }, this.REFRESH);

  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();

    // Start the algorithm
    this.initialize();
  }

  async onClose() {
    // Clear the interval when closing the view
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}