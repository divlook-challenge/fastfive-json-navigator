import classNames from 'classnames'
import { useMemo } from 'react'
import DataLabel from '~/src/components/DataLabel'
import useViewportSize from '~/src/hooks/useViewportSize'
import NestedData, { NestedDataBookmark } from '~/src/libs/NestedData'

export type Props = {
    data: NestedData
    border?: boolean
    bookmark?: NestedDataBookmark
    updateBookmark?: (bookmark: NestedDataBookmark) => void
}
const NestedDataView = (props: Props) => {
    const { isMobileSize } = useViewportSize()

    const selectedChild = useMemo(() => {
        const selectedChildLabel = props.bookmark?.[props.data.path]

        return props.data.childMap.get(selectedChildLabel!) ?? null
    }, [props.bookmark, props.data.childMap, props.data.path])

    function selectChild(child: NestedData) {
        props.updateBookmark?.({
            ...props?.bookmark,
            [props.data.path]: child.label,
        })
    }

    return (
        <div className="flex flex-row">
            <div
                className={classNames([
                    isMobileSize ? 'flex-1' : 'min-w-[200px]',
                    {
                        border: !!props.border,
                    },
                ])}
            >
                {props.data.childs.map((child, key) => {
                    const isLastChild = props.data.childs.length - 1 === key
                    const hasChild = child.childs.length > 0
                    const isActive = child.label === selectedChild?.label
                    const isDisplayedChild = isMobileSize && isActive

                    return (
                        <div key={child.label}>
                            <div
                                className={classNames('p-2', {
                                    'cursor-pointer': hasChild,
                                    'bg-yellow-300': isActive && !isMobileSize,
                                    'border-b': !!props.border,
                                    'border-b-0':
                                        !!props.border &&
                                        (isLastChild || isDisplayedChild),
                                })}
                                onClick={() => {
                                    if (hasChild) {
                                        selectChild(child)
                                    }
                                }}
                            >
                                <DataLabel
                                    hasChild={hasChild}
                                    isActive={isActive}
                                >
                                    {child.label}
                                </DataLabel>
                            </div>
                            {isDisplayedChild && (
                                <div className="mt-1 pl-5">
                                    <NestedDataView
                                        data={selectedChild}
                                        bookmark={props.bookmark}
                                        updateBookmark={props.updateBookmark}
                                    />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {!isMobileSize && props.data.isParentOf(selectedChild) && (
                <NestedDataView
                    data={selectedChild}
                    border
                    bookmark={props.bookmark}
                    updateBookmark={props.updateBookmark}
                />
            )}
        </div>
    )
}

export default NestedDataView
