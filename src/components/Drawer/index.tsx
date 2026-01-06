import { Transition } from '@headlessui/react'
import classNames from 'classnames'

export type Placement = 'left' | 'top' | 'right' | 'bottom'

interface DrawerProps {
  open?: boolean
  placement?: Placement
  onClose?: () => void
  children?: React.ReactNode
  classNames?: string
  showBackdrop?: boolean
  topOffset?: string
}

const transitionDirectionMap = {
  left: '-translate-x-full',
  right: 'translate-x-full',
  top: '-translate-y-full',
  bottom: 'translate-y-full',
}
export default function Drawer(props: DrawerProps) {
  const { open = false, placement = 'left', onClose, children, showBackdrop = true, topOffset = '0' } = props

  const transitionDirection = transitionDirectionMap[placement]

  if (!open) return null

  return (
    <>
      {showBackdrop && (
        <Transition
          show={open}
          appear
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="fixed inset-0 z-30 bg-black bg-opacity-25 pointer-events-auto"
          onClick={onClose}
        />
      )}

      <Transition
        show={open}
        appear
        as="div"
        enter="transition ease-out duration-300 transform"
        enterFrom={transitionDirection}
        enterTo=""
        leave="transition ease-in duration-300 transform"
        leaveFrom=""
        leaveTo={transitionDirection}
        className={classNames(
          `fixed ${placement}-0 z-30`,
          props.classNames || '',
          'flex w-[35rem] flex-col drop-shadow-2xl transition-all duration-300 ease-out pointer-events-auto',
          topOffset === '0' ? 'h-full top-0' : '',
        )}
        style={
          topOffset !== '0'
            ? {
                top: topOffset,
                height: `calc(100vh - ${topOffset})`,
              }
            : undefined
        }
      >
        {children}
      </Transition>
    </>
  )
}
