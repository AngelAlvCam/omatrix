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
      .addText((text) => {
        text.setValue(this.plugin.settings.matrixRows.toString());
        text.setPlaceholder('number');
        text.inputEl.setAttribute('type', 'number');
        text.inputEl.setAttribute('min', '1');
        text.inputEl.setAttribute('max', '50');
        text.onChange(async (value) => {
          const parsedValue = parseInt(value);
          if (parsedValue > 1 && parsedValue <= 50) {
            this.plugin.settings.matrixRows = parsedValue;
            await this.plugin.saveSettings();
            console.log('current rows value: ', this.plugin.settings.matrixRows);
          }
        })
      });

    // Cols configuration
    new Setting(containerEl)
      .setName('Matrix Colums')
      .setDesc('Number of colums in the matrix')
      .addText((text) => {
        text.setValue(this.plugin.settings.matrixCols.toString());
        text.setPlaceholder('number');
        text.inputEl.setAttribute('type', 'number');
        text.inputEl.setAttribute('min', '1');
        text.inputEl.setAttribute('max', '50');
        text.onChange(async (value) => {
          const parsedValue = parseInt(value);
          if (parsedValue > 1 && parsedValue <= 50) {
            this.plugin.settings.matrixCols = parsedValue;
            await this.plugin.saveSettings();
            console.log('current matrix value: ', this.plugin.settings.matrixCols);
          }
        })
      });

    // Refresh rate configuration
    new Setting(containerEl)
      .setName('Refresh rate')
      .setDesc('Number of milliseconds between lines update')
      .addText((text) => {
        text.setValue(this.plugin.settings.refresh.toString());
        text.setPlaceholder('number');
        text.inputEl.setAttribute('type', 'number');
        text.inputEl.setAttribute('min', '10');
        text.inputEl.setAttribute('max', '1000');
        text.onChange(async (value) => {
          const parsedValue = parseInt(value);
          if (parsedValue >= 10 && parsedValue <= 1000) {
            this.plugin.settings.refresh = parsedValue;
            await this.plugin.saveSettings();
            console.log('current refresh value: ', this.plugin.settings.refresh);
          }
        })
      });

    // Front Color settings
    new Setting(containerEl)
      .setName('Front color')
      .setDesc('pick a color')
      .addColorPicker(color => {
        color.setValue(this.plugin.settings.frontColor);
        color.onChange(async (value: string) => {
          this.plugin.settings.frontColor = value;
          await this.plugin.saveSettings();
          document.documentElement.style.setProperty('--front-color', value);
        })
      });
    
  }
}