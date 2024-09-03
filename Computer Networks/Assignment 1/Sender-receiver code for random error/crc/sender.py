import socket
import random

def xor1(a, b):
    result = ""
    for i in range(1, len(b)):
        result += "0" if a[i] == b[i] else "1"
    return result

def mod2div(dividend, divisor):
    pick = len(divisor)
    tmp = dividend[:pick]
    while pick < len(dividend):
        if tmp[0] == '1':
            tmp = xor1(divisor, tmp) + dividend[pick]
        else:
            tmp = xor1('0'*pick, tmp) + dividend[pick]
        pick += 1
    if tmp[0] == '1':
        tmp = xor1(divisor, tmp)
    else:
        tmp = xor1('0'*pick, tmp)
    return tmp

def encodeData(data, key):
    l_key = len(key)
    appended_data = data + '0'*(l_key - 1)
    remainder = mod2div(appended_data, key)
    codeword = data + remainder
    return codeword, remainder

def read_file(filename):
    with open(filename, 'r') as file:
        return file.read().strip()

def inject_single_bit_error(data):
    data_list = list(data)
    index = random.randint(0, len(data_list) - 1)
    data_list[index] = '0' if data_list[index] == '1' else '1'
    return ''.join(data_list)

def inject_two_isolated_errors(data):
    data_list = list(data)
    indices = random.sample(range(len(data_list)), 2)
    for index in indices:
        data_list[index] = '0' if data_list[index] == '1' else '1'
    return ''.join(data_list)

def inject_odd_number_of_errors(data):
    num_errors = random.choice([1, 3, 5, 7])
    data_list = list(data)
    indices = random.sample(range(len(data_list)), num_errors)
    for index in indices:
        data_list[index] = '0' if data_list[index] == '1' else '1'
    return ''.join(data_list)

def inject_burst_error(data, burst_length=4):
    data_list = list(data)
    start_index = random.randint(0, len(data_list) - burst_length)
    for i in range(start_index, start_index + burst_length):
        data_list[i] = '0' if data_list[i] == '1' else '1'
    return ''.join(data_list)

def main():
    host = 'localhost'
    port = 12345
    # key = "111010101"  #crc-8
    # key="11000110011"   #crc-10
    # key="11000000000000101"  #crc-16
    key="10000001001100001011110101000011"  #crc-32
    
    data = read_file('sender_data.txt')
    codeword, remainder = encodeData(data, key)
    
    # Menu for error injection
    print("Choose the type of error to inject:")
    print("1. Single-bit error")
    print("2. Two isolated single-bit errors")
    print("3. Odd number of errors")
    print("4. Burst error")
    print("5. No error")
    
    choice = int(input("Enter your choice (1-5): "))
    
    if choice == 1:
        codeword = inject_single_bit_error(codeword)
        print("Single-bit error injected.")
    elif choice == 2:
        codeword = inject_two_isolated_errors(codeword)
        print("Two isolated single-bit errors injected.")
    elif choice == 3:
        codeword = inject_odd_number_of_errors(codeword)
        print("Odd number of errors injected.")
    elif choice == 4:
        codeword = inject_burst_error(codeword)
        print("Burst error injected.")
    elif choice == 5:
        print("No error injected.")
    else:
        print("Invalid choice. No error injected.")
    
    # Concatenate the key and the codeword, separated by a space
    message = key + " " + codeword
    
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((host, port))
        s.sendall(message.encode())

if __name__ == '__main__':
    main()
