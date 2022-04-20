var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// main.ts
__export(exports, {
  default: () => ScrollSpeed
});
var import_obsidian = __toModule(require("obsidian"));
var DEFAULT_SETTINGS = {
  speed: 5,
  altMultiplier: 5,
  smoothness: 3
};
var ScrollSpeed = class extends import_obsidian.Plugin {
  onload() {
    return __async(this, null, function* () {
      yield this.loadSettings();
      this.addSettingTab(new SettingsTab(this.app, this));
      window.addEventListener("wheel", this.scrollListener.bind(this), { passive: false });
    });
  }
  scrollListener(event) {
    event.preventDefault();
    let { deltaX, deltaY } = event;
    if (event.shiftKey) {
      deltaX = deltaX || deltaY;
      deltaY = 0;
    }
    if (event.altKey) {
      deltaX *= this.settings.altMultiplier;
      deltaY *= this.settings.altMultiplier;
    }
    const isHorizontal = deltaX && !deltaY;
    for (const element of event.path) {
      if (this.isScrollable(element, isHorizontal)) {
        element.scrollBy(deltaX * this.settings.speed, deltaY * this.settings.speed);
        break;
      }
    }
  }
  isScrollable(element, horizontal) {
    return this.isContentOverflowing(element, horizontal) && this.hasOverflowStyle(element, horizontal);
  }
  isContentOverflowing(element, horizontal) {
    const client = horizontal ? element.clientWidth : element.clientHeight;
    const scroll = horizontal ? element.scrollWidth : element.scrollHeight;
    return client < scroll;
  }
  hasOverflowStyle(element, horizontal) {
    const style = getComputedStyle(element);
    const overflow = style.getPropertyValue(horizontal ? "overflow-x" : "overflow-y");
    return /^(scroll|auto)$/.test(overflow);
  }
  onunload() {
    window.removeEventListener("wheel", this.scrollListener);
  }
  loadSettings() {
    return __async(this, null, function* () {
      this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
    });
  }
  saveSettings() {
    return __async(this, null, function* () {
      yield this.saveData(this.settings);
    });
  }
};
var SettingsTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    let speedSlider;
    new import_obsidian.Setting(containerEl).setName("Mouse Scroll Speed").setDesc("1 is the default scroll speed, higher is faster").addExtraButton((button) => {
      button.setIcon("reset").setTooltip("Restore default").onClick(() => __async(this, null, function* () {
        this.plugin.settings.speed = DEFAULT_SETTINGS.speed;
        speedSlider.setValue(DEFAULT_SETTINGS.speed);
        yield this.plugin.saveSettings();
      }));
    }).addSlider((slider) => {
      speedSlider = slider;
      slider.setValue(this.plugin.settings.speed).setLimits(1, 10, 1).setDynamicTooltip().onChange((value) => __async(this, null, function* () {
        this.plugin.settings.speed = value;
        yield this.plugin.saveSettings();
      }));
    });
    let altMultiplierSlider;
    new import_obsidian.Setting(containerEl).setName("Alt Multiplier").setDesc("Multiply scroll speed when the ALT key is pressed").addExtraButton((button) => {
      button.setIcon("reset").setTooltip("Restore default").onClick(() => __async(this, null, function* () {
        this.plugin.settings.altMultiplier = DEFAULT_SETTINGS.altMultiplier;
        altMultiplierSlider.setValue(DEFAULT_SETTINGS.altMultiplier);
        yield this.plugin.saveSettings();
      }));
    }).addSlider((slider) => {
      altMultiplierSlider = slider;
      slider.setValue(this.plugin.settings.altMultiplier).setLimits(1, 10, 1).setDynamicTooltip().onChange((value) => __async(this, null, function* () {
        this.plugin.settings.altMultiplier = value;
        yield this.plugin.saveSettings();
      }));
    });
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHtBcHAsIFBsdWdpbiwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZywgU2xpZGVyQ29tcG9uZW50fSBmcm9tICdvYnNpZGlhbidcclxuXHJcbmludGVyZmFjZSBBdWdtZW50ZWRXaGVlbEV2ZW50IGV4dGVuZHMgV2hlZWxFdmVudCB7XHJcbiAgcGF0aDogRWxlbWVudFtdXHJcbn1cclxuXHJcbmludGVyZmFjZSBTZXR0aW5ncyB7XHJcbiAgc3BlZWQ6IG51bWJlclxyXG4gIGFsdE11bHRpcGxpZXI6IG51bWJlclxyXG4gIHNtb290aG5lc3M6IG51bWJlclxyXG59XHJcblxyXG5jb25zdCBERUZBVUxUX1NFVFRJTkdTOiBTZXR0aW5ncyA9IHtcclxuICBzcGVlZDogNSxcclxuICBhbHRNdWx0aXBsaWVyOiA1LFxyXG4gIHNtb290aG5lc3M6IDMsXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjcm9sbFNwZWVkIGV4dGVuZHMgUGx1Z2luIHtcclxuICBzZXR0aW5nczogU2V0dGluZ3NcclxuXHJcbiAgYXN5bmMgb25sb2FkKCkge1xyXG4gICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKVxyXG4gICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBTZXR0aW5nc1RhYih0aGlzLmFwcCwgdGhpcykpXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCB0aGlzLnNjcm9sbExpc3RlbmVyLmJpbmQodGhpcyksIHtwYXNzaXZlOiBmYWxzZX0pXHJcbiAgfVxyXG5cclxuICBzY3JvbGxMaXN0ZW5lcihldmVudDogQXVnbWVudGVkV2hlZWxFdmVudCkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cclxuICAgIGxldCB7ZGVsdGFYLCBkZWx0YVl9ID0gZXZlbnRcclxuXHJcbiAgICBpZiAoZXZlbnQuc2hpZnRLZXkpIHtcclxuICAgICAgZGVsdGFYID0gZGVsdGFYIHx8IGRlbHRhWVxyXG4gICAgICBkZWx0YVkgPSAwXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGV2ZW50LmFsdEtleSkge1xyXG4gICAgICBkZWx0YVggKj0gdGhpcy5zZXR0aW5ncy5hbHRNdWx0aXBsaWVyXHJcbiAgICAgIGRlbHRhWSAqPSB0aGlzLnNldHRpbmdzLmFsdE11bHRpcGxpZXJcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBpc0hvcml6b250YWwgPSBkZWx0YVggJiYgIWRlbHRhWVxyXG5cclxuICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBldmVudC5wYXRoKSB7XHJcbiAgICAgIGlmICh0aGlzLmlzU2Nyb2xsYWJsZShlbGVtZW50LCBpc0hvcml6b250YWwpKSB7XHJcbiAgICAgICAgLy8gVE9ETyBzY3JvbGwgYW5pbWF0aW9uIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS80NzIwNjI4OS84NTg2ODAzXHJcbiAgICAgICAgZWxlbWVudC5zY3JvbGxCeShkZWx0YVggKiB0aGlzLnNldHRpbmdzLnNwZWVkLCBkZWx0YVkgKiB0aGlzLnNldHRpbmdzLnNwZWVkKVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlzU2Nyb2xsYWJsZShlbGVtZW50OiBFbGVtZW50LCBob3Jpem9udGFsOiBib29sZWFuKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICB0aGlzLmlzQ29udGVudE92ZXJmbG93aW5nKGVsZW1lbnQsIGhvcml6b250YWwpICYmIHRoaXMuaGFzT3ZlcmZsb3dTdHlsZShlbGVtZW50LCBob3Jpem9udGFsKVxyXG4gICAgKVxyXG4gIH1cclxuXHJcbiAgaXNDb250ZW50T3ZlcmZsb3dpbmcoZWxlbWVudDogRWxlbWVudCwgaG9yaXpvbnRhbDogYm9vbGVhbikge1xyXG4gICAgY29uc3QgY2xpZW50ID0gaG9yaXpvbnRhbCA/IGVsZW1lbnQuY2xpZW50V2lkdGggOiBlbGVtZW50LmNsaWVudEhlaWdodFxyXG4gICAgY29uc3Qgc2Nyb2xsID0gaG9yaXpvbnRhbCA/IGVsZW1lbnQuc2Nyb2xsV2lkdGggOiBlbGVtZW50LnNjcm9sbEhlaWdodFxyXG4gICAgcmV0dXJuIGNsaWVudCA8IHNjcm9sbFxyXG4gIH1cclxuXHJcbiAgaGFzT3ZlcmZsb3dTdHlsZShlbGVtZW50OiBFbGVtZW50LCBob3Jpem9udGFsOiBib29sZWFuKSB7XHJcbiAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudClcclxuICAgIGNvbnN0IG92ZXJmbG93ID0gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShob3Jpem9udGFsID8gJ292ZXJmbG93LXgnIDogJ292ZXJmbG93LXknKVxyXG4gICAgcmV0dXJuIC9eKHNjcm9sbHxhdXRvKSQvLnRlc3Qob3ZlcmZsb3cpXHJcbiAgfVxyXG5cclxuICBvbnVubG9hZCgpIHtcclxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd3aGVlbCcsIHRoaXMuc2Nyb2xsTGlzdGVuZXIpXHJcbiAgfVxyXG5cclxuICBhc3luYyBsb2FkU2V0dGluZ3MoKSB7XHJcbiAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgYXdhaXQgdGhpcy5sb2FkRGF0YSgpKVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgc2F2ZVNldHRpbmdzKCkge1xyXG4gICAgYXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKVxyXG4gIH1cclxufVxyXG5cclxuY2xhc3MgU2V0dGluZ3NUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcclxuICBwbHVnaW46IFNjcm9sbFNwZWVkXHJcblxyXG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IFNjcm9sbFNwZWVkKSB7XHJcbiAgICBzdXBlcihhcHAsIHBsdWdpbilcclxuICAgIHRoaXMucGx1Z2luID0gcGx1Z2luXHJcbiAgfVxyXG5cclxuICBkaXNwbGF5KCk6IHZvaWQge1xyXG4gICAgY29uc3Qge2NvbnRhaW5lckVsfSA9IHRoaXNcclxuICAgIGNvbnRhaW5lckVsLmVtcHR5KClcclxuXHJcbiAgICBsZXQgc3BlZWRTbGlkZXI6IFNsaWRlckNvbXBvbmVudFxyXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgIC5zZXROYW1lKCdNb3VzZSBTY3JvbGwgU3BlZWQnKVxyXG4gICAgICAuc2V0RGVzYygnMSBpcyB0aGUgZGVmYXVsdCBzY3JvbGwgc3BlZWQsIGhpZ2hlciBpcyBmYXN0ZXInKVxyXG4gICAgICAuYWRkRXh0cmFCdXR0b24oYnV0dG9uID0+IHtcclxuICAgICAgICBidXR0b25cclxuICAgICAgICAgIC5zZXRJY29uKCdyZXNldCcpXHJcbiAgICAgICAgICAuc2V0VG9vbHRpcCgnUmVzdG9yZSBkZWZhdWx0JylcclxuICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3BlZWQgPSBERUZBVUxUX1NFVFRJTkdTLnNwZWVkXHJcbiAgICAgICAgICAgIHNwZWVkU2xpZGVyLnNldFZhbHVlKERFRkFVTFRfU0VUVElOR1Muc3BlZWQpXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICB9KVxyXG4gICAgICAuYWRkU2xpZGVyKHNsaWRlciA9PiB7XHJcbiAgICAgICAgc3BlZWRTbGlkZXIgPSBzbGlkZXJcclxuICAgICAgICBzbGlkZXJcclxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zcGVlZClcclxuICAgICAgICAgIC5zZXRMaW1pdHMoMSwgMTAsIDEpXHJcbiAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxyXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHZhbHVlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3BlZWQgPSB2YWx1ZVxyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgfSlcclxuXHJcbiAgICBsZXQgYWx0TXVsdGlwbGllclNsaWRlcjogU2xpZGVyQ29tcG9uZW50XHJcbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgLnNldE5hbWUoJ0FsdCBNdWx0aXBsaWVyJylcclxuICAgICAgLnNldERlc2MoJ011bHRpcGx5IHNjcm9sbCBzcGVlZCB3aGVuIHRoZSBBTFQga2V5IGlzIHByZXNzZWQnKVxyXG4gICAgICAuYWRkRXh0cmFCdXR0b24oYnV0dG9uID0+IHtcclxuICAgICAgICBidXR0b25cclxuICAgICAgICAgIC5zZXRJY29uKCdyZXNldCcpXHJcbiAgICAgICAgICAuc2V0VG9vbHRpcCgnUmVzdG9yZSBkZWZhdWx0JylcclxuICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuYWx0TXVsdGlwbGllciA9IERFRkFVTFRfU0VUVElOR1MuYWx0TXVsdGlwbGllclxyXG4gICAgICAgICAgICBhbHRNdWx0aXBsaWVyU2xpZGVyLnNldFZhbHVlKERFRkFVTFRfU0VUVElOR1MuYWx0TXVsdGlwbGllcilcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKClcclxuICAgICAgICAgIH0pXHJcbiAgICAgIH0pXHJcbiAgICAgIC5hZGRTbGlkZXIoc2xpZGVyID0+IHtcclxuICAgICAgICBhbHRNdWx0aXBsaWVyU2xpZGVyID0gc2xpZGVyXHJcbiAgICAgICAgc2xpZGVyXHJcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuYWx0TXVsdGlwbGllcilcclxuICAgICAgICAgIC5zZXRMaW1pdHMoMSwgMTAsIDEpXHJcbiAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxyXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHZhbHVlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuYWx0TXVsdGlwbGllciA9IHZhbHVlXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICB9KVxyXG5cclxuICAgIC8vIGxldCBzbW9vdGhuZXNzU2xpZGVyOiBTbGlkZXJDb21wb25lbnRcclxuICAgIC8vIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgLy8gICAuc2V0TmFtZSgnTW91c2UgU2Nyb2xsIFNtb290aG5lc3MnKVxyXG4gICAgLy8gICAuYWRkRXh0cmFCdXR0b24oYnV0dG9uID0+IHtcclxuICAgIC8vICAgICBidXR0b25cclxuICAgIC8vICAgICAgIC5zZXRJY29uKCdyZXNldCcpXHJcbiAgICAvLyAgICAgICAuc2V0VG9vbHRpcCgnUmVzdG9yZSBkZWZhdWx0JylcclxuICAgIC8vICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcclxuICAgIC8vICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc21vb3RobmVzcyA9IERFRkFVTFRfU0VUVElOR1Muc21vb3RobmVzc1xyXG4gICAgLy8gICAgICAgICBzbW9vdGhuZXNzU2xpZGVyLnNldFZhbHVlKERFRkFVTFRfU0VUVElOR1Muc21vb3RobmVzcylcclxuICAgIC8vICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKClcclxuICAgIC8vICAgICAgIH0pXHJcbiAgICAvLyAgIH0pXHJcbiAgICAvLyAgIC5hZGRTbGlkZXIoc2xpZGVyID0+IHtcclxuICAgIC8vICAgICBzbW9vdGhuZXNzU2xpZGVyID0gc2xpZGVyXHJcbiAgICAvLyAgICAgc2xpZGVyXHJcbiAgICAvLyAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc21vb3RobmVzcylcclxuICAgIC8vICAgICAgIC5zZXRMaW1pdHMoMSwgMTAsIDEpXHJcbiAgICAvLyAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxyXG4gICAgLy8gICAgICAgLm9uQ2hhbmdlKGFzeW5jIHZhbHVlID0+IHtcclxuICAgIC8vICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc21vb3RobmVzcyA9IHZhbHVlXHJcbiAgICAvLyAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpXHJcbiAgICAvLyAgICAgICB9KVxyXG4gICAgLy8gICB9KVxyXG4gIH1cclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQSxzQkFBc0U7QUFZdEUsSUFBTSxtQkFBNkI7QUFBQSxFQUNqQyxPQUFPO0FBQUEsRUFDUCxlQUFlO0FBQUEsRUFDZixZQUFZO0FBQUE7QUFHZCxnQ0FBeUMsdUJBQU87QUFBQSxFQUd4QyxTQUFTO0FBQUE7QUFDYixZQUFNLEtBQUs7QUFDWCxXQUFLLGNBQWMsSUFBSSxZQUFZLEtBQUssS0FBSztBQUM3QyxhQUFPLGlCQUFpQixTQUFTLEtBQUssZUFBZSxLQUFLLE9BQU8sRUFBQyxTQUFTO0FBQUE7QUFBQTtBQUFBLEVBRzdFLGVBQWUsT0FBNEI7QUFDekMsVUFBTTtBQUVOLFFBQUksRUFBQyxRQUFRLFdBQVU7QUFFdkIsUUFBSSxNQUFNLFVBQVU7QUFDbEIsZUFBUyxVQUFVO0FBQ25CLGVBQVM7QUFBQTtBQUdYLFFBQUksTUFBTSxRQUFRO0FBQ2hCLGdCQUFVLEtBQUssU0FBUztBQUN4QixnQkFBVSxLQUFLLFNBQVM7QUFBQTtBQUcxQixVQUFNLGVBQWUsVUFBVSxDQUFDO0FBRWhDLGVBQVcsV0FBVyxNQUFNLE1BQU07QUFDaEMsVUFBSSxLQUFLLGFBQWEsU0FBUyxlQUFlO0FBRTVDLGdCQUFRLFNBQVMsU0FBUyxLQUFLLFNBQVMsT0FBTyxTQUFTLEtBQUssU0FBUztBQUN0RTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS04sYUFBYSxTQUFrQixZQUFxQjtBQUNsRCxXQUNFLEtBQUsscUJBQXFCLFNBQVMsZUFBZSxLQUFLLGlCQUFpQixTQUFTO0FBQUE7QUFBQSxFQUlyRixxQkFBcUIsU0FBa0IsWUFBcUI7QUFDMUQsVUFBTSxTQUFTLGFBQWEsUUFBUSxjQUFjLFFBQVE7QUFDMUQsVUFBTSxTQUFTLGFBQWEsUUFBUSxjQUFjLFFBQVE7QUFDMUQsV0FBTyxTQUFTO0FBQUE7QUFBQSxFQUdsQixpQkFBaUIsU0FBa0IsWUFBcUI7QUFDdEQsVUFBTSxRQUFRLGlCQUFpQjtBQUMvQixVQUFNLFdBQVcsTUFBTSxpQkFBaUIsYUFBYSxlQUFlO0FBQ3BFLFdBQU8sa0JBQWtCLEtBQUs7QUFBQTtBQUFBLEVBR2hDLFdBQVc7QUFDVCxXQUFPLG9CQUFvQixTQUFTLEtBQUs7QUFBQTtBQUFBLEVBR3JDLGVBQWU7QUFBQTtBQUNuQixXQUFLLFdBQVcsT0FBTyxPQUFPLElBQUksa0JBQWtCLE1BQU0sS0FBSztBQUFBO0FBQUE7QUFBQSxFQUczRCxlQUFlO0FBQUE7QUFDbkIsWUFBTSxLQUFLLFNBQVMsS0FBSztBQUFBO0FBQUE7QUFBQTtBQUk3QixnQ0FBMEIsaUNBQWlCO0FBQUEsRUFHekMsWUFBWSxLQUFVLFFBQXFCO0FBQ3pDLFVBQU0sS0FBSztBQUNYLFNBQUssU0FBUztBQUFBO0FBQUEsRUFHaEIsVUFBZ0I7QUFDZCxVQUFNLEVBQUMsZ0JBQWU7QUFDdEIsZ0JBQVk7QUFFWixRQUFJO0FBQ0osUUFBSSx3QkFBUSxhQUNULFFBQVEsc0JBQ1IsUUFBUSxtREFDUixlQUFlLFlBQVU7QUFDeEIsYUFDRyxRQUFRLFNBQ1IsV0FBVyxtQkFDWCxRQUFRLE1BQVk7QUFDbkIsYUFBSyxPQUFPLFNBQVMsUUFBUSxpQkFBaUI7QUFDOUMsb0JBQVksU0FBUyxpQkFBaUI7QUFDdEMsY0FBTSxLQUFLLE9BQU87QUFBQTtBQUFBLE9BR3ZCLFVBQVUsWUFBVTtBQUNuQixvQkFBYztBQUNkLGFBQ0csU0FBUyxLQUFLLE9BQU8sU0FBUyxPQUM5QixVQUFVLEdBQUcsSUFBSSxHQUNqQixvQkFDQSxTQUFTLENBQU0sVUFBUztBQUN2QixhQUFLLE9BQU8sU0FBUyxRQUFRO0FBQzdCLGNBQU0sS0FBSyxPQUFPO0FBQUE7QUFBQTtBQUkxQixRQUFJO0FBQ0osUUFBSSx3QkFBUSxhQUNULFFBQVEsa0JBQ1IsUUFBUSxxREFDUixlQUFlLFlBQVU7QUFDeEIsYUFDRyxRQUFRLFNBQ1IsV0FBVyxtQkFDWCxRQUFRLE1BQVk7QUFDbkIsYUFBSyxPQUFPLFNBQVMsZ0JBQWdCLGlCQUFpQjtBQUN0RCw0QkFBb0IsU0FBUyxpQkFBaUI7QUFDOUMsY0FBTSxLQUFLLE9BQU87QUFBQTtBQUFBLE9BR3ZCLFVBQVUsWUFBVTtBQUNuQiw0QkFBc0I7QUFDdEIsYUFDRyxTQUFTLEtBQUssT0FBTyxTQUFTLGVBQzlCLFVBQVUsR0FBRyxJQUFJLEdBQ2pCLG9CQUNBLFNBQVMsQ0FBTSxVQUFTO0FBQ3ZCLGFBQUssT0FBTyxTQUFTLGdCQUFnQjtBQUNyQyxjQUFNLEtBQUssT0FBTztBQUFBO0FBQUE7QUFBQTtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=
