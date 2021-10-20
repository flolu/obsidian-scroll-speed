import {App, Plugin, PluginSettingTab, Setting, TextComponent} from 'obsidian'

interface AugmentedWheelEvent extends WheelEvent {
	path: Element[]
}

interface Settings {
	speed: number
}

const DEFAULT_SPEED = 2

const DEFAULT_SETTINGS: Settings = {
	speed: DEFAULT_SPEED,
}

const MOUSE_WHEEL_EVENT: any = 'mousewheel'

export default class ScrollSpeed extends Plugin {
	settings: Settings

	async onload() {
		await this.loadSettings()
		this.addSettingTab(new SettingsTab(this.app, this))

		window.addEventListener(MOUSE_WHEEL_EVENT, this.scrollListener.bind(this), {passive: false})
	}

	scrollListener(event: AugmentedWheelEvent) {
		event.preventDefault()
		const firstScrollableElement = event.path.find(el => el.scrollHeight > el.clientHeight)
		firstScrollableElement.scrollBy({top: event.deltaY * this.settings.speed})
	}

	onunload() {
		window.removeEventListener(MOUSE_WHEEL_EVENT, this.scrollListener)
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
	}

	async saveSettings() {
		await this.saveData(this.settings)
	}
}

class SettingsTab extends PluginSettingTab {
	plugin: ScrollSpeed

	constructor(app: App, plugin: ScrollSpeed) {
		super(app, plugin)
		this.plugin = plugin
	}

	display(): void {
		const {containerEl} = this
		containerEl.empty()

		let input: TextComponent

		new Setting(containerEl)
			.setName('Mouse Wheel Scroll Sensitivity')
			.setDesc('A multiplier to be used on the `delta` of mouse wheel scroll events.')
			.addExtraButton(button => {
				button
					.setIcon('reset')
					.setTooltip('Restore default')
					.onClick(async () => {
						this.plugin.settings.speed = DEFAULT_SPEED
						input.setValue(DEFAULT_SPEED.toString())
						await this.plugin.saveSettings()
					})
			})
			.addText(text => {
				input = text
				text.setPlaceholder(DEFAULT_SPEED.toString())
					.setValue(this.plugin.settings.speed.toString())
					.onChange(async value => {
						this.plugin.settings.speed = Number(value) || DEFAULT_SPEED
						await this.plugin.saveSettings()
					})
			})
	}
}
