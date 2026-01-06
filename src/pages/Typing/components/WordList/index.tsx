import { TypingContext, TypingStateActionType } from '../../store'
import WordCard from './WordCard'
import Drawer from '@/components/Drawer'
import Tooltip from '@/components/Tooltip'
import { currentChapterAtom, currentDictInfoAtom, isReviewModeAtom } from '@/store'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { atom, useAtomValue } from 'jotai'
import { useContext, useEffect, useRef, useState } from 'react'
import ListIcon from '~icons/tabler/list'
import IconX from '~icons/tabler/x'

const currentDictTitle = atom((get) => {
  const isReviewMode = get(isReviewModeAtom)

  if (isReviewMode) {
    return `${get(currentDictInfoAtom).name} 错题复习`
  } else {
    return `${get(currentDictInfoAtom).name} 第 ${get(currentChapterAtom) + 1} 章`
  }
})

export default function WordList() {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state, dispatch } = useContext(TypingContext)!

  const [isOpen, setIsOpen] = useState(false)
  const currentDictTitleValue = useAtomValue(currentDictTitle)
  const activeWordRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
    dispatch({ type: TypingStateActionType.SET_IS_TYPING, payload: false })
  }

  // 设置 ref 的回调函数
  const setActiveWordRef = (index: number) => (el: HTMLDivElement | null) => {
    if (el) {
      activeWordRefs.current.set(index, el)
    } else {
      activeWordRefs.current.delete(index)
    }
  }

  // 当 Drawer 打开时，自动滚动到当前单词
  useEffect(() => {
    if (isOpen) {
      const activeIndex = state.chapterData.index
      const activeElement = activeWordRefs.current.get(activeIndex)
      if (activeElement) {
        // 延迟一下，确保 DOM 已经渲染
        setTimeout(() => {
          activeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
        }, 100)
      }
    }
  }, [isOpen, state.chapterData.index])

  // 当单词索引变化时，自动滚动到当前单词
  useEffect(() => {
    if (isOpen) {
      const activeIndex = state.chapterData.index
      const activeElement = activeWordRefs.current.get(activeIndex)
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    }
  }, [state.chapterData.index, isOpen])

  return (
    <>
      <Tooltip content="List" placement="top" className="!absolute left-5 top-[50%] z-20">
        <button
          type="button"
          onClick={openModal}
          className="fixed left-0 top-[50%] z-20 rounded-lg rounded-l-none bg-indigo-50 px-2 py-3 text-lg hover:bg-indigo-200 focus:outline-none dark:bg-indigo-900 dark:hover:bg-indigo-800"
        >
          <ListIcon className="h-6 w-6 text-lg text-indigo-500 dark:text-white" />
        </button>
      </Tooltip>

      <Drawer 
        open={isOpen} 
        onClose={() => {}} 
        classNames="bg-stone-50 dark:bg-gray-900"
        showBackdrop={false}
        topOffset="8rem"
      >
        <h3 className="flex items-center justify-between p-4 text-lg font-medium leading-6 dark:text-gray-50">
          {currentDictTitleValue}
          <IconX onClick={closeModal} className="cursor-pointer" />
        </h3>
        <ScrollArea.Root className="flex-1 select-none overflow-y-auto ">
          <ScrollArea.Viewport className="h-full w-full px-3">
            <div className="flex h-full w-full flex-col gap-1">
              {state.chapterData.words?.map((word, index) => {
                const isActive = state.chapterData.index === index
                return (
                  <div
                    key={`${word.name}_${index}`}
                    ref={setActiveWordRef(index)}
                  >
                    <WordCard word={word} isActive={isActive} />
                  </div>
                )
              })}
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar className="flex touch-none select-none bg-transparent " orientation="vertical"></ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </Drawer>
    </>
  )
}
