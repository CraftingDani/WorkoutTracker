const q = document.querySelector
const $$ = document.querySelectorAll
let newExercices = []



function runIndexPage()
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
}


function runAddWorkoutPage()
{
    document.querySelector("[data-addWorkout]").addEventListener("click", addWorkout)
    document.querySelector("[data-addExercice]").addEventListener("click", addExercice)
}


function runDoWorkoutPage()
{
    document.querySelector("[data-finishWorkout]").addEventListener("click", finishWorkout)

    const workoutName = window.location.search.split("=")[1]
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
    const exercice = document.querySelector("#exercice").value
    if(exercice == "") return

    newExercices.push(exercice)

    const exerciceContainer = document.querySelector("[data-exerciceContainer]")

    const exerciceElement = document.querySelector("[data-exerciceTemplate]").content.cloneNode(true)
    exerciceElement.querySelector("p").innerText = exercice
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
    window.location.href = "/"
}


function finishWorkout(e)
{
    
}


function checkBox(e)
{
    e.target.parentElement.classList.toggle("checked")
}



registerSW()

switch(window.location.pathname)
{
    case "/":
    case "/index.html":
        runIndexPage()
        break
    case "/addWorkout.html":
        runAddWorkoutPage()
        break
    case "/doWorkout.html":
        runDoWorkoutPage()
        break
}





// TODO
// keybord usability (enter etc)
// history
// delete items
