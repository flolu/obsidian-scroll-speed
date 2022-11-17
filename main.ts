import {
  App,
  Plugin,
  PluginSettingTab,
  Setting,
  SliderComponent,
  ToggleComponent,
  WorkspaceWindow,
} from 'obsidian'

interface AugmentedWheelEvent extends WheelEvent {
  path: Element[]
  wheelDeltaY: number
  wheelDeltaX: number
}

interface Settings {
  speed: number
  altMultiplier: number
  enableAnimations: boolean
}

const DEFAULT_SETTINGS: Settings = {
  speed: 5,
  altMultiplier: 5,
  enableAnimations: true,
}

export default class ScrollSpeed extends Plugin {
  settings: Settings

  animationSmoothness = 3
  positionY = 0
  isMoving = false
  target: Element | undefined
  scrollDistance = 0

  async onload() {
    await this.loadSettings()
    this.addSettingTab(new SettingsTab(this.app, this))

    this.registerDomEvent(window, 'wheel', this.scrollListener, {passive: false})

    // @ts-ignore
    this.registerEvent(this.app.on('window-open', this.windowOpenListener))
  }

  windowOpenListener = (_win: WorkspaceWindow, window: Window) => {
    this.registerDomEvent(window, 'wheel', this.scrollListener, {passive: false})
  }

  scrollListener = (event: AugmentedWheelEvent) => {
    event.preventDefault()

    if (this.isTrackPadUsed(event) || !this.settings.enableAnimations) {
      this.scrollWithoutAnimation(event)
    } else {
      this.scrollWithAnimation(event)
    }
  }

  scrollWithoutAnimation(event: AugmentedWheelEvent) {
    this.target = event.path.find(el => el.scrollHeight > el.clientHeight)

    const acceleration = event.altKey
      ? this.settings.speed * this.settings.altMultiplier
      : this.settings.speed

    this.target.scrollBy(event.deltaX * acceleration, event.deltaY * acceleration)
  }

  scrollWithAnimation(event: AugmentedWheelEvent) {
    this.target = event.path.find(el => el.scrollHeight > el.clientHeight)

    // TODO horizontal scrolling, too
    this.positionY = this.target.scrollTop

    const acceleration = event.altKey
      ? Math.pow(this.settings.speed * this.settings.altMultiplier, 1.1)
      : Math.pow(this.settings.speed, 1.1)

    this.positionY += event.deltaY * acceleration
    this.scrollDistance = event.deltaY * acceleration

    if (!this.isMoving) {
      this.isMoving = true

      this.updateScrollAnimation()
    }
  }

  updateScrollAnimation() {
    if (!this.isMoving || !this.target) {
      this.stopScrollAnimation()
    }

    const divider = Math.pow(this.animationSmoothness, 1.3)
    const delta = this.positionY - this.target.scrollTop
    this.target.scrollTop += delta / divider

    // Boundary at the top
    if (delta < 0 && this.positionY < 0 && this.target.scrollTop === 0) {
      return this.stopScrollAnimation()
    }

    // Boundary at the bottom
    if (
      delta > 0 &&
      this.positionY > this.target.scrollHeight - this.target.clientHeight / 2 - this.scrollDistance
    ) {
      return this.stopScrollAnimation()
    }

    // Stop when movement delta is approaching zero
    if (Math.abs(delta) < this.scrollDistance * 0.015 || Math.abs(delta) < 1) {
      return this.stopScrollAnimation()
    }

    window.requestAnimationFrame(this.updateScrollAnimation.bind(this))
  }

  stopScrollAnimation() {
    this.isMoving = false
    this.scrollDistance = 0
    if (this.target) this.target = undefined
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

  isTrackPadUsed(event: AugmentedWheelEvent) {
    // https://stackoverflow.com/a/62415754/8586803

    let isTrackPad = false
    if (event.wheelDeltaY) {
      if (event.wheelDeltaY === event.deltaY * -3) {
        isTrackPad = true
      }
    } else if (event.deltaMode === 0) {
      isTrackPad = true
    }

    return isTrackPad
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

    let animationToggle: ToggleComponent
    new Setting(containerEl)
      .setName('Enable Animation')
      .setDesc('Toggle smooth scrolling animations')
      .addExtraButton(button => {
        button
          .setIcon('reset')
          .setTooltip('Restore default')
          .onClick(async () => {
            this.plugin.settings.enableAnimations = DEFAULT_SETTINGS.enableAnimations
            animationToggle.setValue(DEFAULT_SETTINGS.enableAnimations)
            await this.plugin.saveSettings()
          })
      })
      .addToggle(toggle => {
        animationToggle = toggle
        toggle.setValue(this.plugin.settings.enableAnimations).onChange(async value => {
          this.plugin.settings.enableAnimations = value
          await this.plugin.saveSettings()
        })
      })
  }
}
