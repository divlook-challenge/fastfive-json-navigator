export type NestedDataLabel = string | number

export type JsonPrimitive = NestedDataLabel | boolean | null

export type NestedJsonValue =
    | JsonPrimitive
    | JsonPrimitive[]
    | NestedJson
    | NestedJson[]

export type NestedJsonValueWithoutPrimitive = Exclude<
    NestedJsonValue,
    JsonPrimitive
>

export type NestedJson = {
    [key: NestedDataLabel]: NestedJsonValue
}

export type NestedDataBookmark = {
    [key: NestedData['path']]: NestedData['label']
}

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

    createChild(label: JsonPrimitive) {
        const key = `${label}`
        const child = this.childMap.get(key) || new NestedData(key, this)
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

        let json: NestedJson | null = null

        try {
            json = JSON.parse(text)

            if (!json || !NestedData.isNestedJson(json)) {
                return root
            }

            NestedData.parseAndInsertChild(root, json)

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

    static parseAndInsertChild(parent: NestedData, json: NestedJsonValue) {
        if (!NestedData.isNestedJson(json)) return

        const isArray = Array.isArray(json)
        const keys = isArray ? json.map((_, index) => index) : Object.keys(json)

        keys.forEach((key) => {
            const value = isArray ? json[key as number] : json[key]

            if (NestedData.isNestedJson(value)) {
                const child = parent.createChild(key)
                NestedData.parseAndInsertChild(child, value)
            } else {
                const last = `${key}`.split('.').reduce((top, label) => {
                    return top.createChild(label)
                }, parent)

                last.createChild(value)
            }
        })
    }

    static isNestedJson(
        json: NestedJsonValue,
    ): json is NestedJsonValueWithoutPrimitive {
        return !!json && (typeof json === 'object' || Array.isArray(json))
    }
}

export default NestedData
