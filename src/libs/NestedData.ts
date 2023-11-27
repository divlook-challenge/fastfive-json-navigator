export type NestedDataLabel = string | number

class NestedData {
    id = ++NestedData.lastID
    childMap = new Map<NestedDataLabel, NestedData>()

    constructor(
        public label: NestedDataLabel,
        public parent: NestedData | null = null,
    ) {}

    get childs() {
        return Array.from(this.childMap).map(([, val]) => val)
    }

    get path(): string {
        const prefix = this.parent?.path ? `${this.parent.path}.` : ''

        return `${prefix}${this.label}`
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

    static lastID = 0

    static parseData(text: string) {
        const root = new NestedData('$')

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
