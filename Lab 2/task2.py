def subtract_two_signals(indices1, values1, indices2, values2):
    result_indices = sorted(set(list(indices1) + list(indices2)))
    result_values = []

    for index in result_indices:
        difference = 0.0

        for i in range(len(indices1)):
            if indices1[i] == index:
                difference += values1[i]

        for i in range(len(indices2)):
            if indices2[i] == index:
                difference -= values2[i]

        result_values.append(abs(difference))

    return result_indices, result_values


def square_signal(indices, values):
    result_values = []

    for value in values:
        result_values.append(float(value) * float(value))

    return list(indices), result_values


def normalize_signal(indices, values, lower=-1, upper=1):
    minimum = float(min(values))
    maximum = float(max(values))
    result_values = []

    for value in values:
        if maximum == minimum:
            normalized_value = float(lower)
        else:
            normalized_value = (float(value) - minimum) / (maximum - minimum)
            normalized_value = normalized_value * (upper - lower) + lower

        result_values.append(normalized_value)

    return list(indices), result_values


def accumulate_signal(indices, values):
    result_values = []
    total = 0.0

    for value in values:
        total += float(value)
        result_values.append(total)

    return list(indices), result_values




def quantize_signal(indices, values, number, mode='bits'):
    if mode not in ('bits', 'levels') or int(number) != number or number < 1:
        raise ValueError('Enter a positive integer for bits or levels.')

    if mode == 'bits':
        levels = 2 ** int(number)
    else:
        levels = int(number)

    if levels > 65536:
        raise ValueError('Use at most 16 bits or 65536 levels.')

    bits = 1
    while 2 ** bits < levels:
        bits += 1

    minimum = float(min(values))
    maximum = float(max(values))
    width = (maximum - minimum) / levels

    interval_indices = []
    encoded_values = []
    quantized_values = []
    errors = []
    squared_errors = []

    for value in values:
        interval = int((float(value) - minimum) / width)

        if interval == levels:
            interval = levels - 1

        interval_minimum = minimum + interval * width
        interval_maximum = minimum + (interval + 1) * width
        midpoint = (interval_minimum + interval_maximum) / 2
        quantized_value = round(midpoint, 3)

        binary_value = bin(interval)[2:]
        encoded_value = binary_value.zfill(bits)

        error = round(quantized_value - float(value), 3)
        squared_error = round(error ** 2, 6)

        interval_indices.append(interval + 1)
        encoded_values.append(encoded_value)
        quantized_values.append(quantized_value)
        errors.append(error)
        squared_errors.append(squared_error)

    average_power_error = sum(squared_errors) / len(squared_errors)

    return list(indices),interval_indices,encoded_values,quantized_values,errors,squared_errors,average_power_error