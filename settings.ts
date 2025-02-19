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

    new Setting(containerEl)
      .setName('matrix size')
      .setDesc('default matrix size')
      .addText((text) =>
        text
          .setPlaceholder('number')
          .setValue(this.plugin.settings.matrixSize.toString())
          .onChange(async (value) => {
            const parsedValue = parseInt(value);
            if (!isNaN(parsedValue)) {
              this.plugin.settings.matrixSize = parseInt(value);
              await this.plugin.saveSettings();
            }
          })
      );
  }
}