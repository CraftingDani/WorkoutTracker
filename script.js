const q = document.querySelector
const $$ = document.querySelectorAll
let newExercices = []
const urlPrefix = "/WorkoutTracker"



function runIndexPage()
{
    updateIndexWorkouts()
}


function runAddWorkoutPage()
{
    document.querySelector("[data-addWorkout]").addEventListener("click", addWorkout)
    document.querySelector("[data-addExercice]").addEventListener("click", addExercice)
}


function runDoWorkoutPage()
{
    document.querySelector("[data-finishWorkout]").addEventListener("click", finishWorkout)

    const workoutName = window.location.search.split("=").splice(-1).toString()
    const workouts = JSON.parse(localStorage.getItem("crd.workouts"))

    workouts.forEach(i =>
    {
        if(i.name != workoutName) return

        i.exercices.forEach(j =>
        {
            const exerciceContainer = document.querySelector("[data-doExerciceContainer]")
            const exerciceElement = document.querySelector("[data-doExerciceTemplate]").content.cloneNode(true)

            exerciceElement.querySelector("p").innerText = j

            exerciceContainer.append(exerciceElement)
        })
    })

    document.querySelectorAll("[data-check]").forEach(i =>
    {
        i.addEventListener("click", checkBox)
    })
}


async function registerSW() // service worker
{
    if("serviceWorker" in navigator)
    {
        try
        {
            await navigator.serviceWorker.register("./serviceWorker.js")
        }
        catch(e)
        {
            console.error("Could not register serviceWorker!", e)
        }
    }
}



function addExercice(e)
{
    const exerciceName = document.querySelector("#exercice").value
    if(exerciceName == "") return
    if(newExercices.includes(exerciceName)) return

    newExercices.push(exerciceName)

    const exerciceContainer = document.querySelector("[data-exerciceContainer]")

    const exerciceElement = document.querySelector("[data-exerciceTemplate]").content.cloneNode(true)
    exerciceElement.querySelector("p").innerText = exerciceName
    exerciceElement.querySelector("button.remove").addEventListener("click", removeExercice)
    exerciceContainer.insertBefore(exerciceElement, document.querySelector("[data-exerciceInput]"))

    document.querySelector("#exercice").value = ""
}


function addWorkout(e)
{
    const name = document.querySelector("#name").value
    if(name == "" || newExercices.length == 0) return

    const newWorkout =
    {
        name: name,
        exercices: newExercices
    }

    let workouts = JSON.parse(localStorage.getItem("crd.workouts"))
    if(workouts == undefined) workouts = []
    workouts.push(newWorkout)
    localStorage.setItem("crd.workouts", JSON.stringify(workouts))
    console.log(JSON.parse(localStorage.getItem("crd.workouts")))

    newExercices = []
    window.location.href = urlPrefix + "/"
}


function finishWorkout(e)
{
    let returning = false // return unless all checked
    document.querySelectorAll(".listItem").forEach(i =>
    {
        if(!i.classList.contains("checked")) returning = true
    })
    if(returning) return


    window.location.href = urlPrefix + "/"
    //add to history
}


function checkBox(e)
{
    e.target.parentElement.classList.toggle("checked")
}


function removeWorkout(e)
{
    const workoutName = e.target.parentElement.querySelector("a").href.split("?workout=").slice(-1).toString()
    let workouts = JSON.parse(localStorage.getItem("crd.workouts"))
    workouts = workouts.filter(obj => obj.name !== workoutName) //remove the deleted workout from array (localStorage)

    localStorage.setItem("crd.workouts", JSON.stringify(workouts))

    e.target.parentElement.remove()
    updateIndexWorkouts()
}


function removeExercice(e)
{
    const exerciceName = e.target.parentElement.querySelector("p").innerText
    console.log(exerciceName)

    newExercices = newExercices.filter(obj => obj !== exerciceName) //remove the deleted exercice from array
    
    e.target.parentElement.remove()
}


function updateIndexWorkouts()
{
    let workouts = JSON.parse(localStorage.getItem("crd.workouts"))
    if(workouts == undefined) workouts = []
    
    const workoutContainer = document.querySelector("[data-workoutContainer]")

    if(workouts.length == 0)
    {
        const p = document.createElement("p")
        p.innerText = "There are no workouts yet..."
        workoutContainer.insertBefore(p, workoutContainer.firstChild)
        return
    }

    workouts.forEach(i =>
    {
        const workout = document.querySelector("[data-workoutTemplate]").content.cloneNode(true)
        workout.querySelector("a").innerText = i.name
        workout.querySelector("a").href += "?workout=" + i.name
        workoutContainer.insertBefore(workout, workoutContainer.firstChild)
    })

    document.querySelectorAll("[data-removeWorkout]").forEach(i =>
    {
        i.addEventListener("click", removeWorkout)
    })
}



registerSW()

switch(window.location.pathname)
{
    case urlPrefix + "/":
    case urlPrefix + "/index.html":
        runIndexPage()
        break
    case urlPrefix + "/addWorkout.html":
        runAddWorkoutPage()
        break
    case urlPrefix + "/doWorkout.html":
        runDoWorkoutPage()
        break
}





// TODO
// keybord usability (enter etc)
// history

