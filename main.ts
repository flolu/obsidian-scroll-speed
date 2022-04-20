import {App, Plugin, PluginSettingTab, Setting, SliderComponent} from 'obsidian'

interface AugmentedWheelEvent extends WheelEvent {
  path: Element[]
}

interface Settings {
  speed: number
  altMultiplier: number
  smoothness: number
}

const DEFAULT_SETTINGS: Settings = {
  speed: 5,
  altMultiplier: 5,
  smoothness: 3,
}

export default class ScrollSpeed extends Plugin {
  settings: Settings

  async onload() {
    await this.loadSettings()
    this.addSettingTab(new SettingsTab(this.app, this))
    window.addEventListener('wheel', this.scrollListener.bind(this), {passive: false})
  }

  scrollListener(event: AugmentedWheelEvent) {
    event.preventDefault()

    let {deltaX, deltaY} = event

    if (event.shiftKey) {
      deltaX = deltaX || deltaY
      deltaY = 0
    }

    if (event.altKey) {
      deltaX *= this.settings.altMultiplier
      deltaY *= this.settings.altMultiplier
    }

    const isHorizontal = deltaX && !deltaY

    for (const element of event.path) {
      if (this.isScrollable(element, isHorizontal)) {
        // TODO scroll animation https://stackoverflow.com/a/47206289/8586803
        element.scrollBy(deltaX * this.settings.speed, deltaY * this.settings.speed)
        break
      }
    }
  }

  isScrollable(element: Element, horizontal: boolean) {
    return (
      this.isContentOverflowing(element, horizontal) && this.hasOverflowStyle(element, horizontal)
    )
  }

  isContentOverflowing(element: Element, horizontal: boolean) {
    const client = horizontal ? element.clientWidth : element.clientHeight
    const scroll = horizontal ? element.scrollWidth : element.scrollHeight
    return client < scroll
  }

  hasOverflowStyle(element: Element, horizontal: boolean) {
    const style = getComputedStyle(element)
    const overflow = style.getPropertyValue(horizontal ? 'overflow-x' : 'overflow-y')
    return /^(scroll|auto)$/.test(overflow)
  }

  onunload() {
    window.removeEventListener('wheel', this.scrollListener)
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
      .setDesc('1 is the default scroll speed, higher is faster')
      .addExtraButton(button => {
        button
          .setIcon('reset')
          .setTooltip('Restore default')
          .onClick(async () => {
            this.plugin.settings.speed = DEFAULT_SETTINGS.speed
            speedSlider.setValue(DEFAULT_SETTINGS.speed)
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

    let altMultiplierSlider: SliderComponent
    new Setting(containerEl)
      .setName('Alt Multiplier')
      .setDesc('Multiply scroll speed when the ALT key is pressed')
      .addExtraButton(button => {
        button
          .setIcon('reset')
          .setTooltip('Restore default')
          .onClick(async () => {
            this.plugin.settings.altMultiplier = DEFAULT_SETTINGS.altMultiplier
            altMultiplierSlider.setValue(DEFAULT_SETTINGS.altMultiplier)
            await this.plugin.saveSettings()
          })
      })
      .addSlider(slider => {
        altMultiplierSlider = slider
        slider
          .setValue(this.plugin.settings.altMultiplier)
          .setLimits(1, 10, 1)
          .setDynamicTooltip()
          .onChange(async value => {
            this.plugin.settings.altMultiplier = value
            await this.plugin.saveSettings()
          })
      })

    // let smoothnessSlider: SliderComponent
    // new Setting(containerEl)
    //   .setName('Mouse Scroll Smoothness')
    //   .addExtraButton(button => {
    //     button
    //       .setIcon('reset')
    //       .setTooltip('Restore default')
    //       .onClick(async () => {
    //         this.plugin.settings.smoothness = DEFAULT_SETTINGS.smoothness
    //         smoothnessSlider.setValue(DEFAULT_SETTINGS.smoothness)
    //         await this.plugin.saveSettings()
    //       })
    //   })
    //   .addSlider(slider => {
    //     smoothnessSlider = slider
    //     slider
    //       .setValue(this.plugin.settings.smoothness)
    //       .setLimits(1, 10, 1)
    //       .setDynamicTooltip()
    //       .onChange(async value => {
    //         this.plugin.settings.smoothness = value
    //         await this.plugin.saveSettings()
    //       })
    //   })
  }
}
