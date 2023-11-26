export type NestedDataLabel = string | number

class NestedData {
    path: string
    childMap = new Map<NestedDataLabel, NestedData>()

    constructor(
        public label: NestedDataLabel,
        parent?: NestedData,
    ) {
        const paths = [`${label}`]

        if (parent?.path) {
            paths.unshift(parent.path)
        }

        this.path = paths.join('.')
    }

    get childs() {
        return Array.from(this.childMap).map(([, val]) => val)
    }

    createChild(label: NestedDataLabel) {
        const child = this.childMap.get(label) || new NestedData(label, this)
        this.childMap.set(child.label, child)
        return child
    }

    isParentOf(data: NestedData | null): data is NestedData {
        if (!data) return false

        return this.childMap.has(data.label)
    }

    static parseData(text: string) {
        const root = new NestedData(Date.now())

        root.path = '$'

        let json: Record<string, NestedDataLabel> | null = null

        try {
            json = JSON.parse(text)

            if (!json || typeof json !== 'object' || Array.isArray(json)) {
                return root
            }

            Object.keys(json).map((key) => {
                const value = json![key]

                const last = key.split('.').reduce((top, label) => {
                    return top.createChild(label)
                }, root)

                last.createChild(value)
            })

            return root
        } catch {
            return root
        }
    }

    static parseDataFromFile(file: File) {
        return new Promise<NestedData>((resolve, reject) => {
            const fileReader = new FileReader()
            fileReader.onload = (ev) => {
                resolve(NestedData.parseData(ev.target!.result as string))
            }
            fileReader.onerror = (error) => reject(error)
            fileReader.readAsText(file)
        })
    }
}

export default NestedData
