import { useState } from 'react'
import NestedData from '~/src/libs/NestedData'
import mockData from '~/src/mocks/data.json'

const useNestedData = (
    defaultValue: Record<string, NestedData['label']> = mockData,
) => {
    const [rootData, setRootData] = useState<NestedData | null>(
        NestedData.parseData(JSON.stringify(defaultValue)),
    )

    const [bookmark, setBookmark] = useState<{
        [key: NestedData['path']]: NestedData['label']
    }>({})

    return {
        rootData,
        bookmark,
        setRootData,
        setBookmark,
    }
}

export default useNestedData
