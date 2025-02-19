import ExamplePlugin from 'main';
import { App, PluginSettingTab, Setting } from 'obsidian';

export class ExampleSettingTab extends PluginSettingTab {
  plugin: ExamplePlugin;

  constructor(app: App, plugin: ExamplePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    // Rows configuration
    new Setting(containerEl)
      .setName('Matrix Rows')
      .setDesc('Number of rows in the matrix')
      .addText((text) =>
        text
          .setPlaceholder('number')
          .setValue(this.plugin.settings.matrixRows.toString())
          .onChange(async (value) => {
            const parsedValue = parseInt(value);
            if (!isNaN(parsedValue)) {
              this.plugin.settings.matrixRows = parseInt(value);
              await this.plugin.saveSettings();
            }
            console.log('Current rows value:', this.plugin.settings.matrixRows)
          })
      );

    // Cols configuration
    new Setting(containerEl)
      .setName('Matrix Colums')
      .setDesc('Number of colums in the matrix')
      .addText((text) =>
        text
          .setPlaceholder('number')
          .setValue(this.plugin.settings.matrixCols.toString())
          .onChange(async (value) => {
            const parsedValue = parseInt(value);
            if (!isNaN(parsedValue)) {
              this.plugin.settings.matrixCols = parsedValue;
              await this.plugin.saveSettings();
            }
            console.log('Current cols value:', this.plugin.settings.matrixCols)
          })
      );
  }
}