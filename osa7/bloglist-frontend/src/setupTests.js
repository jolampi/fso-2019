import '@testing-library/jest-dom/extend-expect'
jest.mock('./services/blogs')
jest.mock('./services/login')

let savedItems = {}

const localStorageMock = {
    setItem: (key, item) => {
        savedItems[key] = item
    },
    getItem: (key) => savedItems[key],
    clear: savedItems = {}
}

Object.defineProperty(window, 'localStorage', { value: localStorageMock })
