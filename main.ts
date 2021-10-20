import {App, Plugin, PluginSettingTab, Setting} from 'obsidian'

interface Settings {
	speed: number
}

const DEFAULT_SETTINGS: Settings = {
	speed: 2,
}

const MOUSE_WHEEL_EVENT: any = 'mousewheel'
const SOURCE_CLASS = 'markdown-source-view'
const SOURCE_CODE_CLASS = 'CodeMirror-vscrollbar'
const PREVIEW_CLASS = 'markdown-preview-view'

export default class ScrollSpeed extends Plugin {
	settings: Settings

	async onload() {
		await this.loadSettings()
		this.addSettingTab(new SettingsTab(this.app, this))

		// TODO register listeners on application start

		this.registerEvent(
			this.app.workspace.on('active-leaf-change', event => {
				const container = (event as any).containerEl as Element
				const sourceContainer = this.getFirstElementByClass(container, SOURCE_CLASS)
				const source = this.getFirstElementByClass(container, SOURCE_CODE_CLASS)
				const preview = this.getFirstElementByClass(container, PREVIEW_CLASS)

				// TODO remove event listeners when file is closed
				this.registerListener(sourceContainer, source)
				this.registerListener(preview)
			})
		)
	}

	getFirstElementByClass(parent: Element, className: string) {
		return parent.getElementsByClassName(className).item(0)
	}

	registerListener(listenElement: Element, scrollElement?: Element) {
		listenElement.addEventListener(MOUSE_WHEEL_EVENT, (event: WheelEvent) => {
			this.changeScrollSpeed(event, scrollElement || listenElement)
		})
	}

	changeScrollSpeed(event: WheelEvent, element: Element) {
		event.preventDefault()
		const {deltaY} = event
		const top = deltaY * this.settings.speed
		element.scrollBy({top})
	}

	onunload() {}

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
		let {containerEl} = this

		containerEl.empty()

		new Setting(containerEl)
			.setName('Speed')
			.setDesc('Scroll speed multiplier')
			.addText(text =>
				text
					.setPlaceholder('Normal speed is 1')
					.setValue(this.plugin.settings.speed.toString())
					.onChange(async value => {
						this.plugin.settings.speed = Number(value)
						await this.plugin.saveSettings()
					})
			)
	}
}
