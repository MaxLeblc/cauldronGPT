const form = document.querySelector<HTMLFormElement>("form")!
const courseSelect = document.querySelector<HTMLSelectElement>("#plat")!
const ingredientsInput = document.querySelector<HTMLInputElement>("#ingrédients")!
const submitButton = document.querySelector<HTMLButtonElement>("button")!
const footer = document.querySelector<HTMLElement>("footer")!

//prompt generator
const generatePromptByCourseAndIngredients = (course: string, ingredients = "") => {
    let prompt = `Propose moi, avec une introduction sur un ton fantastique, 5 recettes de cuisine détaillée pour un ${course}`

    if (ingredients.trim()) {
        prompt += ` avec ces ingrédients: ${ingredients}`
    }

    return prompt + " !"
}

//set loading mode
const setLoadingItems = () => {
    footer.textContent = "Recherche de recettes magiques en cours..."
    footer.setAttribute("aria-busy", "true")
    submitButton.setAttribute("aria-busy", "true")
    submitButton.disabled = true
}

//remove loading mode
const removeLoadingItems = () => {
    footer.setAttribute("aria-busy", "false")
    submitButton.setAttribute("aria-busy", "false")
    submitButton.disabled = false
}

// launch prompt on submit
form.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault()
    setLoadingItems()

    //fetch API
    const api_key = import.meta.env.VITE_API_KEY

    fetch(`https://api.openai.com/v1/completions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${api_key}`
        },
        body: JSON.stringify({
            prompt: generatePromptByCourseAndIngredients(
                courseSelect.value,
                ingredientsInput.value
            ),
            max_tokens: 2000,
            model: "text-davinci-003",
        })
    }).then(response => response.json())
        .then(data => {
            footer.innerHTML = translateTextToHtml(data.choices[0].text)
        })
        .finally(() => {
            removeLoadingItems()
        })
})

const translateTextToHtml = (text: string) => {
    return text.split("\n").map(str => `<p>${str}</p>`).join("")
}