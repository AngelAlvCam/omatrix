import { Plugin, WorkspaceLeaf } from 'obsidian';
import { ExampleView, VIEW_TYPE_EXAMPLE } from 'view';
import { ExampleSettingTab } from 'settings';

// Settings definition, the user can define the size of the matrix
interface ExamplePluginSettings {
	matrixRows: number
	matrixCols: number
}
const DEFAULT_SETTINGS: Partial<ExamplePluginSettings> = {
	matrixRows: 10,
	matrixCols: 20
};

export default class ExamplePlugin extends Plugin {
	settings: ExamplePluginSettings;

	async onload() {
		// Attach settings page to the plugin
		await this.loadSettings();
		this.addSettingTab(new ExampleSettingTab(this.app, this));

		// Attach view
    	this.registerView(
      		VIEW_TYPE_EXAMPLE,
      		(leaf) => new ExampleView(leaf, this)
    	);

		// Activate the view using a button in the left side bar
    	this.addRibbonIcon('square-terminal', 'Activate view', () => {
			console.log("View activated through the ribbon");
      		this.activateView();
    	});

		// Activate the view via a command
		this.addCommand({
			id: 'activate-view',
			name: 'Activate view',
			callback: () => {
				console.log("View activated through a command");
				this.activateView();
			}
		});
  	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

  	async onunload() {
  	}

  	async activateView() {
    	const { workspace } = this.app;

    	let leaf: WorkspaceLeaf | null = null;
    	const leaves = workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE);

    	if (leaves.length > 0) {
      		// A leaf with our view already exists, use that
      		leaf = leaves[0];
    	} else {
      		// Our view could not be found in the workspace, create a new leaf
      		// in the right sidebar for it
      		leaf = workspace.getRightLeaf(false);
      		await leaf.setViewState({ type: VIEW_TYPE_EXAMPLE, active: true });
    	}

    	// "Reveal" the leaf in case it is in a collapsed sidebar
    	workspace.revealLeaf(leaf);
  	}
}