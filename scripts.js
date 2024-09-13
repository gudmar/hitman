const executeEachFunction = async(arrOfFunctions) => {
    if (!arrOfFunctions.length) return;
    await arrOfFunctions[0]();
    arrOfFunctions.splice(0, 1);
    executeEachFunction(arrOfFunctions);
}
console.log(rxjs)
executeEachFunction(OBSERVABLES_ORDER);
