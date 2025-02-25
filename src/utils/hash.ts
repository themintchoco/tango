export const newHash = () => [...Array(10)].map(() => (Math.random()+1).toString(36)[2]).join('')
