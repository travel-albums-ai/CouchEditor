import SolidChip from '@/components/SolidChip';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const countDomElements = () => document.getElementsByTagName('*').length

export default function DomCountStatus() {
  const [count, setCount] = useState(() => countDomElements())
  const { t } = useTranslation()

  useEffect(() => {
    let rafId: number | null = null

    const scheduleCountUpdate = () => {
      if (rafId !== null) {
        return
      }

      rafId = window.requestAnimationFrame(() => {
        rafId = null
        setCount(countDomElements())
      })
    }

    const observer = new MutationObserver(() => {
      scheduleCountUpdate()
    })

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    })

    scheduleCountUpdate()

    return () => {
      observer.disconnect()
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId)
      }
    }
  }, [])

  return (
    <SolidChip
      count={count}
      label={"DOM/e"}
      variant="text"
      minWidth={80}
      tooltip={t('domElementsTooltip')}
    />
  )
}
