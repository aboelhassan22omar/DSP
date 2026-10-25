def add_two_signals(indices1, values1, indices2, values2):
    result_indices = sorted(set(list(indices1) + list(indices2)))
    result_values = []

    for index in result_indices:
        total = 0.0

        for i in range(len(indices1)):
            if indices1[i] == index:
                total += values1[i]

        for i in range(len(indices2)):
            if indices2[i] == index:
                total += values2[i]

        result_values.append(total)

    return result_indices, result_values


def multiply_signal_by_number(indices, values, number):
    result_values = []

    for value in values:
        result_values.append(value * number)

    return list(indices), result_values