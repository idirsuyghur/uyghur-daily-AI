#!/usr/bin/env python3
"""
NVIDIA Agent (no hardcoded key)
- Reads API key from NVIDIA_API_KEY
- Streaming chat loop
"""

import os
from openai import OpenAI

MODEL = "nvidia/llama-3.3-nemotron-super-49b-v1.5"
BASE_URL = "https://integrate.api.nvidia.com/v1"


def get_client() -> OpenAI:
    api_key = os.getenv("NVIDIA_API_KEY")
    if not api_key:
        raise RuntimeError("Missing NVIDIA_API_KEY. Set it first, e.g. export NVIDIA_API_KEY='...' ")
    return OpenAI(base_url=BASE_URL, api_key=api_key)


def ask(client: OpenAI, prompt: str) -> None:
    stream = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "/think"},
            {"role": "user", "content": prompt},
        ],
        temperature=0.6,
        top_p=0.95,
        max_tokens=4096,
        frequency_penalty=0,
        presence_penalty=0,
        stream=True,
    )

    print("Agent:", end=" ", flush=True)
    for chunk in stream:
        text = chunk.choices[0].delta.content
        if text:
            print(text, end="", flush=True)
    print()


def main() -> None:
    client = get_client()
    print("NVIDIA agent created. Type 'exit' to quit.")

    while True:
        user_input = input("You: ").strip()
        if user_input.lower() in {"exit", "quit"}:
            print("Bye")
            return
        if not user_input:
            continue
        ask(client, user_input)


if __name__ == "__main__":
    main()
