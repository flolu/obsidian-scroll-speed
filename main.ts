import {App, Plugin, PluginSettingTab, Setting, SliderComponent} from 'obsidian'

interface AugmentedWheelEvent extends WheelEvent {
  path: Element[]
}

interface Settings {
  speed: number
  smoothness: number
}

const DEFAULT_SPEED = 5
const DEFAULT_SMOOTHNESS = 3

const DEFAULT_SETTINGS: Settings = {
  speed: DEFAULT_SPEED,
  smoothness: DEFAULT_SMOOTHNESS,
}

const MOUSE_WHEEL_EVENT: any = 'mousewheel'

export default class ScrollSpeed extends Plugin {
  settings: Settings

  position = 0
  isMoving = false
  target: Element

  async onload() {
    await this.loadSettings()
    this.addSettingTab(new SettingsTab(this.app, this))

    window.addEventListener(MOUSE_WHEEL_EVENT, this.scrollListener.bind(this), {passive: false})
  }

  update() {
    this.isMoving = true

    const divider = Math.pow(this.settings.smoothness, 1.3)
    const delta = (this.position - this.target.scrollTop) / divider
    this.target.scrollTop += delta

    if (Math.abs(delta) > 0.5) window.requestAnimationFrame(this.update.bind(this))
    else this.isMoving = false
  }

  scrollListener(event: AugmentedWheelEvent) {
    event.preventDefault()

    this.target = event.path.find(el => el.scrollHeight > el.clientHeight)

    this.position = this.target.scrollTop
    const acceleration = Math.pow(this.settings.speed, 1.1)
    this.position += event.deltaY * acceleration

    if (!this.isMoving) this.update()
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

    let speedSlider: SliderComponent
    new Setting(containerEl)
      .setName('Mouse Scroll Speed')
      .addExtraButton(button => {
        button
          .setIcon('reset')
          .setTooltip('Restore default')
          .onClick(async () => {
            this.plugin.settings.speed = DEFAULT_SPEED
            speedSlider.setValue(DEFAULT_SPEED)
            await this.plugin.saveSettings()
          })
      })
      .addSlider(slider => {
        speedSlider = slider
        slider
          .setValue(this.plugin.settings.speed)
          .setLimits(1, 10, 1)
          .setDynamicTooltip()
          .onChange(async value => {
            this.plugin.settings.speed = value
            await this.plugin.saveSettings()
          })
      })

    let smoothnessSlider: SliderComponent
    new Setting(containerEl)
      .setName('Mouse Scroll Smoothness')
      .addExtraButton(button => {
        button
          .setIcon('reset')
          .setTooltip('Restore default')
          .onClick(async () => {
            this.plugin.settings.smoothness = DEFAULT_SMOOTHNESS
            smoothnessSlider.setValue(DEFAULT_SMOOTHNESS)
            await this.plugin.saveSettings()
          })
      })
      .addSlider(slider => {
        smoothnessSlider = slider
        slider
          .setValue(this.plugin.settings.smoothness)
          .setLimits(1, 10, 1)
          .setDynamicTooltip()
          .onChange(async value => {
            this.plugin.settings.smoothness = value
            await this.plugin.saveSettings()
          })
      })
  }
}
