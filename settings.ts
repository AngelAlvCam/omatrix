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
    .setName("Adjust Value")
    .setDesc("Set a number with the slider")
    .addSlider(slider => {
        const valueText = containerEl.createEl("span", { text: `${this.plugin.settings.matrixSize}` });
        slider
        .setLimits(10, 50, 1) // Min: 0, Max: 100, Step: 1
        .setValue(20) // Default value
        .onChange(async (value) => {
            this.plugin.settings.matrixSize = value;
            await this.plugin.saveSettings();
            console.log(`Slider changed to: ${value}`);
            valueText.textContent = `${value}`;
        });
    });

  }
}