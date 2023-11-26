import { useEffect, useMemo, useRef, useState } from 'react'

const useViewportSize = () => {
    const timerId = useRef(setTimeout(() => {}))
    const viewportSizeLastUpdatedTime = useRef(Date.now())

    const [viewportSize, setViewportSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    })

    const isMobileSize = useMemo(
        () => viewportSize.width <= 540,
        [viewportSize.width],
    )

    useEffect(() => {
        window.addEventListener('resize', throttleUpdateViewportSize)

        return () => {
            window.removeEventListener('resize', throttleUpdateViewportSize)
        }
    }, [])

    useEffect(() => {
        viewportSizeLastUpdatedTime.current = Date.now()
    }, [viewportSize])

    function throttleUpdateViewportSize() {
        if (Date.now() - viewportSizeLastUpdatedTime.current >= 300) {
            setViewportSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
            return
        }

        clearTimeout(timerId.current)

        timerId.current = setTimeout(() => {
            setViewportSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }, 300)
    }

    return {
        viewportSize,
        isMobileSize,
    }
}

export default useViewportSize
