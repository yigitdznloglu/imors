import sys
import numpy as np
from skimage.transform import swirl
from lucidsonicdreams import EffectsGenerator
from lucidsonicdreams import LucidSonicDream


def swirl_func(array, strength, amplitude):
    swirled_image = swirl(
        array, rotation=0, strength=100 * strength * amplitude, radius=650
    )
    return (swirled_image * 255).astype(np.uint8)


def process_audio(input_file, output_file, style):
    L = LucidSonicDream(song=input_file, style=style)
    L.hallucinate(file_name=output_file)


if __name__ == "__main__":
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    style = sys.argv[3]
    swirl_effect = EffectsGenerator(
        swirl_func, audio=input_file, strength=0.2, percussive=False
    )
    process_audio(input_file, output_file, style)
