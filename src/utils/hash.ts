export const newHash = () => [...Array(6)].map(() => (Math.random()+1).toString(36)[2]).join('')
