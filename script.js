document.addEventListener('DOMContentLoaded', () => {
    const promptInput = document.getElementById('prompt-input');
    const responseArea = document.getElementById('response-area');
    const submitButton = document.getElementById('submit-button');

    // Get parameter input elements and value spans
    const temperatureControl = document.getElementById('temperature');
    const temperatureValueSpan = document.getElementById('temperature-value');
    const topPControl = document.getElementById('top_p');
    const topPValueSpan = document.getElementById('top_p-value');
    const topKControl = document.getElementById('top_k');
    const topKValueSpan = document.getElementById('top_k-value');
    const maxTokensControl = document.getElementById('max_tokens');
    const maxTokensValueSpan = document.getElementById('max_tokens-value');

    // Add event listeners to update the displayed value next to sliders
    temperatureControl.addEventListener('input', () => {
        temperatureValueSpan.textContent = temperatureControl.value;
    });
    topPControl.addEventListener('input', () => {
        topPValueSpan.textContent = topPControl.value;
    });
    topKControl.addEventListener('input', () => {
        topKValueSpan.textContent = topKControl.value;
    });
     maxTokensControl.addEventListener('input', () => {
        maxTokensValueSpan.textContent = maxTokensControl.value;
    });


    submitButton.addEventListener('click', async () => {
        const prompt = promptInput.value;

        if (!prompt.trim()) {
            // Optionally display a message to the user that the prompt is empty
            return;
        }

        // Get the current parameter values
        const temperature = parseFloat(temperatureControl.value);
        const topP = parseFloat(topPControl.value);
        const topK = parseInt(topKControl.value);
        const maxTokens = parseInt(maxTokensControl.value);


        // Display user's prompt
        const userMessage = document.createElement('div');
        userMessage.classList.add('user-message');
        userMessage.textContent = `You: ${prompt}`;
        responseArea.appendChild(userMessage);

        // Clear the input area immediately
        promptInput.value = '';

        // Add a loading indicator (optional, but good for UX)
        const loadingMessage = document.createElement('div');
        loadingMessage.classList.add('ai-message'); // Use AI message class for styling
        loadingMessage.textContent = 'AI: Generating response...';
        responseArea.appendChild(loadingMessage);
        responseArea.scrollTop = responseArea.scrollHeight; // Scroll to bottom


        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    temperature: temperature,
                    top_p: topP,
                    top_k: topK,
                    max_tokens: maxTokens
                 }),
            });

            // Remove loading indicator
            responseArea.removeChild(loadingMessage);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
            }

            const data = await response.json();
            const aiText = data.text;

            // Display AI's response
            const aiMessage = document.createElement('div');
            aiMessage.classList.add('ai-message');
            aiMessage.textContent = `AI: ${aiText}`;
            responseArea.appendChild(aiMessage);

        } catch (error) {
            console.error('Error:', error);
            // Display error message to the user
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('error-message'); // Add a class for error styling
            errorMessage.textContent = `Error: ${error.message}`;
            responseArea.appendChild(errorMessage);
             // Remove loading indicator if it was not removed yet
            if (responseArea.contains(loadingMessage)) {
                 responseArea.removeChild(loadingMessage);
            }
        }
         responseArea.scrollTop = responseArea.scrollHeight; # Scroll to bottom after adding message
    });
});
