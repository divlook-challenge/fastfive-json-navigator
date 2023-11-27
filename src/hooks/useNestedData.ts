import { useState } from 'react'
import NestedData, {
    NestedDataBookmark,
    NestedJson,
} from '~/src/libs/NestedData'
import mockData from '~/src/mocks/example1.json'

const useNestedData = (defaultValue: NestedJson = mockData) => {
    const [rootData, setRootData] = useState<NestedData | null>(
        NestedData.parseData(JSON.stringify(defaultValue)),
    )

    const [bookmark, setBookmark] = useState<NestedDataBookmark>({})

    return {
        rootData,
        bookmark,
        setRootData,
        setBookmark,
    }
}

export default useNestedData
