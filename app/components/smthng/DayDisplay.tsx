import React from 'react'

import Header from './DayDisplayComponents/Header'

type Props = {}

const styles = {
    dayContainer: "h-full w-full bg-slate-300 basis-full",
}


const DayDisplay = (props: Props) => {
  return (
    <div className={styles.dayContainer}>
        <Header />
    </div>
  )
}

export default DayDisplay;