import React from 'react'

import DayDisplay from './DayDisplay'

type Props = {}

const styles = {
    container: "h-screen flex flex-row gap-2.5",
}

const days: number[] = [0, 1, 2, 3, 4]


const DaysContainer = (props: Props) => {
  return (
    <div className={styles.container}>
        {days.map(() => <DayDisplay />)}
    </div>
  )
}

export default DaysContainer