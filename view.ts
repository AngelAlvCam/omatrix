import ExamplePlugin from 'main';
import { ItemView, WorkspaceLeaf } from 'obsidian';

export const VIEW_TYPE_EXAMPLE = 'example-view';

export class ExampleView extends ItemView {
  private intervalId: number | undefined;
  private ROWS: number;
  private COLS: number;
  private header: number[];
  private terminal: number[][];
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

    // Update header
    for (let i = 0; i < this.COLS; i++) {
      if (this.header[i] == 0 && Math.random() > 0.9) {
        this.header[i] = Math.floor(Math.random() * (this.COLS - (this.COLS / 2) + 1)) + (this.COLS / 2);
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
      matrix.createEl("div", { text: this.toString(this.terminal[i]), cls: "line" });
    }
  }

  toString(binary: number[]) {
    let out = "";
    for (let i = 0; i < this.ROWS; i++) {
      if (binary[i] == 1) {
        out += "%";
      } else {
        out += " ";
      }
    }
    return out;
  }

  initialize() {
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();

    // Set the matrix parameters
    this.ROWS = this.plugin.settings.matrixRows;
    this.COLS = this.plugin.settings.matrixCols;

    // Set the header
    this.header = new Array(this.COLS).fill(0);

    // Set the terminal
    this.terminal = Array.from({ length: this.ROWS }, () => new Array(this.COLS).fill(0));

    // Store the interval ID
    this.intervalId = window.setInterval(() => {
      this.addLine();
    }, this.plugin.settings.refresh);
  }

  async onClose() {
    // Clear the interval when closing the view
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}