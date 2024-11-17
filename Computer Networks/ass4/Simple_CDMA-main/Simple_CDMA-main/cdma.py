import random
import numpy as np


def welsh_code_generator(order):
    if order == 1:
        return np.array([[1]])
    prev = welsh_code_generator(order // 2)
    top = np.hstack((prev, prev))
    bottom = np.hstack((prev, -prev))
    return np.vstack((top, bottom))


def welsh_code_list(n):
    order = 1
    while order < n:
        order *= 2
    codes = welsh_code_generator(order)
    return codes[:n, :]


def simulate(n, codes):
    bits = len(codes[0])
    sent = []
    for i in range(n):
        send = random.choice([1, -1, 0])
        sent.append(send)
        if send == 0:
            x = "nothing"
        elif send == 1:
            x = "1"
        else:
            x = "0"
        print(f"station {i+1} sending {x}")
    channel = np.zeros(bits)
    for i in range(n):
        channel += sent[i] * codes[i]
    print(f"channel content: {channel}")
    for i in range(n):
        reading = np.dot(codes[i], channel) / bits
        if reading > 0:
            signal = "1"
        elif reading < 0:
            signal = "0"
        else:
            signal = "nothing"
        print(f"{signal} is read from station {i+1}")


n = int(input("number of stations: "))
codes = welsh_code_list(n)
for i in range(n):
    print(f"station {i+1} code: {codes[i]}")
while True:
    simulate(n, codes)
    next = input("enter x to exit, any other to continue\n")
    if next == 'x':
        break


