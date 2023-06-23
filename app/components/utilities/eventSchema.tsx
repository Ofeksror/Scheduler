interface eventSchema {
    title: string,

    start: Date,
    end: Date,

    urgent?: boolean;
    important?: boolean;
    
    description: string,
}

export default eventSchema