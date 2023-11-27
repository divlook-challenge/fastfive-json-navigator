import DataFromFile from '~/src/components/DataFromFile'
import NestedDataView from '~/src/components/NestedDataView'
import useNestedData from '~/src/hooks/useNestedData'

const App = () => {
    const nestedData = useNestedData()

    return (
        <>
            <div className="flex h-screen flex-col p-2">
                <div className="mb-2 flex flex-row items-center bg-slate-300 p-2">
                    <div className="flex-shrink">JSON Navigator</div>
                    <div className="ml-auto">
                        <DataFromFile
                            onParseSuccess={(data) => {
                                nestedData.setRootData(data)
                            }}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-auto bg-slate-300">
                    {nestedData.rootData && (
                        <div className="min-w-min p-2">
                            <NestedDataView
                                key={nestedData.rootData.id}
                                data={nestedData.rootData}
                                border
                                bookmark={nestedData.bookmark}
                                updateBookmark={nestedData.setBookmark}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default App
