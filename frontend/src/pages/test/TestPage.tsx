import React, { useCallback, useState } from 'react'

export default function TestPage() {
    const [ inputValue, setInputValue ] = useState('')
    const [ inputHistory, setInputHistory ] = useState<string[]>([])
    
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
        setInputHistory(prevHistory => [ ...prevHistory, e.target.value ])
    }, [])

    return (
        <div>
            <p>Enter text: </p>
            <input type='text' onChange={handleInputChange} value={inputValue} />
            <ul>
                {
                    inputHistory.map((item, ind) => (
                        <li key={ind}>{item}</li>
                    ))
                }
            </ul>
        </div>
    )
}