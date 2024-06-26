import { AiFillCode } from "react-icons/ai"
import { FaVuejs } from "react-icons/fa"
import { SiReact } from "react-icons/si"

export const frameworks = {
  react: { icon: SiReact, label: "React" },
  "vue-jsx": { icon: FaVuejs, label: "Vue (JSX)" },
  "vue-sfc": { icon: FaVuejs, label: "Vue (SFC)" },
  solid: { icon: AiFillCode, label: "Solid" },
  svelte: { icon: AiFillCode, label: "Svelte" },
}

export const FRAMEWORKS = [
  "react",
  "solid",
  "vue-jsx",
  "vue-sfc",
  "svelte",
] as const

export type Framework = keyof typeof frameworks

export function isFramework(str: string): str is Framework {
  return FRAMEWORKS.includes(str as any)
}

export function getFrameworkIndex(str: string): number {
  return FRAMEWORKS.indexOf(str as any)
}
