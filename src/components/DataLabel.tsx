import { PropsWithChildren } from 'react'

export interface Props extends PropsWithChildren {
    hasChild?: boolean
    isActive?: boolean
}

const DataLabel = ({ hasChild = false, isActive = false, children }: Props) => {
    const icon = () => {
        if (!hasChild) return '🟡 '
        return isActive ? '📂 ' : '📁 '
    }

    return (
        <span>
            {icon()}
            {children}
        </span>
    )
}

export default DataLabel
