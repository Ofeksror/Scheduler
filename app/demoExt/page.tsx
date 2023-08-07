"use client"
import React, { useState, useEffect } from 'react'

type Props = {}

const page = (props: Props) => {
  
    const [triggered, setTriggered] = useState<boolean>(false);
    
    const handleTrigger = (event) => {
        console.log("I was triggered!");
        setTriggered(true);
    }

    useEffect(() => {
        console.log("I was loaded!")
        window.addEventListener("frontendEventTrigger", handleTrigger)

        return () => {
            window.removeEventListener("frontendEventTrigger", handleTrigger);
        }

    }, [])


    return (
    <div>
        <p>Was I triggered?</p>
        <p> {triggered ? "YES!" : "No.."} </p>
    </div>
  )
}

export default page