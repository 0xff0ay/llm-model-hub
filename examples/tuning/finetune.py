"""
Example: Fine-tuning Setup
Setup fine-tuning job
"""

import asyncio
from src.python.tuning.tuner import ModelTuner, TuningConfig, TuningMethod, TuningBackend, DatasetConfig():
    """Run


async def main fine-tuning example"""
    print("=== LLM-Model Hub - Fine-tuning Setup ===\n")

    tuner = ModelTuner(backend=TuningBackend.HUGGINGFACE)

    # Configure training
    config = TuningConfig(
        base_model="meta-llama/Llama-3.1-8B-Instruct",
        method=TuningMethod.LORA,
        learning_rate=2e-4,
        num_epochs=3,
        batch_size=4,
        max_seq_length=2048,
        lora_r=8,
        lora_alpha=16,
        lora_dropout=0.05
    )

    # Dataset config
    dataset = DatasetConfig(
        train_file="./data/train.jsonl",
        validation_file="./data/valid.jsonl",
        format="jsonl"
    )

    # Create job
    job = await tuner.create_training_job(config, dataset, name="my-finetune")

    print(f"Created training job: {job.id}")
    print(f"Model: {job.model}")
    print(f"Method: {job.method}")

    # Monitor progress
    while job.status == "running":
        print(f"Progress: {job.progress * 100:.1f}% | Step: {job.current_step} | Loss: {job.loss:.4f}")
        await asyncio.sleep(2)

    print(f"\nJob status: {job.status}")
    if job.error:
        print(f"Error: {job.error}")


if __name__ == "__main__":
    asyncio.run(main())
