import { injectGlobal } from "@emotion/css"
import { mergeProps } from "@ui-machines/core"
import { nextTick } from "@ui-machines/dom-utils"
import * as Menu from "@ui-machines/menu"
import { normalizeProps, useMachine, useSetup, VuePropTypes } from "@ui-machines/vue"
import { computed, defineComponent, onMounted, Teleport, Fragment, h } from "vue"
import { menuData } from "../../../../shared/data"
import { menuStyle } from "../../../../shared/style"
import { StateVisualizer } from "../components/state-visualizer"

injectGlobal(menuStyle)

export default defineComponent({
  name: "NestedMenu",
  setup() {
    const [state, send, machine] = useMachine(Menu.machine)
    const rootRef = useSetup({ send, id: "1" })

    const [subState, subSend, subMachine] = useMachine(Menu.machine)
    const subRef = useSetup({ send: subSend, id: "2" })

    const [sub2State, sub2Send, sub2Machine] = useMachine(Menu.machine)
    const sub2Ref = useSetup({ send: sub2Send, id: "3" })

    const root = computed(() => Menu.connect<VuePropTypes>(state.value, send, normalizeProps))
    const sub = computed(() => Menu.connect<VuePropTypes>(subState.value, subSend, normalizeProps))
    const sub2 = computed(() => Menu.connect<VuePropTypes>(sub2State.value, sub2Send, normalizeProps))

    onMounted(() => {
      nextTick(() => {
        root.value.setChild(subMachine)
        sub.value.setParent(machine)
      })
    })

    onMounted(() => {
      nextTick(() => {
        sub.value.setChild(sub2Machine)
        sub2.value.setParent(subMachine)
      })
    })

    const triggerItemProps = computed(() =>
      mergeProps(root.value.getItemProps({ id: sub.value.triggerProps.id! }), sub.value.triggerProps),
    )
    const triggerItem2Props = computed(() =>
      mergeProps(sub.value.getItemProps({ id: sub2.value.triggerProps.id! }), sub2.value.triggerProps),
    )

    const [level1, level2, level3] = menuData

    return () => {
      return (
        <>
          <button data-testid="trigger" {...root.value.triggerProps}>
            Click me
          </button>

          <Teleport to="body">
            <div {...root.value.positionerProps}>
              <ul data-testid="menu" ref={rootRef} {...root.value.contentProps}>
                {level1.map((item) => {
                  const props = item.trigger ? triggerItemProps.value : root.value.getItemProps({ id: item.id })
                  return (
                    <li key={item.id} data-testid={item.id} {...(props as any)}>
                      {item.label}
                    </li>
                  )
                })}
              </ul>
            </div>
          </Teleport>

          <Teleport to="body">
            <div {...sub.value.positionerProps}>
              <ul ref={subRef} data-testid="more-tools-submenu" {...sub.value.contentProps}>
                {level2.map((item) => {
                  const props = item.trigger ? triggerItem2Props.value : sub.value.getItemProps({ id: item.id })
                  return (
                    <li key={item.id} data-testid={item.id} {...(props as any)}>
                      {item.label}
                    </li>
                  )
                })}
              </ul>
            </div>
          </Teleport>

          <Teleport to="body">
            <div {...sub2.value.positionerProps}>
              <ul ref={sub2Ref} data-testid="open-nested-submenu" {...sub2.value.contentProps}>
                {level3.map((item) => (
                  <li key={item.id} data-testid={item.id} {...sub2.value.getItemProps({ id: item.id })}>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </Teleport>

          <StateVisualizer state={state} label="Root Machine" placement="left" />
          <StateVisualizer state={subState} label="Sub Machine" placement="left" offset="420px" />
          <StateVisualizer state={sub2State} label="Sub2 Machine" placement="left" offset="800px" />
        </>
      )
    }
  },
})