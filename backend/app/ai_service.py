import ollama


MODEL_NAME = "llama3.2:3b"


def generate_follow_up(
    name: str,
    company: str,
    event: str,
    notes: str,
):
    prompt = f"""
You are a professional sales follow-up assistant.

Create a short, friendly and professional follow-up
message for an event lead.

Lead name: {name}
Company: {company}
Event: {event}
Interaction notes: {notes}

Requirements:
- Mention the event naturally.
- Refer to the lead's actual interest from the notes.
- Keep the message concise.
- Do not invent information.
- Include a clear next step.
- Do not use aggressive sales language.
- Return only the message.
"""

    response = ollama.chat(
        model=MODEL_NAME,
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
    )

    return response["message"]["content"]