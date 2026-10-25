import math

def dft(values, fs):
    N = len(values)
    X = []

    for k in range(N):
        total = 0

        for n in range(N):
            angle = 2 * math.pi * k * n / N
            total += values[n] * complex(math.cos(angle), -math.sin(angle))

        X.append(total)

    amplitudes = []
    phases = []

    for k in range(N):
        amplitudes.append(math.sqrt(X[k].real ** 2 + X[k].imag ** 2))
        phases.append(math.atan2(X[k].imag, X[k].real))

    Ts = 1 / fs
    omega = 2 * math.pi / (N * Ts)
    frequencies = []
    normalized = []
    dominant = []
    maxx = max(amplitudes)

    for k in range(N):
        frequencies.append(omega * (k + 1))
        normalized.append(amplitudes[k] / maxx)

        if normalized[k] > 0.5:
            dominant.append(frequencies[k])

    return frequencies, amplitudes, normalized, phases, dominant

def idft(amplitudes, phases):
    N = len(amplitudes)
    values = []

    for n in range(N):
        total = 0

        for k in range(N):
            real = amplitudes[k] * math.cos(phases[k])
            imaginary = amplitudes[k] * math.sin(phases[k])
            angle = 2 * math.pi * n * k / N
            total += complex(real, imaginary) * complex(math.cos(angle), math.sin(angle))

        values.append(round(total.real / N, 3))

    return values

def remove_dc_component(values):
    frequencies, amplitudes, normalized, phases, dominant = dft(values, 1)
    amplitudes[0] = 0

    return idft(amplitudes, phases)

def modify_component(amplitudes, phases, k, amplitude, phase):
    N = len(amplitudes)
    opposite = N - k

    if k == 0:
        opposite = 0

    if amplitude != "":
        amplitudes[k] = float(amplitude)
        amplitudes[opposite] = float(amplitude)

    if phase != "":
        phases[opposite] = -float(phase)
        phases[k] = float(phase)

    return amplitudes, phases