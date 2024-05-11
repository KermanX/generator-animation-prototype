import { h, reactive, ref } from "vue"
import { AnimationGenerator } from "./animation"
import { RectWidget, Widget } from "./widget"

export function app(initFn: () => void) {
  const widgets: {
    instance: Widget,
    stepStart: number,
    finished: boolean,
  }[] = reactive([])
  const paused = ref(false)
  const pausedAt = ref(NaN)

  // Widget factory
  const w = {
    rect(options: Partial<RectWidget>) {
      const instance = reactive(new RectWidget(options))
      widgets.push({
        instance,
        stepStart: 0,
        finished: false,
      })
      return instance
    }
  }

  // Animation factory
  const a = {
    *sleep(ms: number): AnimationGenerator {
      yield true
      while (true) {
        if ((yield false).t > ms) return
      }
    },

    *linear(duration: number, to: any): AnimationGenerator {
      const { w } = yield true
      const old = { ...w }
      while (true) {
        const { t } = yield false
        console.log(t)
        const progress = Math.min(1, t / duration)
        if (progress >= 1) return
        for (const key in to) {
          if (typeof to[key] === 'number') {
            // @ts-ignore
            w[key] = old[key] + (to[key] - old[key]) * progress
          }
        }
      }
    },

    *effect(duration: number, map: (time: number) => void): AnimationGenerator {
      yield true
      while (true) {
        const { t } = yield false
        if (t > duration) return
        map(t)
      }
    }
  }

  function update(time: number) {
    if (!paused.value && !isNaN(pausedAt.value)) {
      widgets.forEach(w => w.stepStart += time - pausedAt.value)
      pausedAt.value = NaN
    }
    for (const widget of widgets) {
      if (widget.finished) continue
      const stepTime = time - widget.stepStart
      const { done, value } = widget.instance.generator.next({
        w: widget.instance,
        t: stepTime,
      })
      if (done) {
        widget.finished = true
      } else if (value) {
        widget.stepStart = time
      }
    }
    if (paused.value) {
      pausedAt.value = time
    } else if (widgets.some(w => !w.finished)) {
      window.requestAnimationFrame(update)
    }
  }

  function reset() {
    widgets.length = 0
    paused.value = false
    initFn()
  }

  function run() {
    reset()
    window.requestAnimationFrame(update)
  }

  function stop() {
    widgets.length = 0
    paused.value = true
    pausedAt.value = NaN
  }

  function pause() {
    paused.value = true
  }

  function resume() {
    if (!paused.value) return
    paused.value = false
    window.requestAnimationFrame(update)
  }

  function render() {
    return h(
      'div',
      {
        style: {
          width: '800px',
          height: '800px',
          position: 'relative',
          border: '1px solid black',
          backgroundColor: 'white',
        }
      },
      widgets.map(w => w.instance.render())
    )
  }

  return {
    w,
    a,
    run,
    stop,
    pause,
    resume,
    render,
  }
}
