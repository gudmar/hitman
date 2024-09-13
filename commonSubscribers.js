const getShowResultInSpan = (spanRootId, observable, additionalInfo) => {
    observable.subscribe({
        next: (value) => {
            console.log(value)
            spanInId(spanRootId, value);
        },
        complete: () => spanInId( spanRootId, `Completed ${additionalInfo || ''}`),
        error: (value) => logError(value)
    })
    
}
