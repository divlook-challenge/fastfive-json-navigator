import { useRef } from 'react'
import NestedData from '~/src/libs/NestedData'

export interface Props {
    onParseSuccess?: (data: NestedData) => void
}

const DataFromFile = (props: Props) => {
    const fileEl = useRef<HTMLInputElement>(null)

    async function onChangeFile(ev: React.ChangeEvent<HTMLInputElement>) {
        const file = ev.target.files?.[0]

        if (file) {
            const root = await NestedData.parseDataFromFile(file)

            props.onParseSuccess?.(root)
        }
    }

    return (
        <>
            <button
                className="inline-block cursor-pointer rounded bg-blue-500 px-2 py-1 text-white shadow"
                onClick={() => {
                    if (fileEl.current) {
                        fileEl.current.value = ''
                        fileEl.current.click()
                    }
                }}
            >
                파일 선택
            </button>
            <input
                ref={fileEl}
                type="file"
                accept=".json"
                hidden
                onChange={onChangeFile}
            />
        </>
    )
}

export default DataFromFile
