import { useSearchParams } from 'react-router'

const TAB_PARAM = 'tab'

export function useTabSearchParam<const TTab extends string>(tabs: readonly TTab[], defaultTab: TTab) {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedTab = searchParams.get(TAB_PARAM)
  const activeTab = tabs.find((tab) => tab === requestedTab) ?? defaultTab

  const setActiveTab = (value: unknown) => {
    const nextTab = tabs.find((tab) => tab === value)
    if (!nextTab) return

    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (nextTab === defaultTab) next.delete(TAB_PARAM)
        else next.set(TAB_PARAM, nextTab)
        return next
      },
      { replace: true },
    )
  }

  return { activeTab, setActiveTab }
}
