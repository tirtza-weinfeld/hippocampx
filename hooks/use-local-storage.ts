"use client"

import { useState, useEffect, useRef } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: {
    serialize?: (value: T) => string
    deserialize?: (value: string) => T
  } = {}
): [T, (value: T | ((val: T) => T)) => void] {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  } = options

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? deserialize(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Keep track of the last known localStorage value to detect external changes
  const lastKnownValue = useRef<string | null>(null)

  // Sync with localStorage changes from other components
  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkForChanges = () => {
      try {
        const currentValue = window.localStorage.getItem(key)

        // Only update if the value actually changed from what we last knew
        if (currentValue !== lastKnownValue.current) {
          lastKnownValue.current = currentValue

          if (currentValue === null) {
            setStoredValue(initialValue)
          } else {
            const parsedValue = deserialize(currentValue)
            setStoredValue(parsedValue)
          }
        }
      } catch (error) {
        console.warn(`Error syncing localStorage key "${key}":`, error)
      }
    }

    // Check for changes every 100ms (lightweight polling)
    const interval = setInterval(checkForChanges, 100)

    // Initial sync
    checkForChanges()

    return () => clearInterval(interval)
  }, [key, initialValue, deserialize])

  // Set initial lastKnownValue
  useEffect(() => {
    if (typeof window !== 'undefined') {
      lastKnownValue.current = window.localStorage.getItem(key)
    }
  }, [key])

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)

      if (typeof window !== 'undefined') {
        const serializedValue = serialize(valueToStore)
        window.localStorage.setItem(key, serializedValue)
        lastKnownValue.current = serializedValue
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}