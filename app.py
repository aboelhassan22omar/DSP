import os, sys, io, json, base64
from contextlib import redirect_stdout
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

os.chdir(os.path.dirname(os.path.abspath(__file__)))
sys.path.extend(["Lab 1", "Lab 2", "Lab 2/Test", "Lab 3", "Lab 4", "Lab 4/Test/Remove DC component"])
sys.dont_write_bytecode = True
from task1 import add_two_signals, multiply_signal_by_number
from Task1Test import ReadSignalFile, SignalSamplesAreEqual
from task2 import subtract_two_signals, square_signal, normalize_signal, accumulate_signal, quantize_signal
from ArithmeticTest import SignalSamplesAreEqual as Lab2SignalSamplesAreEqual
from QuanTest1 import QuantizationTest1
from QuanTest2 import QuantizationTest2
from task3 import task3
from Task4 import dft, idft, modify_component, remove_dc_component
from signalcompare import SignalComapreAmplitude, SignalComaprePhaseShift
from CompareSignals import SignalsAreEqual
from threading import Lock

run_lock = Lock()

tests = {
    "Signal1 + Signal2": "Signal1+signal2.txt",
    "Signal1 + signal3": "signal1+signal3.txt",
    "Signal1 * 5": "MultiplySignalByConstant-Signal1 - by 5.txt",
    "Signal2 * 10": "MultiplySignalByConstant-signal2 - by 10.txt",
}

lab2_tests = {
    ("subtraction", frozenset({"Signal1.txt", "Signal2.txt"})): "signal1-signal2.txt",
    ("subtraction", frozenset({"Signal1.txt", "signal3.txt"})): "signal1-signal3.txt",
    ("squaring", "Signal1.txt"): "Output squaring signal 1.txt",
    ("normalization", "Signal1.txt", -1): "normalize of signal 1 (from -1 to 1)-- output.txt",
    ("normalization", "Signal2.txt", 0): "normlize signal 2 (from 0 to 1 )-- output.txt",
    ("accumulation", "Signal1.txt"): "output accumulation for signal1.txt",
}

lab4_files = {
    "input_Signal_DFT.txt": "Lab 4/Test/DFT/",
    "DC_component_input.txt": "Lab 4/Test/Remove DC component/",
    "Input_Signal_IDFT_A,Phase.txt": "Lab 4/Test/IDFT/",
}


def read_amplitude_phase_file(path):
    amplitudes, phases = [], []
    with open(path) as file:
        for line in file.readlines()[3:]:
            amplitude, phase = line.replace("f", "").split()
            amplitudes.append(float(amplitude))
            phases.append(float(phase))
    return amplitudes, phases


def lab1(data):
    names = sorted(data["signals"])
    x1, y1 = ReadSignalFile("Lab 1/inputs/" + names[0])
    plt.style.use("dark_background")
    plt.figure(figsize=(10, 4))
    plt.plot(x1, y1, label=names[0])

    if data["operation"] == "addition":
        x2, y2 = ReadSignalFile("Lab 1/inputs/" + names[1])
        x, y = add_two_signals(x1, y1, x2, y2)
        plt.plot(x2, y2, label=names[1])
        task, name = "Addition", names[0][:-4] + " + " + names[1][:-4]
    else:
        c = float(data["constant"])
        x, y = multiply_signal_by_number(x1, y1, c)
        task, name = "Multiplication", names[0][:-4] + " * " + f"{c:g}"

    plt.plot(x, y, label="Result")
    plt.legend()
    image = io.BytesIO()
    plt.savefig(image, format="png", bbox_inches="tight")
    plt.close()

    test = ""
    if name in tests:
        output = io.StringIO()
        with redirect_stdout(output):
            SignalSamplesAreEqual(task, "Lab 1/outputs/" + tests[name], x, y)
        test = output.getvalue().strip()

    return {
        "equation": name,
        "indices": x,
        "values": y,
        "test": test,
        "expected": tests.get(name, ""),
        "plot": "data:image/png;base64," + base64.b64encode(image.getvalue()).decode(),
    }



def lab2(data):
    operation = data["operation"]
    names = data["signals"]
    folder = "Quantization" if operation == "quantization" else "Arthimatic"
    allowed = {"Quan1_input.txt", "Quan2_input.txt"} if folder == "Quantization" else {"Signal1.txt", "Signal2.txt", "signal3.txt"}
    required = 2 if operation == "subtraction" else 1
    if len(names) != required or any(name not in allowed for name in names):
        raise ValueError("Choose the required input signals.")
    x1, y1 = ReadSignalFile("Lab 2/Inputs/" + folder + "/" + names[0])
    expected, extra = "", {}
    name = names[0][:-4]
    plt.style.use("dark_background")
    fig, ax = plt.subplots(figsize=(10, 4))
    try:
        ax.plot(x1, y1, label=names[0])
        if operation == "subtraction":
            x2, y2 = ReadSignalFile("Lab 2/Inputs/Arthimatic/" + names[1])
            x, y = subtract_two_signals(x1, y1, x2, y2)
            ax.plot(x2, y2, label=names[1])
            name = "|" + name + " - " + names[1][:-4] + "|"
            expected = lab2_tests.get((operation, frozenset(names)), "")
        elif operation == "squaring":
            x, y = square_signal(x1, y1)
            name += " squared"
            expected = lab2_tests.get((operation, names[0]), "")
        elif operation == "normalization":
            lower = int(data["lower"])
            x, y = normalize_signal(x1, y1, lower, 1)
            name += f" normalized [{lower}, 1]"
            expected = lab2_tests.get((operation, names[0], lower), "")
        elif operation == "accumulation":
            x, y = accumulate_signal(x1, y1)
            name += " accumulated"
            expected = lab2_tests.get((operation, names[0]), "")
        elif operation == "quantization":
            number, mode = float(data["number"]), data["mode"]
            x, intervals, encoded, y, error, squared_errors, average_power_error = quantize_signal(x1, y1, number, mode)
            levels = 2 ** int(number) if mode == "bits" else int(number)
            name += f" quantized ({levels} levels)"
            extra = {
                "input_values": y1,
                "intervals": intervals,
                "encoded": encoded,
                "errors": error,
                "squared_errors": squared_errors,
                "average_power_error": average_power_error,
            }
            ax.plot(x, error, label="Quantization error")
            if names[0] == "Quan1_input.txt" and levels == 8: expected = "Quan1_Out.txt"
            if names[0] == "Quan2_input.txt" and levels == 4: expected = "Quan2_Out.txt"
        else:
            raise ValueError("Unknown operation.")
        ax.plot(x, y, label="Result")
        ax.legend()
        image = io.BytesIO()
        fig.savefig(image, format="png", bbox_inches="tight")
    finally:
        plt.close(fig)
    output = io.StringIO()
    if expected:
        path = "Lab 2/Outputs/" + folder + "/" + expected
        with redirect_stdout(output):
            if expected == "Quan1_Out.txt": QuantizationTest1(path, encoded, y)
            elif expected == "Quan2_Out.txt": QuantizationTest2(path, intervals, encoded, y, error)
            else: Lab2SignalSamplesAreEqual(operation.title(), path, x, y)
    return {"equation": name, "indices": x, "values": y,
            "test": output.getvalue().strip(), "expected": expected,
            "plot": "data:image/png;base64," + base64.b64encode(image.getvalue()).decode(), **extra}


def lab4(data):
    operation = data["operation"]
    names = data["signals"]
    allowed = {"Input_Signal_IDFT_A,Phase.txt"} if operation == "idft" else {"input_Signal_DFT.txt", "DC_component_input.txt"}
    if len(names) != 1 or names[0] not in allowed:
        raise ValueError("Choose the required input signal.")
    path = lab4_files[names[0]] + names[0]
    name, test, expected, extra = names[0][:-4], "", "", {}
    plt.style.use("dark_background")
    fig, ax = plt.subplots(figsize=(10, 4))
    try:
        if operation == "idft":
            amplitudes, phases = read_amplitude_phase_file(path)
            y = idft(amplitudes, phases)
            x = list(range(len(y)))
            name = "IDFT of " + name
            expected = "Output_Signal_IDFT.txt"
            _, ey = ReadSignalFile("Lab 4/Test/IDFT/" + expected)
            test = "IDFT Test case " + ("passed successfully" if SignalComapreAmplitude(y, ey) else "failed")
        else:
            x1, y1 = ReadSignalFile(path)
            ax.plot(x1, y1, label=names[0])
            if operation == "dft":
                fs = float(data["fs"])
                if fs <= 0: raise ValueError("Enter a positive sampling frequency.")
                frequencies, amplitudes, normalized, phases, dominant = dft(y1, fs)
                x, y = frequencies, normalized
                name = f"DFT of {name} (Fs = {fs:g} Hz)"
                extra = {"frequencies": frequencies, "amplitudes": amplitudes, "normalized": normalized, "phases": phases, "dominant": dominant}
                plt.close(fig)
                fig, (ax, ax2) = plt.subplots(1, 2, figsize=(10, 4))
                ax.stem(frequencies, normalized)
                ax.set_title("Frequency vs Amplitude")
                ax2.stem(frequencies, phases)
                ax2.set_title("Frequency vs Phase")
                if names[0] == "input_Signal_DFT.txt":
                    expected = "Output_Signal_DFT_A,Phase.txt"
                    ea, ep = read_amplitude_phase_file("Lab 4/Test/DFT/" + expected)
                    passed = SignalComapreAmplitude([round(a, 3) for a in amplitudes], [round(a, 3) for a in ea]) and SignalComaprePhaseShift(phases, ep)
                    test = "DFT Test case " + ("passed successfully" if passed else "failed")
            elif operation == "modify":
                fs = float(data["fs"])
                index = int(data["component"])
                if not 0 <= index < len(y1): raise ValueError(f"Component index must be from 0 to {len(y1) - 1}.")
                frequencies, amplitudes, _, phases, _ = dft(y1, fs)
                amplitudes, phases = modify_component(amplitudes, phases, index, data["amplitude"], data["phase"])
                x, y = x1, idft(amplitudes, phases)
                name = f"{name} after modifying X({index})"
                extra = {"frequencies": frequencies, "amplitudes": amplitudes, "phases": phases}
            elif operation == "remove_dc":
                x, y = x1, remove_dc_component(y1)
                name += " without DC"
                if names[0] == "DC_component_input.txt":
                    expected = "DC_component_output.txt"
                    output = io.StringIO()
                    with redirect_stdout(output):
                        SignalsAreEqual("Remove DC", "Lab 4/Test/Remove DC component/" + expected, x, y)
                    test = output.getvalue().strip()
            else:
                raise ValueError("Unknown operation.")
        if operation != "dft":
            ax.plot(x, y, label="Result")
            ax.legend()
        image = io.BytesIO()
        fig.savefig(image, format="png", bbox_inches="tight")
    finally:
        plt.close(fig)
    return {"equation": name, "indices": x, "values": y, "test": test, "expected": expected,
            "plot": "data:image/png;base64," + base64.b64encode(image.getvalue()).decode(), **extra}


class Server(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/api/lab3":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps({"message": task3()}).encode())
            return
        if self.path == "/":
            self.path = "/front/index.html"
        super().do_GET()

    def do_POST(self):
        try:
            data = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
            with run_lock:
                result = {"/api/lab2/run": lab2, "/api/lab4/run": lab4}.get(self.path, lab1)(data)
            status = 200
        except (ValueError, KeyError, TypeError, IndexError) as error:
            result, status = {"error": str(error)}, 400
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(json.dumps(result).encode())


if __name__ == "__main__":
    print("Open http://localhost:5000")
    ThreadingHTTPServer(("0.0.0.0", 5000), Server).serve_forever()
