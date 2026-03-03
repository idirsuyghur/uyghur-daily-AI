#!/usr/bin/env python3
"""
Universal NVIDIA API Agent (no hardcoded key)
- Reads API key from NVIDIA_API_KEY
- Lets you choose any model from the NVIDIA catalog
- Streaming chat loop

Usage examples:
  export NVIDIA_API_KEY='...'
  python3 nvidia_agent_v3.py
  python3 nvidia_agent_v3.py --model minimaxai/minimax-m2.5
  python3 nvidia_agent_v3.py --model deepseek-ai/deepseek-v3.2 --system "You are a coding assistant"
"""

import argparse
import os
from openai import OpenAI

BASE_URL = "https://integrate.api.nvidia.com/v1"
DEFAULT_MODEL = "minimaxai/minimax-m2.5"


def get_client() -> OpenAI:
    api_key = os.getenv("NVIDIA_API_KEY")
    if not api_key:
        raise RuntimeError("Missing NVIDIA_API_KEY. Set it first: export NVIDIA_API_KEY='...' ")
    return OpenAI(base_url=BASE_URL, api_key=api_key)


def ask(client: OpenAI, model: str, system_prompt: str, prompt: str, max_tokens: int) -> None:
    stream = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt},
        ],
        temperature=0.6,
        top_p=0.95,
        max_tokens=max_tokens,
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
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default=DEFAULT_MODEL, help="Model ID, e.g. minimaxai/minimax-m2.5")
    parser.add_argument("--system", default="/think", help="System prompt")
    parser.add_argument("--max-tokens", type=int, default=4096)
    args = parser.parse_args()

    client = get_client()
    print(f"NVIDIA agent ready with model: {args.model}")
    print("Type 'exit' to quit.")

    while True:
        user_input = input("You: ").strip()
        if user_input.lower() in {"exit", "quit"}:
            print("Bye")
            return
        if not user_input:
            continue
        ask(client, args.model, args.system, user_input, args.max_tokens)


if __name__ == "__main__":
    main()
