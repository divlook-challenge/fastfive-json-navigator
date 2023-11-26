import { useState } from 'react'
import DataFromFile from '~/src/components/DataFromFile'
import NestedDataView from '~/src/components/NestedDataView'
import NestedData from '~/src/libs/NestedData'
import mockData from '~/src/mocks/data.json'

const App = () => {
    const [rootData, setRootData] = useState<NestedData | null>(
        NestedData.parseData(JSON.stringify(mockData)),
    )

    const [bookmark, setBookmark] = useState<{
        [key: NestedData['path']]: NestedData['label']
    }>({})

    return (
        <>
            <div className="flex h-screen flex-col p-2">
                <div className="mb-2 flex flex-row items-center bg-slate-300 p-2">
                    <div className="flex-shrink">JSON Navigator</div>
                    <div className="ml-auto">
                        <DataFromFile
                            onParseSuccess={(data) => {
                                setRootData(data)
                            }}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-auto bg-slate-300">
                    {rootData && (
                        <div className="min-w-min p-2">
                            <NestedDataView
                                key={rootData.label}
                                data={rootData}
                                border
                                bookmark={bookmark}
                                updateBookmark={setBookmark}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default App
