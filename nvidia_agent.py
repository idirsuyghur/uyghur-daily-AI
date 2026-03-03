#!/usr/bin/env python3
"""
Simple NVIDIA-hosted LLM agent using the OpenAI Python client.

Usage:
  export NVIDIA_API_KEY='your_key_here'
  python3 nvidia_agent.py
"""

import os
from openai import OpenAI


def stream_once(user_prompt: str) -> None:
    api_key = os.getenv("NVIDIA_API_KEY")
    if not api_key:
        raise RuntimeError("NVIDIA_API_KEY is not set. Export it first.")

    client = OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=api_key,
    )

    completion = client.chat.completions.create(
        model="nvidia/llama-3.3-nemotron-super-49b-v1.5",
        messages=[
            {"role": "system", "content": "/think"},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.6,
        top_p=0.95,
        max_tokens=4096,
        frequency_penalty=0,
        presence_penalty=0,
        stream=True,
    )

    for chunk in completion:
        delta = chunk.choices[0].delta.content
        if delta is not None:
            print(delta, end="", flush=True)
    print()


def main() -> None:
    print("NVIDIA Agent ready. Type 'exit' to quit.")
    while True:
        prompt = input("\nYou: ").strip()
        if prompt.lower() in {"exit", "quit"}:
            print("Bye.")
            break
        if not prompt:
            continue
        print("Agent: ", end="", flush=True)
        stream_once(prompt)


if __name__ == "__main__":
    main()
